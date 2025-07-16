# Listas em Python

## Criação e Inicialização

### Formas de Criar Listas
```python
# Lista vazia
lista_vazia = []
lista_vazia2 = list()

# Lista com valores iniciais
numeros = [1, 2, 3, 4, 5]
frutas = ["maçã", "banana", "laranja"]
mista = [1, "texto", 3.14, True, [1, 2, 3]]  # Tipos diferentes

# Lista com repetição
zeros = [0] * 5  # [0, 0, 0, 0, 0]
padrão = ["Python"] * 3  # ["Python", "Python", "Python"]

# Lista a partir de range
numeros_range = list(range(1, 11))  # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pares = list(range(0, 11, 2))       # [0, 2, 4, 6, 8, 10]

# Lista a partir de string
letras = list("Python")  # ['P', 'y', 't', 'h', 'o', 'n']
```

## Acessando Elementos

### Índices Positivos e Negativos
```python
frutas = ["maçã", "banana", "laranja", "uva", "manga"]

# Índices positivos (da esquerda para direita)
print(frutas[0])   # "maçã" (primeiro elemento)
print(frutas[2])   # "laranja"
print(frutas[4])   # "manga" (último elemento)

# Índices negativos (da direita para esquerda)
print(frutas[-1])  # "manga" (último elemento)
print(frutas[-2])  # "uva" (penúltimo elemento)
print(frutas[-5])  # "maçã" (primeiro elemento)

# Verificar tamanho
print(len(frutas))  # 5

# Acessar último elemento de forma segura
if frutas:  # Verifica se lista não está vazia
    ultimo = frutas[-1]
    print(f"Último elemento: {ultimo}")
```

### Fatiamento (Slicing)
```python
numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Sintaxe: lista[inicio:fim:passo]
print(numeros[2:5])    # [2, 3, 4] (índice 2 até 4)
print(numeros[:5])     # [0, 1, 2, 3, 4] (do início até índice 4)
print(numeros[5:])     # [5, 6, 7, 8, 9] (do índice 5 até o fim)
print(numeros[:])      # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] (cópia completa)

# Com passo
print(numeros[::2])    # [0, 2, 4, 6, 8] (todos os pares)
print(numeros[1::2])   # [1, 3, 5, 7, 9] (todos os ímpares)
print(numeros[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] (reverso)

# Fatiamento com índices negativos
print(numeros[-3:])    # [7, 8, 9] (últimos 3 elementos)
print(numeros[:-2])    # [0, 1, 2, 3, 4, 5, 6, 7] (todos exceto os 2 últimos)
```

## Modificando Listas

### Adicionando Elementos
```python
frutas = ["maçã", "banana"]

# append() - adiciona ao final
frutas.append("laranja")
print(frutas)  # ["maçã", "banana", "laranja"]

# insert() - adiciona em posição específica
frutas.insert(1, "pêra")  # Insere na posição 1
print(frutas)  # ["maçã", "pêra", "banana", "laranja"]

# extend() - adiciona múltiplos elementos
frutas.extend(["uva", "manga"])
print(frutas)  # ["maçã", "pêra", "banana", "laranja", "uva", "manga"]

# Operador + (cria nova lista)
mais_frutas = frutas + ["kiwi", "abacaxi"]
print(mais_frutas)

# Operador += (modifica lista existente)
frutas += ["melão"]
print(frutas)
```

### Removendo Elementos
```python
numeros = [1, 2, 3, 2, 4, 5, 2]

# remove() - remove primeira ocorrência do valor
numeros.remove(2)  # Remove o primeiro 2
print(numeros)  # [1, 3, 2, 4, 5, 2]

# pop() - remove e retorna elemento por índice
ultimo = numeros.pop()      # Remove último elemento
print(f"Removido: {ultimo}")  # 2
print(numeros)              # [1, 3, 2, 4, 5]

primeiro = numeros.pop(0)   # Remove primeiro elemento
print(f"Removido: {primeiro}")  # 1
print(numeros)              # [3, 2, 4, 5]

# del - remove por índice ou fatia
del numeros[1]     # Remove elemento no índice 1
print(numeros)     # [3, 4, 5]

del numeros[1:3]   # Remove elementos do índice 1 ao 2
print(numeros)     # [3]

# clear() - remove todos os elementos
numeros.clear()
print(numeros)     # []
```

