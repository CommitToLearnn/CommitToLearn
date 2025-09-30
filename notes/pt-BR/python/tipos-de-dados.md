# Tipos de Dados em Python

## Tipos Básicos

### Números
```python
# Inteiros (int)
idade = 25
populacao = 8000000000

# Ponto flutuante (float)
preco = 19.99
temperatura = -5.5

# Números complexos (complex)
numero_complexo = 3 + 4j

print(type(idade))        # <class 'int'>
print(type(preco))        # <class 'float'>
print(type(numero_complexo))  # <class 'complex'>
```

### Strings (str)
```python
# Diferentes formas de criar strings
nome = "João"
sobrenome = 'Silva'
texto_longo = """Esta é uma string
que pode ocupar
múltiplas linhas"""

# Strings são imutáveis
mensagem = "Olá"
print(id(mensagem))  # ID da string original

mensagem = mensagem + " mundo"
print(id(mensagem))  # ID diferente - nova string criada

# Operações básicas
print(len(nome))           # 4 (comprimento)
print(nome.upper())        # JOÃO
print(nome.lower())        # joão
print("Python" in texto_longo)  # False
```

### Booleanos (bool)
```python
# Valores booleanos
ativo = True
inativo = False

# Conversões para booleano
print(bool(1))        # True
print(bool(0))        # False
print(bool(""))       # False (string vazia)
print(bool("texto"))  # True
print(bool([]))       # False (lista vazia)
print(bool([1, 2]))   # True

# Operadores lógicos
resultado = True and False  # False
resultado = True or False   # True
resultado = not True        # False
```

## Tipos de Coleção

### Listas (list)
```python
# Listas são mutáveis e ordenadas
frutas = ["maçã", "banana", "laranja"]
numeros = [1, 2, 3, 4, 5]
mista = [1, "texto", 3.14, True]

# Operações básicas
frutas.append("uva")          # Adicionar ao final
frutas.insert(1, "pêra")      # Inserir em posição específica
frutas.remove("banana")       # Remover por valor
primeiro = frutas.pop(0)      # Remover e retornar por índice

print(frutas)                 # Lista atualizada
print(len(frutas))            # Tamanho da lista
```

### Tuplas (tuple)
```python
# Tuplas são imutáveis e ordenadas
coordenadas = (10, 20)
cores = ("vermelho", "verde", "azul")
singleton = (42,)  # Vírgula necessária para tupla de um elemento

# Acessar elementos
x, y = coordenadas  # Desempacotamento
print(f"X: {x}, Y: {y}")

# Tentativa de modificação causa erro
# coordenadas[0] = 15  # TypeError!
```

### Dicionários (dict)
```python
# Dicionários são mutáveis e mapeiam chaves para valores
pessoa = {
    "nome": "Maria",
    "idade": 30,
    "cidade": "São Paulo"
}

# Acessar e modificar
print(pessoa["nome"])           # Maria
pessoa["profissao"] = "Engenheira"  # Adicionar nova chave
pessoa["idade"] = 31            # Modificar valor existente

# Métodos úteis
print(pessoa.keys())            # dict_keys(['nome', 'idade', 'cidade', 'profissao'])
print(pessoa.values())          # dict_values(['Maria', 31, 'São Paulo', 'Engenheira'])
print(pessoa.get("telefone", "Não informado"))  # Valor padrão se chave não existir
```

### Conjuntos (set)
```python
# Conjuntos são mutáveis, não ordenados e sem duplicatas
numeros = {1, 2, 3, 4, 5}
frutas = {"maçã", "banana", "laranja"}

# Operações de conjunto
outros_numeros = {4, 5, 6, 7, 8}
print(numeros.union(outros_numeros))        # {1, 2, 3, 4, 5, 6, 7, 8}
print(numeros.intersection(outros_numeros)) # {4, 5}
print(numeros.difference(outros_numeros))   # {1, 2, 3}

# Adicionar e remover
numeros.add(9)
numeros.remove(1)  # KeyError se não existir
numeros.discard(10)  # Não gera erro se não existir
```

## Verificação de Tipos

### Função type() e isinstance()
```python
# Verificar tipo exato
numero = 42
print(type(numero))           # <class 'int'>
print(type(numero) == int)    # True

# Verificar se é instância (recomendado)
print(isinstance(numero, int))     # True
print(isinstance(numero, (int, float)))  # True (múltiplos tipos)

# Diferença prática
class MinhaLista(list):
    pass

minha_lista = MinhaLista([1, 2, 3])
print(type(minha_lista) == list)        # False
print(isinstance(minha_lista, list))    # True (herança)
```

## Conversão de Tipos

### Conversões Explícitas
```python
# Para inteiro
print(int("123"))      # 123
print(int(45.67))      # 45 (trunca)
print(int(True))       # 1

# Para float
print(float("3.14"))   # 3.14
print(float(42))       # 42.0

# Para string
print(str(123))        # "123"
print(str([1, 2, 3]))  # "[1, 2, 3]"

# Para lista
print(list("Python"))  # ['P', 'y', 't', 'h', 'o', 'n']
print(list((1, 2, 3))) # [1, 2, 3]

# Para tupla
print(tuple([1, 2, 3])) # (1, 2, 3)

# Para conjunto
print(set([1, 2, 2, 3])) # {1, 2, 3} (remove duplicatas)
```

## Tipos Especiais

### None
```python
# Representa ausência de valor
valor = None
print(type(valor))     # <class 'NoneType'>
print(valor is None)   # True (use 'is' para comparar com None)

# Função sem return explícito retorna None
def funcao_sem_return():
    print("Ola!")

resultado = funcao_sem_return()
print(resultado)       # None
```

### Bytes e Bytearray
```python
# Bytes (imutável)
dados_bytes = b"Hello"
dados_encoded = "Olá".encode("utf-8")
print(type(dados_bytes))   # <class 'bytes'>

# Bytearray (mutável)
dados_mutaveis = bytearray(b"Hello")
dados_mutaveis[0] = ord('h')  # Modificar primeiro byte
print(dados_mutaveis)      # bytearray(b'hello')
```

## Dicas Importantes

### Valores "Falsy" em Python
```python
# Valores que são considerados False em contextos booleanos
valores_falsy = [
    False,
    None,
    0,
    0.0,
    "",
    [],
    {},
    set()
]

for valor in valores_falsy:
    if not valor:
        print(f"{repr(valor)} é falsy")
```

### Mutabilidade
```python
# Tipos imutáveis: int, float, str, tuple, frozenset
# Tipos mutáveis: list, dict, set

# Exemplo de comportamento diferente
lista_a = [1, 2, 3]
lista_b = lista_a  # Mesma referência
lista_b.append(4)
print(lista_a)     # [1, 2, 3, 4] - modificada!

string_a = "hello"
string_b = string_a
string_b = string_b + " world"
print(string_a)    # "hello" - inalterada
```

### Métodos Úteis por Tipo
```python
# String
texto = "Python Programming"
print(texto.split())           # ['Python', 'Programming']
print(texto.replace("Python", "Java"))  # "Java Programming"
print(texto.startswith("Py"))  # True

# Lista
numeros = [3, 1, 4, 1, 5]
numeros.sort()                 # Ordena in-place
print(numeros)                 # [1, 1, 3, 4, 5]
print(numeros.count(1))        # 2

# Dicionário
pessoa = {"nome": "Ana", "idade": 25}
for chave, valor in pessoa.items():
    print(f"{chave}: {valor}")
```

Python é uma linguagem de tipagem dinâmica, o que significa que você não precisa declarar tipos explicitamente, mas é importante entender os tipos para escrever código eficiente e correto!
