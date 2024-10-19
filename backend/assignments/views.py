import os
import json

from PIL import Image
from io import BytesIO

from rest_framework.views import APIView
from rest_framework.response import Response

from django.core.files import File

import anthropic
import base64

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_SECRET = os.getenv("OPENAI_API_SECRET")
ANTHROPIC_API_SECRET = os.getenv("ANTHROPIC_API_SECRET")

from .models import Assignment


def gen_json_rubric(assignment):
    SYSTEM_PROMPT = """
    **TASK**:
    Given a plain-text rubric, transform it into a JSON object that follows the below format. Respond ONLY with the JSON object.

    ```json
    {
        "rubric": {
            "partA": {
                "description": string,
                "points": number,
                "requires_example": true/false,
                "requires_reference_from_scenario": true/false,
                "acceptable_responses": string[]
            },
            ....
        }
    }
    ```

    **RESPONSE**:
    """

    client = OpenAI(api_key=OPENAI_API_SECRET)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": [{"type": "text", "text": SYSTEM_PROMPT}]},
            {"role": "user", "content": [{"type": "text", "text": assignment.rubric}]},
        ],
        temperature=0,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={"type": "text"},
    )

    return response.choices[0].message.content


def gen_grades(assignment, json_rubric, student_response):
    SYSTEM_PROMPT = """
    **ROLE**: 
    You are grading AP Free Response Questions.

    **TASK**:
    Given a student response, grade using the JSON formatted rubric. There is no partial credit.

    If a part requires a reference to the scenario, the response need not use direct words from the text/question context to earn full-credit. However, an example/reference to the scenario cannot be too vague or over-arching to earn full-credit.

    Respond in the following format:

    {
        "A": {
            "score": [SCORE_FROM_RUBRIC],
            "reasoning": "[REASONING_FOR_SCORE]"
        },
        ...
    }
    """

    question = "**QUESTION_SCENARIO\n**" + assignment.question + "\n"

    PROMPT = SYSTEM_PROMPT + question + ("**RUBRIC**\n" + json_rubric + "\n")

    client = OpenAI(api_key=OPENAI_API_SECRET)

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": [{"type": "text", "text": PROMPT}]},
            {"role": "user", "content": [{"type": "text", "text": student_response}]},
        ],
        temperature=0,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={"type": "text"},
    )

    return response.choices[0].message.content


def gen_text_from_image(image):
    encoded_string = base64.b64encode(image.read()).decode("utf-8")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_SECRET)
    message = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": encoded_string,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Do not describe the image. Only extract the text from this image.  If the image is a table, the extracted text should include all of the information on the table.",
                    },
                ],
            }
        ],
    )

    return message.content[0].text


class AssignmentView(APIView):
    def get(self, request):
        """
        Get Assignment from ID
        """

        data = request.data

        assignment = Assignment.objects.get(id=data["id"])

        return Response({"assignment": assignment.question})

    def post(self, request):
        """
        Create Assignment Object
        """

        context_image = request.FILES["context_image"]
        questions_image = request.FILES["questions_image"]
        rubric_image = request.FILES["rubric_image"]

        images = [context_image, questions_image, rubric_image]
        compressed_images = []

        for image in images:
            img = Image.open(image)

            output = BytesIO()
            img.save(output, format="JPEG", quality=80)
            output.seek(0)

            compressed_images.append(File(output, name=image.name))

        context = gen_text_from_image(compressed_images[0])
        questions = gen_text_from_image(compressed_images[1])
        rubric = gen_text_from_image(compressed_images[2])

        formatted_question = context + "\n\n**QUESTIONS**\n\n" + questions

        assignment = Assignment.objects.create(
            question=formatted_question, rubric=rubric
        )

        return Response({"assignment": assignment.id})


class StudentResponseView(APIView):
    def post(self, request):
        """
        Make inferences on student grades
        """

        data = request.data

        answer_image = request.FILES["student_image"]

        img = Image.open(answer_image)

        output = BytesIO()
        img.save(output, format="JPEG", quality=80)
        output.seek(0)

        compressed_image = File(output, name=answer_image.name)

        answer = gen_text_from_image(compressed_image)

        assignment = Assignment.objects.get(id=data["id"])
        json_rubric = gen_json_rubric(assignment)

        grades = (
            gen_grades(assignment, json_rubric, answer)
            .replace("```json", "")
            .replace("```", "")
        )

        return Response({"grades": json.loads(grades)})
