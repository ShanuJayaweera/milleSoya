from .views import RegisterAPI
from django.urls import path
from knox import views as knox_views
from .views import LoginAPI
from django.urls import path, include

from Core.api.Application.views import (
    api_application_view,
    api_update_application_view,
    api_create_application_view,
    api_application_get_all_view,
    api_delete_application_recode,
    api_application_dropdown_view
)

from Core.api.Provider.views import (
    api_provider_view,
    api_update_provider_view,
    api_create_provider_view,
    api_delete_provider_recode,
    api_provider_get_all_view,
    api_provider_dropdown_view
)

from Core.api.LicenseType.views import (
    api_LicenseType_view,
    api_LicenseType_get_all_view,
    api_update_LicenseType_view,
    api_create_LicenseType_view,
    api_delete_licenseType_recode,
    api_license_type_dropdown_view
)

from Core.api.ProviderLicense.views import (
    api_provider_license_view,
    api_provider_license_get_all_view,
    api_update_provider_license_view,
    api_create_provider_license_view,
    api_delete_provider_license_recode

)

urlpatterns = [
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login', LoginAPI.as_view(), name='login'),
    path('api/logout', knox_views.LogoutView.as_view(), name='logout'),
    path('api/logoutall', knox_views.LogoutAllView.as_view(), name='logoutall'),

    #Application urls
    path('application/<int:id>', api_application_view, name="view"),
    path('application/<id>/update', api_update_application_view, name="update"),
    path('application/create', api_create_application_view, name="create"),
    path('application/all', api_application_get_all_view, name="all_recodes"),
    path('application/<int:id>/delete', api_delete_application_recode, name="delete"),
    path('application/all/dropdown', api_application_dropdown_view, name="dropdown"),

    #Provider urls
    path('provider/<int:id>', api_provider_view, name="view"),
    path('provider/<id>/update', api_update_provider_view, name="update"),
    path('provider/create', api_create_provider_view, name="create"),
    path('provider/<int:id>/delete', api_delete_provider_recode, name="delete"),
    path('provider/all', api_provider_get_all_view, name="all_provider_recodes"),
    path('provider/all/dropdown', api_provider_dropdown_view, name="dropdown"),

    #LicenseType urls
    path('LicenseType/<int:id>', api_LicenseType_view, name="view"),
    path('LicenseType/<id>/update', api_update_LicenseType_view, name="update"),
    path('LicenseType/create', api_create_LicenseType_view, name="create"),
    path('LicenseType/<int:id>/delete', api_delete_licenseType_recode, name="delete"),
    path('LicenseType/all', api_LicenseType_get_all_view, name="all_LicenseType_recodes"),
    path('LicenseType/all/dropdown', api_license_type_dropdown_view, name="dropdown"),

    #ProviderLicense urls
    path('ProviderLicense/<int:id>', api_LicenseType_view, name="view"),
    path('ProviderLicense/<id>/update', api_update_LicenseType_view, name="update"),
    path('ProviderLicense/create', api_create_LicenseType_view, name="create"),
    path('ProviderLicense/<int:id>/delete', api_delete_licenseType_recode, name="delete"),
    path('ProviderLicense/all', api_LicenseType_get_all_view, name="all_ProviderLicense_recodes"),


]