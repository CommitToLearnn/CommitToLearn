# Funções em Python

## Definição Básica

### Sintaxe de uma Função
```python
def nome_da_funcao(parametros):
    """Docstring opcional descrevendo a função"""
    # corpo da função
    return valor  # opcional
```

### Exemplo Simples
```python
def saudar():
    """Função que imprime uma saudação"""
    print("Olá, mundo!")

def somar(a, b):
    """Retorna a soma de dois números"""
    return a + b

# Chamando as funções
saudar()  # Olá, mundo!
resultado = somar(5, 3)
print(resultado)  # 8
```

## Parâmetros e Argumentos

### Parâmetros Posicionais
```python
def apresentar_pessoa(nome, idade, cidade):
    """Apresenta uma pessoa com nome, idade e cidade"""
    return f"{nome}, {idade} anos, mora em {cidade}"

# Argumentos passados por posição
mensagem = apresentar_pessoa("Ana", 25, "São Paulo")
print(mensagem)  # Ana, 25 anos, mora em São Paulo
```

### Parâmetros Nomeados (Keyword Arguments)
```python
def criar_perfil(nome, idade, profissao="Não informado", ativo=True):
    """Cria perfil de usuário"""
    status = "ativo" if ativo else "inativo"
    return f"{nome} ({idade} anos) - {profissao} - {status}"

# Diferentes formas de chamar
print(criar_perfil("João", 30))  # João (30 anos) - Não informado - ativo
print(criar_perfil("Maria", 28, "Engenheira"))  # Maria (28 anos) - Engenheira - ativo
print(criar_perfil("Pedro", 35, ativo=False, profissao="Designer"))  # Pedro (35 anos) - Designer - inativo
print(criar_perfil(idade=40, nome="Carlos", profissao="Médico"))  # Carlos (40 anos) - Médico - ativo
```

### Parâmetros Padrão
```python
def calcular_desconto(preco, desconto=0.1, imposto=0.05):
    """Calcula preço final com desconto e imposto"""
    preco_com_desconto = preco * (1 - desconto)
    preco_final = preco_com_desconto * (1 + imposto)
    return round(preco_final, 2)

print(calcular_desconto(100))           # 94.5 (desconto e imposto padrão)
print(calcular_desconto(100, 0.2))      # 84.0 (desconto 20%)
print(calcular_desconto(100, 0.15, 0))  # 85.0 (desconto 15%, sem imposto)

# ⚠️ CUIDADO: Não use mutáveis como valores padrão
def adicionar_item_ruim(item, lista=[]):  # PERIGOSO!
    lista.append(item)
    return lista

# ✅ CORRETO: Use None e crie nova lista
def adicionar_item_bom(item, lista=None):
    if lista is None:
        lista = []
    lista.append(item)
    return lista
```

## Argumentos Variáveis

### *args - Argumentos Posicionais Variáveis
```python
def somar_todos(*numeros):
    """Soma todos os números passados como argumentos"""
    return sum(numeros)

print(somar_todos(1, 2, 3))           # 6
print(somar_todos(10, 20, 30, 40))    # 100
print(somar_todos())                  # 0

def imprimir_info(nome, *detalhes):
    """Imprime nome e detalhes adicionais"""
    print(f"Nome: {nome}")
    for i, detalhe in enumerate(detalhes, 1):
        print(f"Detalhe {i}: {detalhe}")

imprimir_info("João", "Engenheiro", "30 anos", "São Paulo")
# Nome: João
# Detalhe 1: Engenheiro
# Detalhe 2: 30 anos
# Detalhe 3: São Paulo
```

### **kwargs - Argumentos Nomeados Variáveis
```python
def criar_usuario(**informacoes):
    """Cria usuário com informações variáveis"""
    usuario = {}
    for chave, valor in informacoes.items():
        usuario[chave] = valor
    return usuario

user1 = criar_usuario(nome="Ana", idade=25, email="ana@email.com")
user2 = criar_usuario(nome="Bruno", profissao="Designer", cidade="Rio de Janeiro")

print(user1)  # {'nome': 'Ana', 'idade': 25, 'email': 'ana@email.com'}
print(user2)  # {'nome': 'Bruno', 'profissao': 'Designer', 'cidade': 'Rio de Janeiro'}

def funcao_completa(obrigatorio, padrao="valor", *args, **kwargs):
    """Exemplo combinando todos os tipos de parâmetros"""
    print(f"Obrigatório: {obrigatorio}")
    print(f"Padrão: {padrao}")
    print(f"Args: {args}")
    print(f"Kwargs: {kwargs}")

funcao_completa("teste", "novo", 1, 2, 3, nome="João", idade=30)
# Obrigatório: teste
# Padrão: novo
# Args: (1, 2, 3)
# Kwargs: {'nome': 'João', 'idade': 30}
```

