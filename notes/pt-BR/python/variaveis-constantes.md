# Variáveis e Constantes em Python

## Declaração de Variáveis

### Criação Simples
```python
# Python usa tipagem dinâmica - não precisa declarar tipos
nome = "João"
idade = 25
altura = 1.75
ativo = True

# O tipo é determinado automaticamente
print(type(nome))    # <class 'str'>
print(type(idade))   # <class 'int'>
print(type(altura))  # <class 'float'>
print(type(ativo))   # <class 'bool'>
```

### Atribuição Múltipla
```python
# Atribuir mesmo valor a múltiplas variáveis
x = y = z = 0
print(x, y, z)  # 0 0 0

# Desempacotamento de sequências
coordenadas = (10, 20)
x, y = coordenadas
print(f"X: {x}, Y: {y}")  # X: 10, Y: 20

# Múltiplas atribuições
nome, idade, cidade = "Ana", 30, "São Paulo"
print(f"{nome}, {idade} anos, mora em {cidade}")

# Trocar valores de variáveis
a, b = 5, 10
a, b = b, a  # Swap elegante em Python
print(f"a: {a}, b: {b}")  # a: 10, b: 5
```

### Atribuição com Desempacotamento Avançado
```python
# Operador * para coletar múltiplos valores
numeros = [1, 2, 3, 4, 5]
primeiro, *meio, ultimo = numeros
print(f"Primeiro: {primeiro}")  # Primeiro: 1
print(f"Meio: {meio}")          # Meio: [2, 3, 4]
print(f"Último: {ultimo}")      # Último: 5

# Ignorar valores com _
dados = ("Maria", 25, "Engenheira", "São Paulo")
nome, idade, _, cidade = dados
print(f"{nome}, {idade}, {cidade}")  # Maria, 25, São Paulo
```

## Regras de Nomenclatura

### Convenções Python (PEP 8)
```python
# ✅ Correto: snake_case para variáveis
nome_completo = "João Silva"
idade_usuario = 30
valor_total = 150.50

# ✅ Correto: nomes descritivos
contador_tentativas = 0
lista_numeros_pares = [2, 4, 6, 8]

# ❌ Evitar: nomes pouco descritivos
x = "João Silva"
n = 30
v = 150.50

# ❌ Evitar: camelCase (usado para classes)
nomeCompleto = "João Silva"  # Não é a convenção Python
```

### Regras Obrigatórias
```python
# Deve começar com letra ou underscore
nome = "válido"
_privado = "válido"
# 2nome = "inválido"  # SyntaxError

# Pode conter letras, números e underscores
nome_2 = "válido"
usuario_1 = "válido"
# nome-2 = "inválido"  # SyntaxError

# Case-sensitive
Nome = "João"
nome = "Maria"
NOME = "Pedro"
print(Nome, nome, NOME)  # Três variáveis diferentes

# Não usar palavras reservadas
# if = 5      # SyntaxError
# class = 10  # SyntaxError
```

## Constantes em Python

### Convenção para Constantes
```python
# Python não tem constantes reais, mas usa convenção de nomes
# Constantes devem ser MAIÚSCULAS com underscores
PI = 3.14159
VELOCIDADE_LUZ = 299792458  # m/s
TAXA_CONVERSAO_USD = 5.20
MENSAGEM_ERRO = "Erro no processamento"

# Constantes geralmente ficam no topo do arquivo
MAX_TENTATIVAS = 3
TIMEOUT_SEGUNDOS = 30

def calcular_area_circulo(raio):
    return PI * raio ** 2

area = calcular_area_circulo(5)
print(f"Área: {area}")
```

### Simulando Constantes Imutáveis
```python
# Usando namedtuple para constantes mais rígidas
from collections import namedtuple

Configuracao = namedtuple('Configuracao', ['HOST', 'PORTA', 'DEBUG'])
CONFIG = Configuracao(HOST='localhost', PORTA=8080, DEBUG=True)

print(CONFIG.HOST)    # localhost
# CONFIG.HOST = 'novo'  # AttributeError - não pode modificar

# Usando dataclass com frozen=True (Python 3.7+)
from dataclasses import dataclass

@dataclass(frozen=True)
class Constantes:
    PI: float = 3.14159
    E: float = 2.71828
    GOLDEN_RATIO: float = 1.61803

MATH = Constantes()
print(MATH.PI)        # 3.14159
# MATH.PI = 3.14      # FrozenInstanceError
```

## Escopo de Variáveis

### Escopo Local e Global
```python
# Variável global
contador_global = 0

def incrementar():
    # Variável local
    contador_local = 1
    
    # Para modificar variável global, use 'global'
    global contador_global
    contador_global += 1
    
    print(f"Local: {contador_local}")
    print(f"Global: {contador_global}")

incrementar()
print(f"Global fora da função: {contador_global}")
# print(contador_local)  # NameError - não existe aqui
```

