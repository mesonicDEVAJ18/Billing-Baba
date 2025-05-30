from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = None  # optional, we kill the email field
    username = models.CharField(max_length=150, unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    isphoneauth = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['username']
