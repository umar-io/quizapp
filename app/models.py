from django.db import models

class Student(models.Model):
    image = models.ImageField(upload_to='profile_images/', null=True, blank=True) 
    username = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    answer_correct = models.IntegerField(default=0)
    percentage = models.IntegerField(default=0)
    grade = models.CharField(max_length=100, default="No grade")
    remark = models.CharField(max_length=100, default="No remark")

    def __str__(self):
        return self.username 