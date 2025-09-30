# Sliding Window (Janela Deslizante)

Sliding Window é uma técnica algorítmica que transforma problemas complexos com loops aninhados em um único loop, melhorando significativamente a performance.

## Conceito Básico
- Mantém uma "janela" de elementos
- A janela pode crescer ou encolher
- "Desliza" pela estrutura de dados

## Tipos de Janelas
1. **Tamanho Fixo**
   - Janela mantém tamanho constante
   - Desliza um elemento por vez
   - Exemplo: média móvel

2. **Tamanho Variável**
   - Janela pode crescer ou encolher
   - Baseado em alguma condição
   - Exemplo: maior substring sem caracteres repetidos

## Padrão de Implementação
```python
def slidingWindow(array):
    janela_inicio = 0
    janela_fim = 0
    resultado = 0
    
    while janela_fim < len(array):
        # Expande a janela
        # Adiciona array[janela_fim] à janela
        
        while (condição_para_encolher):
            # Remove array[janela_inicio] da janela
            janela_inicio += 1
        
        # Atualiza o resultado se necessário
        
        janela_fim += 1
    
    return resultado
```

## Casos de Uso
- Encontrar subarray com soma específica
- Maior/menor substring com certas propriedades
- Detecção de padrões em strings
- Problemas de fluxo de dados contínuo
- Análise de séries temporais

## Complexidade
- Tempo: O(n) na maioria dos casos
- Espaço: O(1) ou O(k) onde k é o tamanho da janela

## Exemplo Prático
```python
def maxSomaSubarray(array, k):
    """
    Encontra a soma máxima de k elementos consecutivos
    """
    if len(array) < k:
        return None
    
    # Primeira janela
    soma_atual = sum(array[:k])
    soma_maxima = soma_atual
    
    # Desliza a janela
    for i in range(k, len(array)):
        soma_atual = soma_atual - array[i-k] + array[i]
        soma_maxima = max(soma_maxima, soma_atual)
    
    return soma_maxima
```

## Dicas de Implementação
1. Identifique se o problema pode usar janela fixa ou variável
2. Defina claramente as condições para expandir/encolher
3. Mantenha variáveis auxiliares para tracking
4. Atualize o resultado a cada modificação da janela
5. Considere casos de borda (arrays vazios, tamanho menor que k, etc)
