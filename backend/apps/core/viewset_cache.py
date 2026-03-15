from __future__ import annotations

from rest_framework.response import Response

from .cache import build_view_cache_key, cache_response, get_cached_response


class ModelViewSetCacheMixin:
    cache_ttl_seconds: int = 60 * 10
    cache_list: bool = True
    cache_retrieve: bool = True

    def _cache_key(self, action: str) -> str:
        model = self.get_queryset().model
        user_id = getattr(self.request.user, "id", None)
        return build_view_cache_key(
            model=model,
            action=action,
            user_id=user_id,
            query_params=dict(self.request.query_params),
        )

    def list(self, request, *args, **kwargs):
        if request.method == "GET" and self.cache_list:
            key = self._cache_key("list")
            cached = get_cached_response(key)
            if cached:
                return Response(cached.data, status=cached.status_code)

            response = super().list(request, *args, **kwargs)
            cache_response(key, response, ttl_seconds=self.cache_ttl_seconds)
            return response

        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        if request.method == "GET" and self.cache_retrieve:
            key = self._cache_key("retrieve")
            cached = get_cached_response(key)
            if cached:
                return Response(cached.data, status=cached.status_code)

            response = super().retrieve(request, *args, **kwargs)
            cache_response(key, response, ttl_seconds=self.cache_ttl_seconds)
            return response

        return super().retrieve(request, *args, **kwargs)