## Tipos de Retorno

### Retorno Simples
```python
def quadrado(numero):
    """Retorna o quadrado de um número"""
    return numero ** 2

def eh_par(numero):
    """Verifica se número é par"""
    return numero % 2 == 0

print(quadrado(5))    # 25
print(eh_par(10))     # True
```

### Múltiplos Retornos
```python
def dividir_com_resto(dividendo, divisor):
    """Retorna quociente e resto da divisão"""
    quociente = dividendo // divisor
    resto = dividendo % divisor
    return quociente, resto  # Retorna tupla

# Desempacotamento do retorno
q, r = dividir_com_resto(17, 5)
print(f"17 ÷ 5 = {q} resto {r}")  # 17 ÷ 5 = 3 resto 2

# Ou usar como tupla
resultado = dividir_com_resto(17, 5)
print(resultado)  # (3, 2)

def analisar_numeros(lista):
    """Retorna estatísticas de uma lista de números"""
    if not lista:
        return None  # Retorno antecipado para lista vazia
    
    return {
        'soma': sum(lista),
        'media': sum(lista) / len(lista),
        'maximo': max(lista),
        'minimo': min(lista)
    }

stats = analisar_numeros([1, 2, 3, 4, 5])
print(stats)  # {'soma': 15, 'media': 3.0, 'maximo': 5, 'minimo': 1}
```

## Escopo de Variáveis

### Variáveis Locais e Globais
```python
contador_global = 0  # Variável global

def incrementar():
    """Incrementa contador local"""
    contador_local = 1  # Variável local
    print(f"Contador local: {contador_local}")

def incrementar_global():
    """Incrementa contador global"""
    global contador_global
    contador_global += 1
    print(f"Contador global: {contador_global}")

incrementar()           # Contador local: 1
incrementar_global()    # Contador global: 1
print(contador_global)  # 1

# contador_local não existe aqui
# print(contador_local)  # NameError
```

### Escopo LEGB (Local, Enclosing, Global, Built-in)
```python
nome = "Global"  # Escopo global

def externa():
    nome = "Enclosing"  # Escopo enclosing
    
    def interna():
        nome = "Local"  # Escopo local
        print(f"Interna: {nome}")
    
    def interna_nonlocal():
        nonlocal nome  # Modifica variável do escopo enclosing
        nome = "Modificado"
        print(f"Interna nonlocal: {nome}")
    
    print(f"Externa antes: {nome}")
    interna()
    print(f"Externa depois interna: {nome}")
    interna_nonlocal()
    print(f"Externa depois nonlocal: {nome}")

externa()
print(f"Global: {nome}")

# Output:
# Externa antes: Enclosing
# Interna: Local
# Externa depois interna: Enclosing
# Interna nonlocal: Modificado
# Externa depois nonlocal: Modificado
# Global: Global
```

## Funções como Objetos de Primeira Classe

### Atribuindo Funções a Variáveis
```python
def saudar(nome):
    return f"Olá, {nome}!"

# Função é um objeto
minha_funcao = saudar
print(minha_funcao("Maria"))  # Olá, Maria!

# Funções em listas
def somar(a, b): return a + b
def multiplicar(a, b): return a * b
def dividir(a, b): return a / b if b != 0 else "Erro: divisão por zero"

operacoes = [somar, multiplicar, dividir]

for operacao in operacoes:
    resultado = operacao(10, 5)
    print(f"{operacao.__name__}(10, 5) = {resultado}")
```

### Funções como Argumentos
```python
def aplicar_operacao(lista, operacao):
    """Aplica uma operação a todos elementos da lista"""
    return [operacao(x) for x in lista]

def quadrado(x):
    return x ** 2

def cubo(x):
    return x ** 3

numeros = [1, 2, 3, 4, 5]
print(aplicar_operacao(numeros, quadrado))  # [1, 4, 9, 16, 25]
print(aplicar_operacao(numeros, cubo))      # [1, 8, 27, 64, 125]

# Com função lambda
print(aplicar_operacao(numeros, lambda x: x * 2))  # [2, 4, 6, 8, 10]
```

## Funções Lambda

### Sintaxe e Uso
```python
# Sintaxe: lambda argumentos: expressão

# Função tradicional
def quadrado(x):
    return x ** 2

# Equivalente com lambda
quadrado_lambda = lambda x: x ** 2

print(quadrado(5))        # 25
print(quadrado_lambda(5)) # 25

# Múltiplos argumentos
somar = lambda a, b: a + b
print(somar(3, 4))  # 7

# Com argumentos padrão
cumprimentar = lambda nome, saudacao="Olá": f"{saudacao}, {nome}!"
print(cumprimentar("Ana"))              # Olá, Ana!
print(cumprimentar("Bruno", "Oi"))      # Oi, Bruno!
```

