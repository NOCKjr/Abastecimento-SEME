from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "cpf",
            "password",
            "is_staff",
            "is_superuser",
            "can_write_cadastros",
            "can_write_frota",
            "can_create_guia_abastecimento",
            "can_edit_guia_abastecimento",
            "can_delete_guia_abastecimento",
        )
        read_only_fields = ("id", "is_superuser")

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = Usuario(**validated_data)

        if not password:
            raise serializers.ValidationError({"password": "Este campo é obrigatório."})

        try:
            validate_password(password, user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            try:
                validate_password(password, instance)
            except DjangoValidationError as e:
                raise serializers.ValidationError({"password": list(e.messages)})
            instance.set_password(password)

        instance.save()
        return instance


class UsuarioRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Usuario
        fields = (
            "id",
            "cpf",
            "password",
            "first_name",
            "last_name",
            "email",
        )
        read_only_fields = ("id",)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = Usuario(**validated_data)

        user.is_staff = False
        user.is_superuser = False

        user.can_write_cadastros = False
        user.can_write_frota = False
        user.can_create_guia_abastecimento = True
        user.can_edit_guia_abastecimento = False
        user.can_delete_guia_abastecimento = False

        try:
            validate_password(password, user)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        user.set_password(password)
        user.save()
        return user


class UsuarioPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = (
            "id",
            "cpf",
            "first_name",
            "last_name",
            "email",
            "is_staff",
            "is_superuser",
            "can_write_cadastros",
            "can_write_frota",
            "can_create_guia_abastecimento",
            "can_edit_guia_abastecimento",
            "can_delete_guia_abastecimento",
        )
        read_only_fields = ("id", "cpf", "is_superuser")


class UsuarioSelfUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = (
            "first_name",
            "last_name",
            "email",
            "cpf",
            "password",
        )

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            try:
                validate_password(password, instance)
            except DjangoValidationError as e:
                raise serializers.ValidationError({"password": list(e.messages)})
            instance.set_password(password)

        instance.save()
        return instance
