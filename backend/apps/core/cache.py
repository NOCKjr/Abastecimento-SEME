from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from urllib.parse import urlencode

from django.core.cache import cache
from django.db.models import Model
from rest_framework.response import Response


DEFAULT_CACHE_TTL_SECONDS = 60 * 10  # 10 min


def _model_label(model: type[Model]) -> str:
    return f"{model._meta.app_label}.{model._meta.model_name}"


def _version_key(model: type[Model]) -> str:
    return f"cache:model_version:{_model_label(model)}"


def get_model_cache_version(model: type[Model]) -> int:
    key = _version_key(model)
    v = cache.get(key)
    if isinstance(v, int) and v > 0:
        return v
    cache.set(key, 1, None)
    return 1


def bump_model_cache_version(model: type[Model]) -> int:
    key = _version_key(model)
    try:
        return int(cache.incr(key))
    except Exception:
        cache.set(key, 2, None)
        return 2


def build_view_cache_key(
    *,
    model: type[Model],
    action: str,
    user_id: Any,
    query_params: dict[str, Any],
) -> str:
    version = get_model_cache_version(model)

    items = []
    for k, v in query_params.items():
        if isinstance(v, list):
            for vv in v:
                items.append((k, vv))
        else:
            items.append((k, v))
    items.sort(key=lambda kv: (kv[0], str(kv[1])))

    qp = urlencode(items, doseq=True)
    return f"cache:view:{_model_label(model)}:v{version}:{action}:u{user_id}:{qp}"


@dataclass(frozen=True)
class CachedResponse:
    status_code: int
    data: Any


def cache_response(key: str, response: Response, ttl_seconds: int = DEFAULT_CACHE_TTL_SECONDS) -> None:
    if response.status_code != 200:
        return
    cache.set(key, CachedResponse(status_code=response.status_code, data=response.data), ttl_seconds)


def get_cached_response(key: str) -> CachedResponse | None:
    cached = cache.get(key)
    if isinstance(cached, CachedResponse):
        return cached
    return None

