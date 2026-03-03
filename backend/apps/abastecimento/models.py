from django.db import models

class Abastecimento(models.Model):
    veiculo = models.CharField(max_length=100)
    litros = models.FloatField()
    data = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.veiculo} - {self.litros}L"