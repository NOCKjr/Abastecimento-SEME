from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

def home(request):
    return JsonResponse({"status": "API funcionando"})


@api_view(['GET'])
def hello(request):
    return Response({"message": "Olá! API funcionando :)"})
