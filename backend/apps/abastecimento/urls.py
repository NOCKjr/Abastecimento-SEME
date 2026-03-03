from rest_framework.routers import DefaultRouter
from .views import AbastecimentoViewSet

router = DefaultRouter()
router.register(r'abastecimentos', AbastecimentoViewSet)

urlpatterns = router.urls