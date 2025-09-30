### Recursão - A Arte de Resolver Problemas se Chamando

**O que é Recursão?**

A **recursão** é uma técnica de programação onde uma função chama a si mesma para resolver um problema menor, até chegar a um caso base que para a recursão.

**Analogia:** Imagine que você está procurando suas chaves em uma pilha de papéis. Você pega o primeiro papel, se não são as chaves, pega o próximo papel (chama a si mesmo com uma pilha menor), e repete até encontrar as chaves ou a pilha acabar.

### Anatomia de uma Função Recursiva

Toda função recursiva precisa de **duas partes essenciais**:

| Componente | Descrição | Importância |
|------------|-----------|-------------|
| **Caso Base** | Condição que para a recursão |  **Evita loop infinito** |
| **Caso Recursivo** | Função chama a si mesma com problema menor |  **Progride para solução** |

### Exemplo Clássico: Fatorial

**Definição matemática:**
- `fatorial(0) = 1` (caso base)
- `fatorial(n) = n × fatorial(n-1)` (caso recursivo)

```python
def fatorial(n):
    # Caso base: para a recursão
    if n == 0 or n == 1:
        return 1
    
    # Caso recursivo: problema menor
    return n * fatorial(n - 1)

# Teste
print(fatorial(5))  # Resultado: 120
```

### Como a Recursão Funciona na Prática

**Chamada:** `fatorial(4)`

```
fatorial(4)
├── 4 × fatorial(3)
    ├── 4 × (3 × fatorial(2))
        ├── 4 × (3 × (2 × fatorial(1)))
            ├── 4 × (3 × (2 × 1))
            └── 4 × (3 × 2) = 4 × 6 = 24
```

### Vantagens da Recursão

| Vantagem | Descrição | Exemplo |
|----------|-----------|---------|
| **Código Limpo** | Solução elegante e legível | Algoritmos de árvore |
| **Problemas Naturais** | Alguns problemas são naturalmente recursivos | Fractais, Fibonacci |
| **Divisão do Problema** | Quebra problema complexo em partes menores | Merge Sort |

### Desvantagens da Recursão

| Desvantagem | Descrição | Solução |
|-------------|-----------|---------|
| **Uso de Memória** | Cada chamada usa espaço na pilha | Usar iteração ou otimização |
| **Performance** | Pode ser mais lenta que iteração | Memoização |
| **Stack Overflow** | Muitas chamadas podem estourar a pilha | Limitar profundidade |

### Recursão vs Iteração

```python
# Recursão
def fibonacci_recursivo(n):
    if n <= 1:
        return n
    return fibonacci_recursivo(n-1) + fibonacci_recursivo(n-2)

# Iteração
def fibonacci_iterativo(n):
    if n <= 1:
        return n
    
    a, b = 0, 1
    for i in range(2, n + 1):
        a, b = b, a + b
    return b
```

### Tipos de Recursão

#### Recursão Linear
Uma única chamada recursiva por execução:
```python
def soma_lista(lista):
    if not lista:
        return 0
    return lista[0] + soma_lista(lista[1:])
```

#### Recursão de Cauda
A chamada recursiva é a última operação:
```python
def fatorial_cauda(n, acumulador=1):
    if n <= 1:
        return acumulador
    return fatorial_cauda(n - 1, n * acumulador)
```

#### Recursão Múltipla
Múltiplas chamadas recursivas:
```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)  # Duas chamadas
```

### Algoritmos Clássicos com Recursão

#### Busca Binária Recursiva
```python
def busca_binaria(lista, item, inicio=0, fim=None):
    if fim is None:
        fim = len(lista) - 1
    
    if inicio > fim:
        return -1  # Item não encontrado
    
    meio = (inicio + fim) // 2
    
    if lista[meio] == item:
        return meio
    elif lista[meio] > item:
        return busca_binaria(lista, item, inicio, meio - 1)
    else:
        return busca_binaria(lista, item, meio + 1, fim)
```

#### Torre de Hanói
```python
def torre_hanoi(n, origem, destino, auxiliar):
    if n == 1:
        print(f"Mover disco de {origem} para {destino}")
        return
    
    # Mover n-1 discos para auxiliar
    torre_hanoi(n-1, origem, auxiliar, destino)
    
    # Mover o maior disco para destino
    print(f"Mover disco de {origem} para {destino}")
    
    # Mover n-1 discos do auxiliar para destino
    torre_hanoi(n-1, auxiliar, destino, origem)
```

### Otimização: Memoização

Para evitar cálculos repetidos:

```python
# Sem memoização (lento)
def fibonacci_lento(n):
    if n <= 1:
        return n
    return fibonacci_lento(n-1) + fibonacci_lento(n-2)

# Com memoização (rápido)
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]
```

### Quando Usar Recursão

✅ **Use recursão quando:**
- O problema tem estrutura recursiva natural (árvores, fractais)
- Solução recursiva é mais clara que iterativa
- Profundidade não é muito grande

❌ **Evite recursão quando:**
- Performance é crítica
- Profundidade pode ser muito grande
- Solução iterativa é mais simples

### Dicas Práticas

#### Sempre Defina o Caso Base
```python
def countdown(n):
    if n <= 0:  # ❗ Caso base essencial
        print("Fim!")
        return
    
    print(n)
    countdown(n - 1)
```

#### Garanta que o Problema Diminui
```python
def busca_elemento(lista, elemento):
    if not lista:  # Lista vazia
        return False
    
    if lista[0] == elemento:
        return True
    
    # ❗ Lista fica menor a cada chamada
    return busca_elemento(lista[1:], elemento)
```

#### Considere Limites de Stack
```python
import sys
sys.setrecursionlimit(10000)  # Aumenta limite se necessário
```

### Recursão em Diferentes Linguagens

#### Go
```go
func fatorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * fatorial(n-1)
}
```

#### JavaScript
```javascript
function fatorial(n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}
```

### Exercícios para Praticar

**Potência:** Calcule `x^n` recursivamente

**Palíndromo:** Verifique se uma string é palíndroma

**Soma de Dígitos:** Some todos os dígitos de um número

**Traversal de Árvore:** Percorra uma árvore binária

**Backtracking:** Resolva o problema das N-Rainhas

### Recursos Externos

📚 **Documentação e Tutoriais:**
- [Recursion Visualizer](https://recursion.vercel.app/) - Visualize como a recursão funciona
- [Python Recursion Tutorial](https://realpython.com/python-recursion/)
- [Recursion in Computer Science](https://en.wikipedia.org/wiki/Recursion_(computer_science))

🎥 **Vídeos Recomendados:**
- [Recursion Explained - Computerphile](https://www.youtube.com/watch?v=Mv9NEXX1VHc)
- [5 Simple Steps for Solving Any Recursive Problem](https://www.youtube.com/watch?v=ngCos392W4w)

🛠️ **Ferramentas Interativas:**
- [HackerRank](https://www.hackerrank.com/) - Pratique online

A recursão é uma ferramenta poderosa que, quando bem compreendida, pode tornar soluções complexas elegantemente simples!
