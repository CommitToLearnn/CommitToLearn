# Estruturas de Repetição em Python

## Loop for

### for com range()
```python
# range(stop) - de 0 até stop-1
for i in range(5):
    print(f"Iteração: {i}")  # 0, 1, 2, 3, 4

# range(start, stop) - de start até stop-1
for i in range(2, 8):
    print(f"Número: {i}")  # 2, 3, 4, 5, 6, 7

# range(start, stop, step) - com incremento personalizado
for i in range(0, 11, 2):
    print(f"Par: {i}")  # 0, 2, 4, 6, 8, 10

# Contagem regressiva
for i in range(10, 0, -1):
    print(f"Contagem: {i}")  # 10, 9, 8, ..., 1
```

### for com Sequências
```python
# Iterando sobre listas
frutas = ["maçã", "banana", "laranja", "uva"]
for fruta in frutas:
    print(f"Fruta: {fruta}")

# Iterando sobre strings
palavra = "Python"
for letra in palavra:
    print(f"Letra: {letra}")

# Iterando sobre tuplas
coordenadas = [(0, 0), (1, 2), (3, 4)]
for x, y in coordenadas:  # Desempacotamento automático
    print(f"Ponto: ({x}, {y})")

# Iterando sobre dicionários
pessoa = {"nome": "João", "idade": 30, "cidade": "São Paulo"}

# Apenas chaves
for chave in pessoa:
    print(f"Chave: {chave}")

# Chaves e valores
for chave, valor in pessoa.items():
    print(f"{chave}: {valor}")

# Apenas valores
for valor in pessoa.values():
    print(f"Valor: {valor}")
```

### enumerate() - Índice + Valor
```python
nomes = ["Ana", "Bruno", "Carlos", "Diana"]

# Com enumerate para obter índice
for i, nome in enumerate(nomes):
    print(f"{i}: {nome}")

# Começar enumeração de um número específico
for i, nome in enumerate(nomes, start=1):
    print(f"{i}º: {nome}")

# Prático para modificar lista durante iteração
numeros = [1, 2, 3, 4, 5]
for i, numero in enumerate(numeros):
    numeros[i] = numero * 2
print(numeros)  # [2, 4, 6, 8, 10]
```

### zip() - Múltiplas Sequências
```python
nomes = ["Ana", "Bruno", "Carlos"]
idades = [25, 30, 35]
cidades = ["SP", "RJ", "BH"]

# Combinar múltiplas listas
for nome, idade, cidade in zip(nomes, idades, cidades):
    print(f"{nome}, {idade} anos, de {cidade}")

# zip para de iterar quando a menor sequência acaba
numeros1 = [1, 2, 3, 4, 5]
numeros2 = [10, 20, 30]  # Menor

for n1, n2 in zip(numeros1, numeros2):
    print(f"{n1} + {n2} = {n1 + n2}")  # Apenas 3 iterações

# zip_longest para iterar até o final da maior sequência
from itertools import zip_longest

for n1, n2 in zip_longest(numeros1, numeros2, fillvalue=0):
    print(f"{n1} + {n2} = {n1 + n2}")  # 5 iterações, preenchendo com 0
```

## Loop while

### while Básico
```python
# Contador simples
contador = 0
while contador < 5:
    print(f"Contador: {contador}")
    contador += 1  # IMPORTANTE: sempre incrementar para evitar loop infinito

# Condição mais complexa
numero = 1
while numero <= 100:
    if numero % 2 == 0:
        print(f"{numero} é par")
    numero += 1
```

