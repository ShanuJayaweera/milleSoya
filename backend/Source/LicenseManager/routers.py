from Core.constants import AppConstants

class DbRouter:
    def db_for_read(self, model, **hints):
        if (model._meta.app_label == AppConstants.DbLabel):
          return model._meta.app_label
        return None

    def db_for_write(self, model, **hints):
        if (model._meta.app_label == AppConstants.DbLabel):
          return model._meta.app_label
        return None

    def allow_relation(self, obj1, obj2, **hints):
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return db != AppConstants.DbLabel