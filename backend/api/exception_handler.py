from collections import Counter

from django.db import IntegrityError
from django.db.models.deletion import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def _protected_summary(exc: ProtectedError):
    objs = list(getattr(exc, "protected_objects", []) or [])
    counts = Counter(f"{o._meta.app_label}.{o._meta.model_name}" for o in objs)
    return {"total": sum(counts.values()), "by_model": dict(counts)}


def custom_exception_handler(exc, context):
    if isinstance(exc, ProtectedError):
        summary = _protected_summary(exc)
        return Response(
            {
                "detail": "Não é possível excluir este registro porque existem registros relacionados (chave estrangeira PROTECT).",
                "protected": summary,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(exc, IntegrityError):
        return Response(
            {
                "detail": "Não foi possível concluir a operação por restrição de integridade no banco de dados.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return exception_handler(exc, context)

