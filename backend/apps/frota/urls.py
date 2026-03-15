from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet, CondutorViewSet, LotacaoViewSet

router = DefaultRouter()
router.register(r'veiculos', VeiculoViewSet)
router.register(r'condutores', CondutorViewSet)
router.register(r'lotacoes', LotacaoViewSet)

urlpatterns = router.urls
