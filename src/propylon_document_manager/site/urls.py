from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework.authtoken.views import ObtainAuthToken

# API URLS
urlpatterns = [
    # API base url
    path("api/", include("propylon_document_manager.site.api_router")),
    # DRF auth token
    path("api-auth/", include("rest_framework.urls")),
    path("auth-token/", ObtainAuthToken.as_view(), name="auth-token"),
]

if settings.DEBUG:
    if "debug_toolbar" in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


