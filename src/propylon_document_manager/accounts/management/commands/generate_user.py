from django.core.management.base import BaseCommand
from propylon_document_manager.accounts.models import User

# extended base command to customize user creation
class Command(BaseCommand):
    help = "Create a single user instance with a user-provided password."

    def add_arguments(self, parser):
        parser.add_argument("--email", type=str, help="User's email address")
        parser.add_argument("--name", type=str, help="User's name")
        parser.add_argument("--password", type=str, help="User's password")

    def handle(self, *args, **kwargs):
        email = kwargs["email"]
        name = kwargs["name"]
        password = kwargs["password"]

        if User.objects.filter(email=email).exists():
            raise Exception(f"User with email {email} already exists")
        else:
            user = User.objects.create_user(email=email, password=password, name=name)
            print(self.style.SUCCESS(f"Successfully created user: {user.email}"))


