from django.urls import path

from .views import (
    backup_dumpdata,
    backup_sqlite_db,
    db_stats,
    flush_db_keep_superadmin,
    reset_db_and_seed_default_data,
    seed_default_data_force,
)


urlpatterns = [
    path("db/stats/", db_stats, name="core_db_stats"),
    path("db/backup/dumpdata/", backup_dumpdata, name="core_backup_dumpdata"),
    path("db/backup/sqlite/", backup_sqlite_db, name="core_backup_sqlite"),
    path("db/seed-force/", seed_default_data_force, name="core_seed_force"),
    path("db/flush/", flush_db_keep_superadmin, name="core_db_flush"),
    path("db/reset-and-seed/", reset_db_and_seed_default_data, name="core_reset_and_seed"),
]

