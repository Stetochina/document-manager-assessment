from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from propylon_document_manager.file_versions.api.views import FileRevisionViewSet

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("file_versions", FileRevisionViewSet, basename="file_versions")


app_name = "api"
urlpatterns = router.urls
