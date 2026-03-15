import os
from datetime import datetime
from io import StringIO

from django.conf import settings
from django.core.management import call_command
from django.http import FileResponse, HttpResponse
from django.utils.timezone import now
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.response import Response

from .seed import ensure_superadmin, seed_force


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_superuser", False)
        )


@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def seed_default_data_force(request):
    seed_force(verbosity=0)
    return Response({"detail": "Seed carregado (force)."})


@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def reset_db_and_seed_default_data(request):
    call_command("flush", interactive=False, verbosity=0)
    call_command("migrate", verbosity=0)
    seed_force(verbosity=0)
    return Response({"detail": "Banco resetado e seed carregado."})


@api_view(["POST"])
@permission_classes([IsSuperAdmin])
def flush_db_keep_superadmin(request):
    call_command("flush", interactive=False, verbosity=0)
    ensure_superadmin()
    return Response({"detail": "Banco apagado (mantendo superadmin)."})


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def backup_dumpdata(request):
    out = StringIO()
    call_command(
        "dumpdata",
        "cadastros",
        "frota",
        "abastecimento",
        "usuarios",
        indent=2,
        stdout=out,
        verbosity=0,
    )

    ts = now().strftime("%Y%m%d_%H%M%S")
    filename = f"backup_dumpdata_{ts}.json"
    resp = HttpResponse(out.getvalue(), content_type="application/json; charset=utf-8")
    resp["Content-Disposition"] = f'attachment; filename="{filename}"'
    return resp


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def backup_sqlite_db(request):
    engine = settings.DATABASES["default"]["ENGINE"]
    if not engine.endswith("sqlite3"):
        return Response(
            {"detail": "Backup do arquivo do banco só é suportado quando o banco é SQLite."},
            status=400,
        )

    db_path = os.fspath(settings.DATABASES["default"]["NAME"])
    if not os.path.exists(db_path):
        return Response({"detail": "Arquivo do banco SQLite não encontrado."}, status=404)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"db_backup_{ts}.sqlite3"
    return FileResponse(open(db_path, "rb"), as_attachment=True, filename=filename)


@api_view(["GET"])
@permission_classes([IsSuperAdmin])
def db_stats(request):
    from apps.cadastros.models import Instituicao, Rota, Secretaria
    from apps.frota.models import Condutor, Lotacao, Veiculo
    from apps.abastecimento.models import GuiaAbastecimento
    from django.contrib.auth import get_user_model

    User = get_user_model()
    engine = settings.DATABASES["default"]["ENGINE"]

    return Response(
        {
            "database_engine": engine,
            "is_sqlite": bool(engine.endswith("sqlite3")),
            "counts": {
                "secretarias": Secretaria.objects.count(),
                "instituicoes": Instituicao.objects.count(),
                "rotas": Rota.objects.count(),
                "condutores": Condutor.objects.count(),
                "veiculos": Veiculo.objects.count(),
                "lotacoes": Lotacao.objects.count(),
                "guias_abastecimento": GuiaAbastecimento.objects.count(),
                "usuarios": User.objects.count(),
            },
        }
    )