### Modificando Elementos Existentes
```python
cores = ["vermelho", "verde", "azul"]

# Modificar por índice
cores[1] = "amarelo"
print(cores)  # ["vermelho", "amarelo", "azul"]

# Modificar fatia
numeros = [1, 2, 3, 4, 5]
numeros[1:4] = [20, 30, 40]
print(numeros)  # [1, 20, 30, 40, 5]

# Substituir por lista de tamanho diferente
numeros[1:4] = [100]
print(numeros)  # [1, 100, 5]
```

## Métodos Úteis

### Busca e Contagem
```python
numeros = [1, 3, 5, 3, 7, 3, 9]

# count() - conta ocorrências
print(numeros.count(3))  # 3

# index() - encontra primeira ocorrência
print(numeros.index(5))  # 2
# print(numeros.index(10))  # ValueError se não encontrar

# Busca segura
def buscar_seguro(lista, valor):
    try:
        return lista.index(valor)
    except ValueError:
        return -1  # Ou None

print(buscar_seguro(numeros, 5))   # 2
print(buscar_seguro(numeros, 10))  # -1

# Verificar se elemento existe
if 5 in numeros:
    print("5 está na lista")

if 10 not in numeros:
    print("10 não está na lista")
```

### Ordenação
```python
numeros = [3, 1, 4, 1, 5, 9, 2, 6]

# sort() - ordena in-place (modifica a lista original)
numeros.sort()
print(numeros)  # [1, 1, 2, 3, 4, 5, 6, 9]

# sort() com reverse
numeros.sort(reverse=True)
print(numeros)  # [9, 6, 5, 4, 3, 2, 1, 1]

# sorted() - retorna nova lista ordenada
original = [3, 1, 4, 1, 5]
ordenada = sorted(original)
print(f"Original: {original}")    # [3, 1, 4, 1, 5]
print(f"Ordenada: {ordenada}")    # [1, 1, 3, 4, 5]

# Ordenação personalizada
palavras = ["banana", "maçã", "abacaxi", "uva"]
palavras.sort(key=len)  # Ordena por comprimento
print(palavras)  # ['uva', 'maçã', 'banana', 'abacaxi']

# Ordenação complexa
pessoas = [("João", 30), ("Maria", 25), ("Pedro", 35)]
pessoas.sort(key=lambda x: x[1])  # Ordena por idade
print(pessoas)  # [('Maria', 25), ('João', 30), ('Pedro', 35)]
```

### Outras Operações
```python
numeros = [1, 2, 3, 4, 5]

# reverse() - inverte in-place
numeros.reverse()
print(numeros)  # [5, 4, 3, 2, 1]

# copy() - cria cópia rasa
copia = numeros.copy()
# Ou: copia = numeros[:]
# Ou: copia = list(numeros)

# Verificar se lista está vazia
if not numeros:
    print("Lista vazia")
else:
    print(f"Lista tem {len(numeros)} elementos")
```

## Listas Aninhadas (Listas de Listas)

### Criação e Acesso
```python
# Matriz 3x3
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Acessar elementos
print(matriz[0])     # [1, 2, 3] (primeira linha)
print(matriz[1][2])  # 6 (linha 1, coluna 2)

# Modificar elemento
matriz[2][1] = 80
print(matriz[2])     # [7, 80, 9]

# Percorrer matriz
for i, linha in enumerate(matriz):
    for j, elemento in enumerate(linha):
        print(f"matriz[{i}][{j}] = {elemento}")
```

### Cuidados com Listas Aninhadas
```python
# ❌ PERIGO: Criar matriz com referências compartilhadas
matriz_errada = [[0] * 3] * 3  # Todas as linhas são a MESMA lista!
matriz_errada[0][0] = 1
print(matriz_errada)  # [[1, 0, 0], [1, 0, 0], [1, 0, 0]] - ERRO!

# ✅ CORRETO: Criar listas independentes
matriz_correta = [[0] * 3 for _ in range(3)]
matriz_correta[0][0] = 1
print(matriz_correta)  # [[1, 0, 0], [0, 0, 0], [0, 0, 0]] - CORRETO!

# ✅ List comprehension para criar matriz
matriz = [[i + j for j in range(3)] for i in range(3)]
print(matriz)  # [[0, 1, 2], [1, 2, 3], [2, 3, 4]]
```

## List Comprehensions

