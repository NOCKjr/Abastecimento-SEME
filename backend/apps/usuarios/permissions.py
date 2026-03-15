from rest_framework.permissions import BasePermission, SAFE_METHODS


class CadastrosPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.is_staff or getattr(user, "can_write_cadastros", False)))


class FrotaPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.is_staff or getattr(user, "can_write_frota", False)))


class GuiaAbastecimentoPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        if not (user and user.is_authenticated):
            return False

        if user.is_staff:
            return True

        if request.method == "POST":
            return bool(getattr(user, "can_create_guia_abastecimento", False))

        if request.method in ("PUT", "PATCH"):
            return bool(getattr(user, "can_edit_guia_abastecimento", False))

        if request.method == "DELETE":
            return bool(getattr(user, "can_delete_guia_abastecimento", False))

        return False

