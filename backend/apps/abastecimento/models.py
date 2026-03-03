from django.db import models

class Abastecimento(models.Model):
    veiculo = models.CharField(max_length=100)
    litros = models.FloatField()
    data = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.veiculo} - {self.litros}L"

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11)
    senha = models.CharField(max_length=100)
    ativo = models.BooleanField

class Rota(models.Model):
    descricao = models.CharField(max_length=100)

class Secretaria(models.Model):
    nome = models.CharField(max_length=100)
    sigla = models.CharField(max_length=50)

class Condutor(models.Model):
    nome_completo = models.CharField(max_length=100)
    cpf = models.CharField(max_length=11)
    secretaria = models.ForeignKey(Secretaria, on_delete=models.PROTECT)

class TipoCombustivel(models.TextChoices):
    GASOLINA = "Gasolina"
    DIESEL = "Diesel"
    DIESEL_S10 = "Diesel S10"
class Veiculo(models.Model):
    placa = models.CharField(max_length=7)
    modelo = models.CharField(max_length=100)
    ano = models.IntegerField(max_length=4)
    tipo_combustivel = models.CharField(
        max_length=20, 
        choices=TipoCombustivel.choices)
    secretaria = models.ForeignKey(Secretaria, on_delete=models.PROTECT)

class Instituicao(models.Model):
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100)
    secretaria = models.ForeignKey(Secretaria, on_delete=models.PROTECT)
    rota = models.ForeignKey(Rota, on_delete=models.PROTECT)

class TipoServico(models.TextChoices):
    CAMINHONETE = "Caminhonete"
    ONIBUS = "Onibus"
    MOTOCICLETA = "Motocicleta"
    ROCAGEM = "Rocagem"
    BARQUEIRO = "Barqueiro"
class GuiaAbastecimento(models.Model):
    data_emissao = models.DateTimeField(auto_now_add=True)
    tipo_servico = models.CharField(
        max_length = 20,
        choices = TipoServico.choices)
    tipo_combustivel = models.CharField(
        max_length = 20,
        choices = TipoCombustivel.choices)
    qtd_combustivel = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    qtd_oleo_lubrificante = models.DecimalField(max_digits=4, decimal_places=2, null=True)
    hodometro = models.IntegerField(max_length=10)
    obervacao = models.CharField(max_length=200, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    secretaria = models.ForeignKey(Secretaria, on_delete=models.PROTECT)
    condutor = models.ForeignKey(Condutor, on_delete=models.PROTECT)
    veiculo = models.ForeignKey(Veiculo, on_delete=models.PROTECT)
    instituicao = models.ForeignKey(Instituicao, on_delete=models.PROTECT)
    rota = models.ForeignKey(Rota, on_delete=models.PROTECT)