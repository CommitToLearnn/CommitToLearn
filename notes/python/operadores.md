# Operadores em Python

## Operadores Aritméticos

### Operadores Básicos
```python
a = 10
b = 3

print(f"Soma: {a + b}")           # 13
print(f"Subtração: {a - b}")      # 7
print(f"Multiplicação: {a * b}")  # 30
print(f"Divisão: {a / b}")        # 3.333... (sempre retorna float)
print(f"Divisão inteira: {a // b}")  # 3 (floor division)
print(f"Módulo: {a % b}")         # 1 (resto da divisão)
print(f"Potenciação: {a ** b}")   # 1000

# Divisão vs Divisão inteira
print(10 / 3)    # 3.3333333333333335
print(10 // 3)   # 3
print(-10 // 3)  # -4 (floor division sempre arredonda para baixo)
```

### Operadores de Atribuição
```python
numero = 10

# Atribuição composta
numero += 5   # numero = numero + 5  (15)
numero -= 3   # numero = numero - 3  (12)
numero *= 2   # numero = numero * 2  (24)
numero /= 4   # numero = numero / 4  (6.0)
numero //= 2  # numero = numero // 2 (3.0)
numero %= 2   # numero = numero % 2  (1.0)
numero **= 3  # numero = numero ** 3 (1.0)

print(numero)  # 1.0

# Atribuição múltipla
x = y = z = 0
a, b, c = 1, 2, 3
```

### Operações com Strings
```python
# Concatenação
nome = "Python"
versao = "3.11"
resultado = nome + " " + versao  # "Python 3.11"

# Repetição
linha = "-" * 20  # "--------------------"
print(linha)

# Operadores compostos com strings
mensagem = "Olá"
mensagem += " mundo"  # "Olá mundo"
```

## Operadores de Comparação

### Comparações Básicas
```python
a = 10
b = 20

print(a == b)   # False (igual)
print(a != b)   # True (diferente)
print(a < b)    # True (menor que)
print(a > b)    # False (maior que)
print(a <= b)   # True (menor ou igual)
print(a >= b)   # False (maior ou igual)

# Comparações em cadeia (exclusivo do Python!)
idade = 25
print(18 <= idade <= 65)  # True (muito mais legível que em outras linguagens)

# Comparação de strings (lexicográfica)
print("abc" < "abd")      # True
print("Python" > "Java")  # True (P > J)
```

### Operadores de Identidade
```python
# 'is' verifica se são o mesmo objeto na memória
# '==' verifica se têm o mesmo valor

a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)   # True (mesmo conteúdo)
print(a is b)   # False (objetos diferentes)
print(a is c)   # True (mesmo objeto)

# Especial com None
valor = None
print(valor is None)     # ✅ Correto
print(valor == None)     # ✅ Funciona, mas 'is' é preferível

# Caching de pequenos inteiros
x = 256
y = 256
print(x is y)   # True (Python cached números pequenos)

x = 257
y = 257
print(x is y)   # False (números grandes não são cached)
```

## Operadores Lógicos

### AND, OR, NOT
```python
# Operadores lógicos retornam um dos operandos, não apenas True/False
print(True and False)   # False
print(True or False)    # True
print(not True)         # False

# Comportamento com valores "truthy" e "falsy"
print(0 and "texto")     # 0 (primeiro valor falsy)
print("texto" and 42)    # 42 (último valor se todos são truthy)
print("" or "default")   # "default" (primeiro valor truthy)
print(None or 0 or "oi") # "oi" (primeiro valor truthy)

# Curto-circuito (short-circuit)
def funcao_custosa():
    print("Função executada!")
    return True

# AND para de avaliar se encontrar False
resultado = False and funcao_custosa()  # funcao_custosa() não é executada

# OR para de avaliar se encontrar True
resultado = True or funcao_custosa()    # funcao_custosa() não é executada
```

### Precedência Lógica
```python
# Precedência: not > and > or
resultado = True or False and False  # True (equivale a: True or (False and False))
resultado = not False or True        # True (equivale a: (not False) or True)

# Use parênteses para clareza
resultado = (True or False) and False  # False
```

## Operadores de Membro

### in e not in
```python
# Verificar se elemento está em sequência
frutas = ["maçã", "banana", "laranja"]
print("banana" in frutas)      # True
print("uva" not in frutas)     # True

# Com strings
texto = "Python Programming"
print("Python" in texto)       # True
print("Java" not in texto)     # True

# Com dicionários (verifica chaves)
pessoa = {"nome": "João", "idade": 30}
print("nome" in pessoa)         # True
print("João" in pessoa)         # False (verifica chaves, não valores)
print("João" in pessoa.values())  # True (verificar valores)

# Com conjuntos (muito eficiente)
numeros = {1, 2, 3, 4, 5}
print(3 in numeros)            # True - O(1) em média
```

## Operadores Bit a Bit

### Operações Binárias
```python
a = 10  # 1010 em binário
b = 6   # 0110 em binário

print(f"AND: {a & b}")    # 2 (0010)
print(f"OR: {a | b}")     # 14 (1110)
print(f"XOR: {a ^ b}")    # 12 (1100)
print(f"NOT: {~a}")       # -11 (complemento de dois)
print(f"Left shift: {a << 1}")   # 20 (10100)
print(f"Right shift: {a >> 1}")  # 5 (0101)

# Uso prático: verificar se número é par
def eh_par(n):
    return (n & 1) == 0  # Bit menos significativo

print(eh_par(10))  # True
print(eh_par(11))  # False
```