### Escopo de Função Aninhada
```python
def externa():
    x = 10  # Variável no escopo externo
    
    def interna():
        # Para modificar variável do escopo externo, use 'nonlocal'
        nonlocal x
        x += 5
        y = 20  # Variável local da função interna
        print(f"Interna - x: {x}, y: {y}")
    
    interna()
    print(f"Externa - x: {x}")
    # print(y)  # NameError - y não existe aqui

externa()
```

### Escopo de Compreensão de Lista
```python
# Variáveis em list comprehensions têm escopo próprio
x = 10
numeros = [x for x in range(5)]  # x aqui é diferente do x externo
print(f"x externo: {x}")        # x externo: 10
print(f"números: {numeros}")    # números: [0, 1, 2, 3, 4]

# Mesmo para outras compreensões
quadrados = {x: x**2 for x in range(3)}
print(f"x ainda é: {x}")        # x ainda é: 10
```

## Tipos de Variáveis por Contexto

### Variáveis de Instância vs Classe
```python
class Pessoa:
    # Variável de classe (compartilhada por todas as instâncias)
    especie = "Homo sapiens"
    contador_pessoas = 0
    
    def __init__(self, nome, idade):
        # Variáveis de instância (únicas para cada objeto)
        self.nome = nome
        self.idade = idade
        
        # Modificar variável de classe
        Pessoa.contador_pessoas += 1
    
    def apresentar(self):
        return f"{self.nome}, {self.idade} anos, espécie: {self.especie}"

# Uso
pessoa1 = Pessoa("João", 25)
pessoa2 = Pessoa("Maria", 30)

print(pessoa1.apresentar())
print(f"Total de pessoas: {Pessoa.contador_pessoas}")
```

### Variáveis Privadas (Convenção)
```python
class ContaBancaria:
    def __init__(self, titular):
        self.titular = titular          # Público
        self._saldo = 0                 # Protegido (convenção)
        self.__numero_conta = 123456    # Privado (name mangling)
    
    def depositar(self, valor):
        if valor > 0:
            self._saldo += valor
    
    def get_saldo(self):
        return self._saldo

conta = ContaBancaria("João")
print(conta.titular)      # Acessível
print(conta._saldo)       # Acessível mas não recomendado
# print(conta.__numero_conta)  # AttributeError
print(conta._ContaBancaria__numero_conta)  # Acessível via name mangling
```

## Gerenciamento de Memória

### Referências e Identity
```python
# Números pequenos são cached
a = 256
b = 256
print(a is b)        # True (mesmo objeto na memória)

a = 257
b = 257
print(a is b)        # False (objetos diferentes)

# Listas sempre criam novos objetos
lista1 = [1, 2, 3]
lista2 = [1, 2, 3]
print(lista1 == lista2)  # True (mesmo conteúdo)
print(lista1 is lista2)  # False (objetos diferentes)

# Referência vs cópia
original = [1, 2, 3]
referencia = original     # Mesma referência
copia = original.copy()   # Nova lista

original.append(4)
print(f"Original: {original}")      # [1, 2, 3, 4]
print(f"Referência: {referencia}")  # [1, 2, 3, 4] (modificada)
print(f"Cópia: {copia}")           # [1, 2, 3] (inalterada)
```

## Dicas e Melhores Práticas

### Convenções Importantes
```python
# ✅ Use nomes descritivos
idade_usuario = 25
lista_produtos = ["notebook", "mouse", "teclado"]

# ✅ Constantes em MAIÚSCULAS
MAX_TENTATIVAS = 3
URL_BASE = "https://api.exemplo.com"

# ✅ Variáveis booleanas com prefixos claros
is_ativo = True
has_permissao = False
can_edit = True

# ✅ Evite abreviações confusas
# user_addr = "..."  # Ruim
endereco_usuario = "..."  # Melhor

# ✅ Use plurais para coleções
numeros = [1, 2, 3, 4, 5]
nomes_usuarios = ["João", "Maria", "Pedro"]
```

### Inicialização Segura
```python
# ✅ Inicialize variáveis antes de usar
contador = 0
total = 0.0
resultados = []

# ✅ Use valores padrão em funções
def processar_dados(dados, limite=100, debug=False):
    if not dados:
        return []
    
    # Processar dados...
    return dados[:limite]

# ✅ Verifique tipos quando necessário
def calcular_area(largura, altura):
    if not isinstance(largura, (int, float)) or not isinstance(altura, (int, float)):
        raise TypeError("Largura e altura devem ser números")
    
    return largura * altura
```

Python facilita muito o trabalho com variáveis graças à sua tipagem dinâmica, mas é importante seguir as convenções para manter o código legível e manutenível!
