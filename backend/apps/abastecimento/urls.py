from rest_framework.routers import DefaultRouter
from .views import GuiaAbastecimentoViewSet

router = DefaultRouter()
router.register(r"guias", GuiaAbastecimentoViewSet, basename="guia")

urlpatterns = router.urls
