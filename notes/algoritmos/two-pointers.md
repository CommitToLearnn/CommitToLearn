# Two Pointers

Two Pointers (Dois Ponteiros) é uma técnica que utiliza dois ponteiros que percorrem uma estrutura de dados, geralmente um array, para resolver problemas de forma eficiente.

## Conceito Básico
- Usa dois ponteiros que se movem através dos dados
- Geralmente os ponteiros começam em posições diferentes
- Move os ponteiros baseado em alguma condição do problema

## Padrões Comuns
1. **Ponteiros nas Extremidades**
   - Um ponteiro no início e outro no fim
   - Movem-se em direção ao centro
   - Exemplo: busca de soma de dois números em array ordenado

2. **Ponteiros na Mesma Direção**
   - Ambos movem-se da esquerda para direita
   - Diferentes velocidades
   - Exemplo: remoção de elementos duplicados

## Casos de Uso
- Encontrar par de elementos que somam um valor específico
- Verificar palindromos
- Reverter arrays
- Encontrar o elemento do meio em uma lista ligada
- Detectar ciclos em listas ligadas

## Complexidade
- Tempo: O(n) na maioria dos casos
- Espaço: O(1) - usa apenas espaço constante extra

## Exemplo de Problema
```python
def encontrarSoma(array, alvo):
    esquerda = 0
    direita = len(array) - 1
    
    while esquerda < direita:
        soma = array[esquerda] + array[direita]
        if soma == alvo:
            return [esquerda, direita]
        elif soma < alvo:
            esquerda += 1
        else:
            direita -= 1
    return []
```
