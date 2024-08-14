# Generated by Django 5.1 on 2024-08-14 14:54

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('question', models.TextField()),
                ('rubric', models.TextField()),
            ],
        ),
    ]