### while com Entrada do Usuário
```python
# Menu interativo
while True:
    print("\n=== MENU ===")
    print("1. Opção A")
    print("2. Opção B") 
    print("0. Sair")
    
    opcao = input("Escolha uma opção: ")
    
    if opcao == "1":
        print("Você escolheu A")
    elif opcao == "2":
        print("Você escolheu B")
    elif opcao == "0":
        print("Saindo...")
        break  # Sai do loop
    else:
        print("Opção inválida!")

# Validação de entrada
while True:
    try:
        idade = int(input("Digite sua idade: "))
        if idade < 0:
            print("Idade não pode ser negativa!")
            continue
        if idade > 150:
            print("Idade muito alta!")
            continue
        break  # Entrada válida, sai do loop
    except ValueError:
        print("Por favor, digite um número válido!")

print(f"Idade cadastrada: {idade}")
```

## Controle de Fluxo

### break - Sair do Loop
```python
# Procurar elemento em lista
numeros = [1, 5, 3, 8, 2, 9, 4]
procurado = 8

for i, numero in enumerate(numeros):
    if numero == procurado:
        print(f"Número {procurado} encontrado na posição {i}")
        break
else:
    # Cláusula else do for - executa se loop não foi interrompido por break
    print(f"Número {procurado} não encontrado")

# Saindo de loops aninhados com break
encontrado = False
for i in range(3):
    for j in range(3):
        if i == 1 and j == 1:
            print(f"Encontrado em ({i}, {j})")
            encontrado = True
            break
    if encontrado:
        break  # Sai do loop externo também
```

### continue - Pular Iteração
```python
# Pular números pares
for i in range(10):
    if i % 2 == 0:
        continue  # Pula o resto da iteração
    print(f"Número ímpar: {i}")

# Processar apenas elementos válidos
nomes = ["João", "", "Maria", None, "Pedro", "   ", "Ana"]
for nome in nomes:
    if not nome or not nome.strip():  # Pula nomes vazios ou só espaços
        continue
    print(f"Nome válido: {nome.strip()}")

# continue em while
numero = 0
while numero < 10:
    numero += 1
    if numero % 3 == 0:
        continue  # Pula múltiplos de 3
    print(numero)
```

### else em Loops
```python
# else em for - executa se loop não foi interrompido
def eh_primo(n):
    if n < 2:
        return False
    
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False  # Não é primo
    else:
        return True  # É primo (loop não foi interrompido)

print(eh_primo(17))  # True
print(eh_primo(15))  # False

# else em while
contador = 0
while contador < 3:
    print(f"Tentativa {contador + 1}")
    contador += 1
else:
    print("Loop while completado normalmente")
```

## Comprehensions (Compreensões)

### List Comprehension
```python
# Forma tradicional
quadrados = []
for x in range(10):
    quadrados.append(x**2)

# List comprehension (mais pythônico)
quadrados = [x**2 for x in range(10)]
print(quadrados)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Com condição
pares = [x for x in range(20) if x % 2 == 0]
print(pares)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Processando strings
palavras = ["python", "java", "javascript", "go"]
maiusculas = [palavra.upper() for palavra in palavras if len(palavra) > 4]
print(maiusculas)  # ['PYTHON', 'JAVASCRIPT']

# Aninhado
matriz = [[i+j for j in range(3)] for i in range(3)]
print(matriz)  # [[0, 1, 2], [1, 2, 3], [2, 3, 4]]
```

### Dictionary Comprehension
```python
# Criar dicionário com comprehension
quadrados_dict = {x: x**2 for x in range(5)}
print(quadrados_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Filtrar dicionário existente
notas = {"Ana": 85, "Bruno": 92, "Carlos": 78, "Diana": 95}
aprovados = {nome: nota for nome, nota in notas.items() if nota >= 80}
print(aprovados)  # {'Ana': 85, 'Bruno': 92, 'Diana': 95}

# Transformar listas em dicionário
nomes = ["Ana", "Bruno", "Carlos"]
idades = [25, 30, 35]
pessoas = {nome: idade for nome, idade in zip(nomes, idades)}
print(pessoas)  # {'Ana': 25, 'Bruno': 30, 'Carlos': 35}
```

