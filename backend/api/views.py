from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

def home(request):
    return JsonResponse({"status": "API funcionando"})


@api_view(['GET'])
def hello(request):
    return Response({"message": "Olá! API funcionando :)"})


@api_view(['GET'])
@permission_classes([IsAuthenticated]) # <--- Isso bloqueia anônimos
def protected_data(request):
    return Response({"message": f"Olá {request.user.username}, você está autenticado!"})