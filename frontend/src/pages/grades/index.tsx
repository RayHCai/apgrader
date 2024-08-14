import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import Button from '@/components/button';

import { BACKEND_URL } from '@/settings';

import classes from './styles.module.css';

export default function Grades() {
    const [searchParams, _] = useSearchParams();
    const id = searchParams.get('id');

    const [studentAnswerGrades, updateStudentAnswerGrades] = useState<Grade[]>(
        []
    );

    const curStudentResponse = useRef<HTMLTextAreaElement>(null);

    async function send() {
        const studentResponse = curStudentResponse.current?.value;

        const response = await fetch(`${BACKEND_URL}/grade/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                // eslint-disable-next-line camelcase
                student_response: studentResponse,
            }),
        });

        if (!response.ok) return;

        const data = await response.json();
        const grades = data.grades;

        const studentGrade: Grade = {
            studentResponse: studentResponse!,
            grades: grades,
        };

        updateStudentAnswerGrades([...studentAnswerGrades, studentGrade]);
    }

    return (
        <div className={ classes.container }>
            <h1>grades</h1>

            <div className={ classes.studentAnswerContainer }>
                <div className={ classes.textareaContainer }>
                    <h3>student response</h3>

                    <textarea ref={ curStudentResponse } />
                </div>

                <div className={ classes.sendButtonContainer }>
                    <Button isDark={ true } onClick={ send }>
                        send
                    </Button>

                    <Button isDark={ true }>next</Button>
                </div>
            </div>
        </div>
    );
}
