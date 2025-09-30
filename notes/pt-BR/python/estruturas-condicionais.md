# Estruturas Condicionais em Python

## if, elif, else

### Sintaxe Básica
```python
# Estrutura básica do if
idade = 18

if idade >= 18:
    print("Maior de idade")
    print("Pode votar")
else:
    print("Menor de idade")
    print("Não pode votar ainda")
```

### if, elif, else Completo
```python
nota = 85

if nota >= 90:
    conceito = "A"
    print("Excelente!")
elif nota >= 80:
    conceito = "B"
    print("Muito bom!")
elif nota >= 70:
    conceito = "C"
    print("Bom!")
elif nota >= 60:
    conceito = "D"
    print("Suficiente")
else:
    conceito = "F"
    print("Insuficiente")

print(f"Conceito: {conceito}")
```

### if Simples (uma linha)
```python
# Para comandos simples, pode usar uma linha
idade = 20
if idade >= 18: print("Adulto")

# Ou com operador ternário (mais pythônico)
status = "adulto" if idade >= 18 else "menor"
print(status)
```

## Condições Múltiplas

### Operadores Lógicos
```python
idade = 25
tem_carteira = True
tem_veiculo = False

# AND - todas as condições devem ser verdadeiras
if idade >= 18 and tem_carteira:
    print("Pode dirigir")

# OR - pelo menos uma condição deve ser verdadeira
if tem_carteira or tem_veiculo:
    print("Tem algum meio de transporte")

# NOT - inverte a condição
if not tem_veiculo:
    print("Precisa de transporte")

# Combinando operadores
if idade >= 18 and (tem_carteira or tem_veiculo):
    print("Pode se locomover")
```

### Comparações em Cadeia
```python
# Recurso exclusivo do Python - muito elegante!
nota = 85
if 80 <= nota <= 90:
    print("Nota entre 80 e 90")

# Equivale a (mas é mais legível):
if nota >= 80 and nota <= 90:
    print("Nota entre 80 e 90")

# Múltiplas comparações
temperatura = 25
if 20 < temperatura < 30:
    print("Temperatura agradável")

# Com diferentes operadores
valor = 15
if 10 <= valor != 20 < 30:
    print("Condição complexa atendida")
```

## Operador in para Condições

### Verificação de Membro
```python
# Verificar se valor está em lista/tupla
dia_semana = "sábado"
if dia_semana in ["sábado", "domingo"]:
    print("É fim de semana!")

# Com strings
email = "usuario@exemplo.com"
if "@" in email and "." in email:
    print("Email parece válido")

# Com dicionários (verifica chaves)
usuario = {"nome": "João", "idade": 30, "ativo": True}
if "idade" in usuario:
    print(f"Idade: {usuario['idade']}")

# Verificação negativa
status = "inativo"
if status not in ["ativo", "pendente"]:
    print("Status inválido ou inativo")
```

## Condições com Valores "Truthy" e "Falsy"

### Valores que são False em contexto booleano
```python
# Valores "falsy" em Python
valores_falsy = [False, None, 0, 0.0, "", [], {}, set()]

for valor in valores_falsy:
    if not valor:
        print(f"{repr(valor)} é falsy")

# Uso prático
lista_numeros = []
if lista_numeros:  # False se lista vazia
    print("Lista tem elementos")
else:
    print("Lista está vazia")

# Verificação de string
nome = ""
if nome:  # False se string vazia
    print(f"Olá, {nome}")
else:
    print("Nome não informado")

# Com None
resultado = None
if resultado is not None:  # Melhor que 'if resultado'
    print(f"Resultado: {resultado}")
```

### Uso Idiomático
```python
# ✅ Pythônico
def processar_lista(dados):
    if not dados:  # Verifica se lista está vazia
        return "Lista vazia"
    
    if len(dados) == 1:
        return "Um elemento"
    
    return f"{len(dados)} elementos"

# ✅ Verificação segura de dicionário
config = {"debug": True, "porta": 8080}
if config.get("debug"):  # Retorna None se chave não existir
    print("Modo debug ativado")
```

## if Aninhado

### Estruturas Aninhadas
```python
idade = 25
tem_carteira = True
experiencia_anos = 3

if idade >= 18:
    print("Maior de idade")
    
    if tem_carteira:
        print("Tem carteira de motorista")
        
        if experiencia_anos >= 2:
            print("Pode dirigir carros grandes")
        else:
            print("Apenas carros pequenos")
    else:
        print("Precisa tirar carteira")
else:
    print("Muito jovem para dirigir")
```

### Evitando Aninhamento Excessivo
```python
# ❌ Muitos níveis de aninhamento
def processar_usuario(usuario):
    if usuario:
        if "email" in usuario:
            if "@" in usuario["email"]:
                if usuario.get("ativo"):
                    return "Usuário válido"
                else:
                    return "Usuário inativo"
            else:
                return "Email inválido"
        else:
            return "Email não fornecido"
    else:
        return "Usuário não fornecido"

# ✅ Usando guard clauses (retorno antecipado)
def processar_usuario_melhor(usuario):
    if not usuario:
        return "Usuário não fornecido"
    
    if "email" not in usuario:
        return "Email não fornecido"
    
    if "@" not in usuario["email"]:
        return "Email inválido"
    
    if not usuario.get("ativo"):
        return "Usuário inativo"
    
    return "Usuário válido"
```

