# Backtracking

Backtracking é uma técnica algorítmica que considera múltiplas soluções possíveis de forma recursiva e retrocede quando encontra um caminho inválido.

## Conceito Básico
- Resolve problemas incrementalmente
- Constrói candidatos à solução
- Abandona caminhos ("backtracks") quando detecta que não levarão a uma solução válida

## Funcionamento
1. **Escolha**: Seleciona uma opção disponível
2. **Restrição**: Verifica se a escolha é válida
3. **Objetivo**: Verifica se chegou à solução
4. **Retrocesso**: Se inválido, desfaz a última escolha e tenta outra opção

## Casos de Uso
- Problema das N-Rainhas
- Sudoku
- Problema do Caixeiro Viajante
- Geração de Permutações
- Labirintos
- Quebra-cabeças de palavras

## Exemplo: Gerando Permutações
```python
def permutacoes(array, inicio=0):
    if inicio == len(array):
        print(array)
        return
    
    for i in range(inicio, len(array)):
        # Troca elementos
        array[inicio], array[i] = array[i], array[inicio]
        
        # Recursão
        permutacoes(array, inicio + 1)
        
        # Backtrack - desfaz a troca
        array[inicio], array[i] = array[i], array[inicio]
```

## Vantagens e Desvantagens
### Vantagens
- Encontra todas as soluções possíveis
- Não desperdiça tempo em caminhos inválidos
- Ótimo para problemas de otimização

### Desvantagens
- Complexidade exponencial em muitos casos
- Pode ser lento para problemas grandes
- Alto consumo de memória devido à recursão
