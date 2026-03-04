from django.db import models
from apps.frota.models import Condutor, Veiculo
from apps.cadastros.models import Secretaria, Rota, Instituicao
from apps.usuarios.models import Usuario


class GuiaAbastecimento(models.Model):
    data_emissao = models.DateField()
    tipo_servico = models.CharField(max_length=100)
    tipo_combustivel = models.CharField(max_length=50)

    qtd_combustivel = models.DecimalField(max_digits=8, decimal_places=3)
    qtd_oleo_lubrificante = models.DecimalField(max_digits=8, decimal_places=3)

    hodometro = models.IntegerField()
    observacao = models.TextField(blank=True)

    condutor = models.ForeignKey(Condutor, on_delete=models.CASCADE)
    instituicao = models.ForeignKey(Instituicao, on_delete=models.CASCADE)
    rota = models.ForeignKey(Rota, on_delete=models.CASCADE)
    secretaria = models.ForeignKey(Secretaria, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    veiculo = models.ForeignKey(Veiculo, on_delete=models.CASCADE)

    def __str__(self):
        return f"Guia {self.id}"