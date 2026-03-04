from rest_framework.routers import DefaultRouter
from .views import VeiculoViewSet, CondutorViewSet

router = DefaultRouter()
router.register(r'veiculos', VeiculoViewSet)
router.register(r'condutores', CondutorViewSet)

urlpatterns = router.urls