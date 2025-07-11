# Programação Dinâmica (Dynamic Programming)

A programação dinâmica é uma técnica algorítmica para resolver problemas de otimização através da decomposição em subproblemas menores. Diferente dos algoritmos gulosos, a programação dinâmica garante a solução ótima ao considerar todas as possibilidades e reutilizar soluções de subproblemas já calculados.

## Características Principais

- **Subestrutura ótima:** A solução ótima do problema contém soluções ótimas de subproblemas.
- **Subproblemas sobrepostos:** Os mesmos subproblemas são resolvidos múltiplas vezes.
- **Memoização:** Armazena resultados de subproblemas para evitar recálculos.

## Quando usar?

A programação dinâmica é ideal quando:

- O problema pode ser dividido em subproblemas menores
- Os subproblemas se repetem (sobreposição)
- Você precisa da solução ótima (não apenas uma solução aproximada)

## Abordagens

### Top-Down (Memoização)
- Começa com o problema original
- Recursivamente divide em subproblemas
- Armazena resultados em uma tabela/cache

### Bottom-Up (Tabulação)
- Começa resolvendo os menores subproblemas
- Constrói a solução de baixo para cima
- Preenche uma tabela sistematicamente

## Exemplo Clássico: Sequência de Fibonacci

**Abordagem Ingênua (Recursiva):**
```python
def fibonacci_recursivo(n):
    if n <= 1:
        return n
    return fibonacci_recursivo(n-1) + fibonacci_recursivo(n-2)
```
Complexidade: O(2^n) - muito ineficiente!

**Com Programação Dinâmica (Memoização):**
```python
def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]
```
Complexidade: O(n) - muito mais eficiente!

## Exemplo Prático: Problema da Mochila

Imagine que você tem uma mochila com capacidade limitada e vários itens com pesos e valores diferentes. O objetivo é maximizar o valor total sem exceder a capacidade.

**Características do problema:**
- Cada item pode ser incluído ou não (0/1)
- Queremos maximizar o valor total
- Respeitando a restrição de peso

**Solução com Programação Dinâmica:**
```python
def mochila(capacidade, pesos, valores, n):
    # Criar tabela DP
    dp = [[0 for _ in range(capacidade + 1)] for _ in range(n + 1)]
    
    # Preencher a tabela
    for i in range(1, n + 1):
        for w in range(1, capacidade + 1):
            if pesos[i-1] <= w:
                # Pode incluir o item
                dp[i][w] = max(
                    valores[i-1] + dp[i-1][w - pesos[i-1]],  # Incluir
                    dp[i-1][w]  # Não incluir
                )
            else:
                # Não pode incluir o item
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacidade]
```

## Vantagens vs Desvantagens

### Vantagens:
- **Solução ótima garantida**
- **Eficiência:** Evita cálculos repetidos
- **Aplicável a muitos problemas:** Otimização, contagem, decisão

### Desvantagens:
- **Uso de memória:** Pode requerer muito espaço
- **Complexidade:** Mais difícil de implementar que algoritmos gulosos
- **Nem sempre necessário:** Para alguns problemas, soluções mais simples existem

## Problemas Clássicos

- **Longest Common Subsequence (LCS)**
- **Edit Distance (Levenshtein)**
- **Coin Change Problem**
- **Rod Cutting Problem**
- **Maximum Subarray Sum**
- **Palindrome Partitioning**

## Comparação com Algoritmos Gulosos

| Aspecto | Programação Dinâmica | Algoritmos Gulosos |
|---------|---------------------|-------------------|
| **Solução** | Sempre ótima | Nem sempre ótima |
| **Complexidade** | Maior | Menor |
| **Memória** | Mais uso | Menos uso |
| **Velocidade** | Mais lenta | Mais rápida |
| **Casos de uso** | Problemas complexos | Problemas específicos |
