from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, EmailField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _



class UserManager(BaseUserManager):
     use_in_migrations = True

     def create_user(self, **extra_fields):
         email = extra_fields.pop('email')
         password = extra_fields.pop('password')
         extra_fields.setdefault('is_staff', False)
         extra_fields.setdefault('is_superuser', False)

         if not email:
             raise ValueError('No email provided!')

         if not password:
             raise ValueError('No password provided!')

         email = self.normalize_email(email)
         user = self.model(email=email, **extra_fields)
         user.set_password(password)
         user.save(using=self._db)
         return user


class User(AbstractUser):
    email = EmailField(_('email address'), unique=True)
    name = CharField(_('full name'), max_length=255, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_absolute_url(self):
        return reverse('accounts:user_detail', kwargs={'pk': self.pk})