### Set e Generator Comprehension
```python
# Set comprehension
numeros = [1, 2, 2, 3, 3, 3, 4, 4, 5]
unicos_quadrados = {x**2 for x in numeros}
print(unicos_quadrados)  # {1, 4, 9, 16, 25}

# Generator comprehension (economiza memória)
quadrados_gen = (x**2 for x in range(1000000))  # Não ocupa memória até ser usado
print(type(quadrados_gen))  # <class 'generator'>

# Usando o generator
primeiros_10 = []
for i, quadrado in enumerate(quadrados_gen):
    if i >= 10:
        break
    primeiros_10.append(quadrado)
print(primeiros_10)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

## Loops Aninhados

### Exemplos Práticos
```python
# Tabela de multiplicação
print("Tabela de Multiplicação:")
for i in range(1, 6):
    for j in range(1, 6):
        resultado = i * j
        print(f"{resultado:3}", end=" ")  # Formatação com largura fixa
    print()  # Nova linha

# Matriz de caracteres
print("\nPadrão de estrelas:")
for linha in range(5):
    for coluna in range(linha + 1):
        print("*", end=" ")
    print()

# Procurar em matriz
matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

procurado = 5
for i, linha in enumerate(matriz):
    for j, elemento in enumerate(linha):
        if elemento == procurado:
            print(f"Elemento {procurado} encontrado em ({i}, {j})")
            break
    else:
        continue  # Só executa se o loop interno não foi quebrado
    break  # Quebra o loop externo se elemento foi encontrado
```

## Otimizações e Boas Práticas

### Escolhendo o Loop Certo
```python
# ✅ Use for quando souber o número de iterações
for i in range(10):
    print(i)

# ✅ Use while para condições complexas
while not condicao_complexa():
    fazer_algo()

# ✅ Use enumerate() quando precisar do índice
for i, item in enumerate(lista):
    print(f"{i}: {item}")

# ✅ Use zip() para múltiplas sequências
for nome, idade in zip(nomes, idades):
    print(f"{nome}: {idade}")

# ✅ Use comprehensions para transformações simples
quadrados = [x**2 for x in numeros]

# ✅ Use generators para grandes volumes de dados
def fibonacci_generator():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Usar apenas os primeiros 10 números de Fibonacci
fib = fibonacci_generator()
primeiros_10_fib = [next(fib) for _ in range(10)]
```

### Evitando Armadilhas
```python
# ❌ Modificar lista durante iteração
numeros = [1, 2, 3, 4, 5]
for numero in numeros:
    if numero % 2 == 0:
        numeros.remove(numero)  # PERIGOSO!

# ✅ Criar nova lista ou iterar por índices reversos
numeros = [1, 2, 3, 4, 5]
numeros = [x for x in numeros if x % 2 != 0]  # Nova lista
# Ou
for i in range(len(numeros) - 1, -1, -1):
    if numeros[i] % 2 == 0:
        del numeros[i]

# ❌ Loop infinito sem condição de saída
while True:
    fazer_algo()
    # Sem break ou modificação de condição!

# ✅ Sempre garanta uma condição de saída
tentativas = 0
while tentativas < MAX_TENTATIVAS:
    if fazer_algo():
        break
    tentativas += 1
```

### Performance
```python
# ✅ Evite chamadas desnecessárias dentro do loop
# Ruim
for i in range(len(lista)):
    print(lista[i])

# Melhor
for item in lista:
    print(item)

# ✅ Use funções built-in quando possível
# Ruim
soma = 0
for numero in numeros:
    soma += numero

# Melhor
soma = sum(numeros)

# ✅ Use generators para economizar memória
# Ruim para listas grandes
quadrados = [x**2 for x in range(1000000)]

# Melhor
quadrados = (x**2 for x in range(1000000))
```

Python oferece estruturas de repetição muito flexíveis e expressivas. O uso correto de cada tipo de loop e das comprehensions torna o código mais eficiente e pythônico!
