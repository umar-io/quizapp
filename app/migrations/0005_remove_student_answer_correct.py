# Generated by Django 5.0.7 on 2024-08-11 14:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_student_answer_correct'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='answer_correct',
        ),
    ]
