from django.contrib import admin

from Core.models import *

admin.site.register(ExceptionLog)
admin.site.register(ApplicationLog)
admin.site.register(Application)
admin.site.register(Provider)
admin.site.register(LicenseType)
admin.site.register(ProviderLicense)