### Uso Prático de Lambda
```python
# Com sorted()
pessoas = [("João", 30), ("Maria", 25), ("Pedro", 35)]
por_idade = sorted(pessoas, key=lambda pessoa: pessoa[1])
print(por_idade)  # [('Maria', 25), ('João', 30), ('Pedro', 35)]

# Com filter()
numeros = range(1, 11)
pares = list(filter(lambda x: x % 2 == 0, numeros))
print(pares)  # [2, 4, 6, 8, 10]

# Com map()
quadrados = list(map(lambda x: x ** 2, numeros))
print(quadrados)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# Em dicionários
operacoes = {
    'somar': lambda a, b: a + b,
    'subtrair': lambda a, b: a - b,
    'multiplicar': lambda a, b: a * b,
    'dividir': lambda a, b: a / b if b != 0 else "Erro"
}

print(operacoes['somar'](10, 5))       # 15
print(operacoes['multiplicar'](4, 3))  # 12
```

## Decoradores Básicos

### Conceito de Decorador
```python
def meu_decorador(func):
    """Decorador que adiciona funcionalidade a uma função"""
    def wrapper(*args, **kwargs):
        print(f"Executando {func.__name__}")
        resultado = func(*args, **kwargs)
        print(f"Terminei de executar {func.__name__}")
        return resultado
    return wrapper

# Usando o decorador
@meu_decorador
def saudar(nome):
    return f"Olá, {nome}!"

print(saudar("Maria"))
# Output:
# Executando saudar
# Terminei de executar saudar
# Olá, Maria!

# Decorador de tempo
import time
from functools import wraps

def cronometrar(func):
    @wraps(func)  # Preserva metadados da função original
    def wrapper(*args, **kwargs):
        inicio = time.time()
        resultado = func(*args, **kwargs)
        fim = time.time()
        print(f"{func.__name__} executou em {fim - inicio:.4f} segundos")
        return resultado
    return wrapper

@cronometrar
def operacao_lenta():
    time.sleep(1)
    return "Concluído"

operacao_lenta()  # operacao_lenta executou em 1.0012 segundos
```

## Funções Recursivas

### Conceito e Exemplos
```python
def fatorial(n):
    """Calcula fatorial recursivamente"""
    # Caso base
    if n <= 1:
        return 1
    # Chamada recursiva
    return n * fatorial(n - 1)

print(fatorial(5))  # 120

def fibonacci(n):
    """Calcula Fibonacci recursivamente"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print([fibonacci(i) for i in range(10)])  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Versão otimizada com memoização
def fibonacci_memo(n, memo={}):
    """Fibonacci com memoização para evitar recalcular"""
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

print(fibonacci_memo(50))  # Muito mais rápido que a versão simples
```

## Dicas e Melhores Práticas

### Docstrings e Anotações de Tipo
```python
def calcular_imc(peso: float, altura: float) -> float:
    """
    Calcula o Índice de Massa Corporal (IMC).
    
    Args:
        peso (float): Peso em quilogramas
        altura (float): Altura em metros
    
    Returns:
        float: IMC calculado
    
    Raises:
        ValueError: Se altura for zero ou negativa
    """
    if altura <= 0:
        raise ValueError("Altura deve ser positiva")
    
    return peso / (altura ** 2)

# Função com documentação clara
def processar_dados(dados: list, 
                   filtro: callable = None, 
                   transformacao: callable = None) -> list:
    """
    Processa lista de dados aplicando filtro e transformação.
    
    Args:
        dados: Lista de dados para processar
        filtro: Função para filtrar dados (opcional)
        transformacao: Função para transformar dados (opcional)
    
    Returns:
        Lista processada
    """
    resultado = dados
    
    if filtro:
        resultado = [item for item in resultado if filtro(item)]
    
    if transformacao:
        resultado = [transformacao(item) for item in resultado]
    
    return resultado
```

### Boas Práticas Gerais
```python
# ✅ Funções pequenas e focadas
def eh_email_valido(email):
    """Verifica se email tem formato básico válido"""
    return "@" in email and "." in email

# ✅ Nomes descritivos
def calcular_preco_com_desconto(preco, percentual_desconto):
    return preco * (1 - percentual_desconto / 100)

# ✅ Use type hints quando possível
def somar_lista(numeros: list[int]) -> int:
    return sum(numeros)

# ✅ Trate casos especiais
def dividir_seguro(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Divisão por zero não é permitida")
    return a / b

# ✅ Use guard clauses para reduzir aninhamento
def processar_usuario(usuario):
    if not usuario:
        return "Usuário inválido"
    
    if 'email' not in usuario:
        return "Email obrigatório"
    
    if not eh_email_valido(usuario['email']):
        return "Email inválido"
    
    return "Usuário válido"
```

Funções são fundamentais em Python e dominar seus recursos permite escrever código mais modular, reutilizável e maintível!
