from collections.abc import Sequence
from typing import Any

from django.contrib.auth import get_user_model
from factory import Faker, post_generation
from factory.django import DjangoModelFactory
from rest_framework.test import RequestsClient


class UserFactory(DjangoModelFactory):
    email = Faker("email")
    name = Faker("name")

    @post_generation
    def password(self, create: bool, extracted: Sequence[Any], **kwargs):
        self.raw_password = (
            extracted
            if extracted
            else Faker(
                "password",
                length=42,
                special_chars=True,
                digits=True,
                upper_case=True,
                lower_case=True,
            ).evaluate(None, None, extra={"locale": None})
        )
        self.set_password(self.raw_password)

    @classmethod
    def _after_postgeneration(cls, instance, create, results=None):
        instance.save()

    class Meta:
        model = get_user_model()
        django_get_or_create = ["email"]


class AuthorizedClientFactory:

    def __init__(self, user):
        self.user = user

    def get_client(self):
        client = RequestsClient()
        data = {
            'username': self.user.email,
            'password': self.user.raw_password
        }
        response = client.post('http://testserver/auth-token/', json=data)
        client.headers.update({'Authorization': f"Token {response.json().get('token')}"})
        return client
