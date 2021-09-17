from django.db import models

from Core.constants import AppConstants
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class ExceptionLog(models.Model):
	Id = models.AutoField(primary_key=True)
	File = models.TextField()
	Description = models.TextField()
	CreatedOn = models.DateTimeField(auto_now_add=True)
	class Meta:
		db_table = '"ExceptionLog"'
		#app_label = AppConstants.DbLabel

class ApplicationLog(models.Model):
	Id = models.AutoField(primary_key=True)
	Module = models.TextField()
	Parameters = models.TextField()
	CreatedOn = models.DateTimeField(auto_now_add=True)
	class Meta:
		db_table = '"ApplicationLog"'
		#app_label = AppConstants.DbLabel

class Application(models.Model):
	Id = models.AutoField(primary_key=True)
	Name = models.CharField(max_length=100, null=False)
	Description = models.CharField(max_length=2000, null=False)
	Status = models.SmallIntegerField()
	CreatedOn = models.DateTimeField(auto_now_add=True)
	UpdatedOn = models.DateTimeField(auto_now=True)
	class Meta:
		db_table = '"Application"'
		#app_label = AppConstants.DbLabel


class Provider(models.Model):
	Id = models.AutoField(primary_key=True)
	ExternalRef = models.IntegerField(null=False)
	Name = models.CharField(max_length=100, null=False)
	Address = models.CharField(max_length=500, null=False)
	PhoneNo = models.CharField(max_length=20)
	Email = models.CharField(max_length=100)
	Picture = models.BinaryField()
	Status = models.SmallIntegerField()
	CreatedOn = models.DateTimeField(auto_now_add=True)
	UpdatedOn = models.DateTimeField(auto_now=True)
	class Meta:
		db_table = '"Provider"'
		#app_label = AppConstants.DbLabel


class LicenseType(models.Model):
	Id = models.AutoField(primary_key=True)
	Type = models.IntegerField()
	Name = models.CharField(max_length=100, null=False)
	Description = models.CharField(max_length=2000, null=False)
	PaymentTerms = models.SmallIntegerField()
	CycleInMonths = models.IntegerField()
	Status = models.SmallIntegerField()
	CreatedOn = models.DateTimeField(auto_now_add=True)
	UpdatedOn = models.DateTimeField(auto_now=True)
	class Meta:
		db_table = '"LicenseType"'
		#app_label = AppConstants.DbLabel


class ProviderLicense(models.Model):
	Id = models.AutoField(primary_key=True)
	ProviderRef = models.ForeignKey(Provider, on_delete=models.CASCADE, db_column="ProviderRef")
	ApplicationRef = models.ForeignKey(Application, on_delete=models.CASCADE, db_column="ApplicationRef")
	LicenseTypeRef = models.ForeignKey(LicenseType, on_delete=models.CASCADE, db_column="LicenseTypeRef")
	UniqueCode = models.CharField(max_length=100, null=False)
	StartDate = models.DateTimeField()
	IsUnitsApplicable = models.SmallIntegerField()
	NoOfUnits = models.IntegerField()
	Status = models.SmallIntegerField()
	CreatedOn = models.DateTimeField(auto_now_add=True)
	UpdatedOn = models.DateTimeField(auto_now=True)
	class Meta:
		db_table = '"ProviderLicense"'
		#app_label = AppConstants.DbLabel

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
	if created:
		Token.objects.create(user=instance)