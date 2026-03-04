from rest_framework.routers import DefaultRouter
from .views import SecretariaViewSet, RotaViewSet, InstituicaoViewSet

router = DefaultRouter()
router.register(r'secretarias', SecretariaViewSet)
router.register(r'rotas', RotaViewSet)
router.register(r'instituicoes', InstituicaoViewSet)

urlpatterns = router.urls