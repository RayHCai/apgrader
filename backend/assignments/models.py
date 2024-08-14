import uuid

from django.db import models


class Assignment(models.Model):
    id = models.UUIDField(
        primary_key=True, unique=True, blank=False, default=uuid.uuid4, editable=False
    )

    question = models.TextField()
    rubric = models.TextField()
