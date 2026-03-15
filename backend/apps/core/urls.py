from django.urls import path

from .views import reset_db_and_seed_default_data, seed_default_data_force


urlpatterns = [
    path("db/seed-force/", seed_default_data_force, name="core_seed_force"),
    path("db/reset-and-seed/", reset_db_and_seed_default_data, name="core_reset_and_seed"),
]