## Expressões Condicionais (Operador Ternário)

### Sintaxe: valor_se_true if condição else valor_se_false
```python
# Exemplo básico
idade = 17
status = "adulto" if idade >= 18 else "menor"
print(status)  # "menor"

# Com cálculos
x = 10
y = 5
maior = x if x > y else y
print(f"Maior número: {maior}")

# Em listas
numeros = [1, 2, 3, 4, 5]
classificacao = ["par" if n % 2 == 0 else "ímpar" for n in numeros]
print(classificacao)  # ['ímpar', 'par', 'ímpar', 'par', 'ímpar']
```

### Operador Ternário Aninhado
```python
# Pode ser aninhado, mas cuidado com legibilidade
nota = 85
conceito = "A" if nota >= 90 else "B" if nota >= 80 else "C" if nota >= 70 else "F"
print(conceito)  # "B"

# Melhor usar if-elif para casos complexos
if nota >= 90:
    conceito = "A"
elif nota >= 80:
    conceito = "B"
elif nota >= 70:
    conceito = "C"
else:
    conceito = "F"
```

## Match-Case (Python 3.10+)

### Nova Sintaxe Switch-Like
```python
# Equivalente ao switch de outras linguagens
def processar_comando(comando):
    match comando:
        case "sair" | "quit" | "exit":
            return "Encerrando programa"
        case "ajuda" | "help":
            return "Comandos disponíveis: sair, ajuda, status"
        case "status":
            return "Sistema funcionando"
        case _:  # default case
            return "Comando não reconhecido"

print(processar_comando("ajuda"))
print(processar_comando("sair"))
print(processar_comando("teste"))
```

### Match com Patterns Avançados
```python
# Match com estruturas de dados
def analisar_ponto(ponto):
    match ponto:
        case (0, 0):
            return "Origem"
        case (0, y):
            return f"No eixo Y: {y}"
        case (x, 0):
            return f"No eixo X: {x}"
        case (x, y) if x == y:
            return f"Na diagonal: ({x}, {y})"
        case (x, y):
            return f"Ponto qualquer: ({x}, {y})"

print(analisar_ponto((0, 0)))     # "Origem"
print(analisar_ponto((3, 3)))     # "Na diagonal: (3, 3)"
print(analisar_ponto((1, 2)))     # "Ponto qualquer: (1, 2)"

# Match com dicionários
def processar_evento(evento):
    match evento:
        case {"tipo": "click", "botao": "esquerdo"}:
            return "Click esquerdo"
        case {"tipo": "click", "botao": "direito"}:
            return "Click direito"
        case {"tipo": "tecla", "codigo": codigo} if codigo.isalpha():
            return f"Tecla letra: {codigo}"
        case {"tipo": "tecla", "codigo": codigo}:
            return f"Tecla especial: {codigo}"
        case _:
            return "Evento desconhecido"
```

## Tratamento de Exceções em Condições

### try-except como Condição
```python
# Verificar se string é número
texto = "123"
try:
    numero = int(texto)
    print(f"É um número: {numero}")
except ValueError:
    print("Não é um número válido")

# EAFP (Easier to Ask for Forgiveness than Permission)
# Estilo pythônico para verificações
dados = {"nome": "João"}

# ✅ Pythônico (EAFP)
try:
    idade = dados["idade"]
    print(f"Idade: {idade}")
except KeyError:
    print("Idade não informada")

# vs LBYL (Look Before You Leap)
if "idade" in dados:
    idade = dados["idade"]
    print(f"Idade: {idade}")
else:
    print("Idade não informada")
```

## Dicas e Melhores Práticas

### Código Limpo
```python
# ✅ Use comparações em cadeia
if 18 <= idade <= 65:
    print("Idade trabalhista")

# ✅ Use 'in' para múltiplos valores
if status in ("ativo", "pendente", "processando"):
    print("Status válido")

# ✅ Use guard clauses para reduzir aninhamento
def validar_usuario(usuario):
    if not usuario:
        return False
    
    if not usuario.get("email"):
        return False
    
    if not usuario.get("ativo", True):
        return False
    
    return True

# ✅ Prefira is/is not para None, True, False
if resultado is None:
    print("Sem resultado")

if flag is True:  # Apenas se você realmente quer True, não truthy
    print("Flag explicitamente True")

# ✅ Use valores padrão
nome = input("Nome: ") or "Anônimo"
```

### Evitar Armadilhas
```python
# ❌ Evite comparações desnecessárias
if condicao == True:  # Ruim
    pass

if condicao:          # Bom
    pass

# ❌ Cuidado com mutáveis como padrão
lista = []
if lista == []:       # Funciona, mas...
    pass

if not lista:         # Melhor (mais pythônico)
    pass

# ❌ Evite condições muito complexas
if (a and b) or (c and d) or (e and not f and g):  # Difícil de ler
    pass

# ✅ Quebre em variáveis intermediárias
condicao1 = a and b
condicao2 = c and d
condicao3 = e and not f and g

if condicao1 or condicao2 or condicao3:
    pass
```

Python oferece estruturas condicionais muito expressivas e legíveis. O uso correto desses recursos torna o código mais pythônico e fácil de manter!