### Sintaxe Básica
```python
# Forma tradicional
quadrados = []
for x in range(10):
    quadrados.append(x**2)

# List comprehension
quadrados = [x**2 for x in range(10)]
print(quadrados)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Com condição
pares = [x for x in range(20) if x % 2 == 0]
print(pares)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transformação com condição
numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
pares_quadrados = [x**2 for x in numeros if x % 2 == 0]
print(pares_quadrados)  # [4, 16, 36, 64, 100]
```

### Comprehensions Avançadas
```python
# Processamento de strings
palavras = ["python", "java", "javascript", "go", "rust"]
maiusculas_longas = [palavra.upper() for palavra in palavras if len(palavra) > 4]
print(maiusculas_longas)  # ['PYTHON', 'JAVASCRIPT']

# Achatar lista de listas
matriz = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
achatada = [elemento for linha in matriz for elemento in linha]
print(achatada)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Combinações
cores = ["vermelho", "verde", "azul"]
objetos = ["carro", "casa", "bola"]
combinacoes = [f"{cor} {objeto}" for cor in cores for objeto in objetos]
print(combinacoes[:3])  # ['vermelho carro', 'vermelho casa', 'vermelho bola']
```

## Operações Avançadas

### Funções Built-in com Listas
```python
numeros = [3, 1, 4, 1, 5, 9, 2, 6]

# Estatísticas básicas
print(f"Soma: {sum(numeros)}")      # 31
print(f"Máximo: {max(numeros)}")    # 9
print(f"Mínimo: {min(numeros)}")    # 1
print(f"Tamanho: {len(numeros)}")   # 8

# all() e any()
booleanos = [True, True, False, True]
print(f"Todos True: {all(booleanos)}")    # False
print(f"Algum True: {any(booleanos)}")    # True

# enumerate() - índice e valor
for i, valor in enumerate(numeros):
    print(f"numeros[{i}] = {valor}")

# zip() - combinar listas
nomes = ["Ana", "Bruno", "Carlos"]
idades = [25, 30, 35]
for nome, idade in zip(nomes, idades):
    print(f"{nome}: {idade} anos")
```

### Filter, Map e Reduce
```python
from functools import reduce

numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# filter() - filtrar elementos
pares = list(filter(lambda x: x % 2 == 0, numeros))
print(pares)  # [2, 4, 6, 8, 10]

# map() - transformar elementos
quadrados = list(map(lambda x: x**2, numeros))
print(quadrados[:5])  # [1, 4, 9, 16, 25]

# reduce() - reduzir a um valor
produto = reduce(lambda x, y: x * y, [1, 2, 3, 4, 5])
print(produto)  # 120 (fatorial de 5)

# Equivalente com list comprehension (mais pythônico)
pares_comp = [x for x in numeros if x % 2 == 0]
quadrados_comp = [x**2 for x in numeros]
```

## Dicas e Melhores Práticas

### Performance e Memória
```python
# ✅ Use list comprehension quando possível
# Mais rápido e mais legível
quadrados = [x**2 for x in range(1000)]

# ✅ Para listas muito grandes, considere generators
def quadrados_generator(n):
    for x in range(n):
        yield x**2

# ✅ Use métodos apropriados para cada situação
# append() para adicionar um elemento
# extend() para adicionar múltiplos elementos
# += é equivalente ao extend() para listas

# ❌ Evite crescimento ineficiente de listas
# Ruim para muitos elementos
lista = []
for i in range(1000000):
    lista.append(i)

# Melhor
lista = list(range(1000000))
```

### Boas Práticas
```python
# ✅ Use nomes descritivos
idades_usuarios = [25, 30, 35, 40]  # Melhor que nums = [25, 30, 35, 40]

# ✅ Verifique se lista não está vazia antes de acessar
if lista:
    primeiro_elemento = lista[0]

# ✅ Use métodos apropriados para verificação
if valor in lista:  # O(n) mas direto
    print("Encontrado")

# ✅ Para listas muito grandes, considere set para verificações
conjunto = set(lista)
if valor in conjunto:  # O(1) em média
    print("Encontrado")

# ✅ Use enumerate() quando precisar do índice
for i, item in enumerate(lista):
    print(f"{i}: {item}")

# ❌ Evite
for i in range(len(lista)):
    print(f"{i}: {lista[i]}")
```

Listas são uma das estruturas de dados mais versáteis e utilizadas em Python. Dominar seus métodos e operações é fundamental para programar eficientemente em Python!