## Operador Walrus (Python 3.8+)

### Atribuição em Expressões
```python
# Operador := permite atribuição dentro de expressões
numeros = [1, 2, 3, 4, 5]

# Sem walrus operator
soma = sum(numeros)
if soma > 10:
    print(f"Soma {soma} é maior que 10")

# Com walrus operator
if (soma := sum(numeros)) > 10:
    print(f"Soma {soma} é maior que 10")

# Útil em list comprehensions
dados = [1, 2, 3, 4, 5]
quadrados_grandes = [y for x in dados if (y := x**2) > 10]
print(quadrados_grandes)  # [16, 25]

# Útil em loops
import random
while (numero := random.randint(1, 10)) != 7:
    print(f"Tentativa: {numero}")
print("Acertou o 7!")
```

## Operadores Especiais

### Operador de Desempacotamento
```python
# * para listas/tuplas
numeros = [1, 2, 3, 4, 5]
primeiro, *meio, ultimo = numeros
print(f"Primeiro: {primeiro}, Meio: {meio}, Último: {ultimo}")

# ** para dicionários
def info_pessoa(nome, idade, cidade):
    return f"{nome}, {idade} anos, de {cidade}"

dados = {"nome": "Ana", "idade": 25, "cidade": "São Paulo"}
resultado = info_pessoa(**dados)  # Desempacota dicionário como argumentos
print(resultado)

# * em chamadas de função
numeros = [1, 2, 3]
print(*numeros)  # Equivale a print(1, 2, 3)
```

### Operador Ternário
```python
# Sintaxe: valor_se_true if condicao else valor_se_false
idade = 17
status = "adulto" if idade >= 18 else "menor"
print(status)  # "menor"

# Pode ser aninhado (mas cuidado com legibilidade)
nota = 85
conceito = "A" if nota >= 90 else "B" if nota >= 80 else "C"
print(conceito)  # "B"

# Em list comprehensions
numeros = range(10)
pares_impares = ["par" if x % 2 == 0 else "ímpar" for x in numeros]
print(pares_impares)
```

## Precedência de Operadores

### Ordem de Avaliação (maior para menor precedência)
```python
# 1. () - Parênteses
# 2. ** - Potenciação
# 3. +x, -x, ~x - Unários
# 4. *, /, //, % - Multiplicativos
# 5. +, - - Aditivos
# 6. <<, >> - Shift
# 7. & - AND bit a bit
# 8. ^ - XOR bit a bit
# 9. | - OR bit a bit
# 10. ==, !=, <, >, <=, >=, is, is not, in, not in - Comparações
# 11. not - NOT lógico
# 12. and - AND lógico
# 13. or - OR lógico

# Exemplos práticos
resultado = 2 + 3 * 4         # 14 (não 20)
resultado = (2 + 3) * 4       # 20
resultado = 2 ** 3 ** 2       # 512 (2 ** (3 ** 2), associatividade à direita)
resultado = (2 ** 3) ** 2     # 64

# Comparações são avaliadas da esquerda para direita
print(1 < 2 < 3)              # True (equivale a 1 < 2 and 2 < 3)
print(3 > 2 > 1)              # True
print(1 < 2 > 3)              # False (equivale a 1 < 2 and 2 > 3)
```

## Dicas e Melhores Práticas

### Uso Eficiente
```python
# ✅ Use 'is' para comparar com None, True, False
if value is None:
    pass

# ✅ Use 'in' para verificar múltiplos valores
if status in ('ativo', 'pendente', 'em_progresso'):
    pass

# ✅ Aproveite a avaliação short-circuit
# Evita erro se lista estiver vazia
if lista and lista[0] > 10:
    pass

# ✅ Use operadores compostos para clareza
contador += 1  # Melhor que contador = contador + 1

# ✅ Aproveite comparações em cadeia
if 0 <= indice < len(lista):  # Muito pythônico
    pass

# ❌ Evite comparações desnecessárias com True/False
if condicao == True:    # Ruim
    pass

if condicao:            # Bom
    pass
```

### Armadilhas Comuns
```python
# ❌ Cuidado com mutabilidade e referências
lista1 = [1, 2, 3]
lista2 = lista1        # Mesma referência!
lista2.append(4)
print(lista1)          # [1, 2, 3, 4] - foi modificada!

# ✅ Fazer cópia quando necessário
lista2 = lista1.copy()  # ou lista1[:]

# ❌ Cuidado com operadores bit a bit vs lógicos
if True & False:       # 0 (falsy) - operação bit a bit
    print("Não executa")

if True and False:     # False - operação lógica
    print("Não executa")

# ❌ Confundir is com ==
if "hello" is "hello":  # Pode ser True ou False (depende do interpretador)
    pass

if "hello" == "hello":  # Sempre True - comparação de valor
    pass
```

Python oferece operadores muito expressivos que tornam o código mais legível e conciso quando usados corretamente!
