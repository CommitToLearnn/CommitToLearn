# BFS - Busca em Largura (Breadth-First Search)

A Busca em Largura é um algoritmo fundamental para explorar grafos e árvores, visitando todos os vértices em "níveis" - primeiro os mais próximos, depois os mais distantes.

## O que é BFS?

BFS é um algoritmo de busca que:
- Explora todos os vizinhos de um vértice antes de avançar
- Usa uma **fila** para controlar a ordem de visita
- Garante encontrar o **menor caminho** em grafos não-ponderados
- Visita vértices em ordem de distância da origem

## Como Funciona

Imagine que você está em um labirinto e quer mapear todas as salas. Com BFS, você:
- Marca sua sala atual
- Visita todas as salas adjacentes
- Depois visita as salas adjacentes a essas
- Continua até explorar tudo

## Algoritmo Passo a Passo

```
1. Coloque o vértice inicial na fila
2. Marque-o como visitado
3. Enquanto a fila não estiver vazia:
   a. Remova o primeiro vértice da fila
   b. Processe esse vértice
   c. Para cada vizinho não visitado:
      - Marque como visitado
      - Adicione na fila
```

## Implementação Básica

```python
from collections import deque

def bfs(grafo, inicio):
    """
    Busca em Largura básica
    """
    visitados = set()
    fila = deque([inicio])
    visitados.add(inicio)
    resultado = []
    
    while fila:
        vertice = fila.popleft()
        resultado.append(vertice)
        
        # Visita todos os vizinhos
        for vizinho in grafo[vertice]:
            if vizinho not in visitados:
                visitados.add(vizinho)
                fila.append(vizinho)
    
    return resultado

# Exemplo de uso
grafo = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print("BFS a partir de A:", bfs(grafo, 'A'))
# Saída: ['A', 'B', 'C', 'D', 'E', 'F']
```

## Encontrando o Menor Caminho

```python
def bfs_menor_caminho(grafo, inicio, fim):
    """
    Encontra o menor caminho entre dois vértices
    """
    if inicio == fim:
        return [inicio]
    
    visitados = set()
    fila = deque([(inicio, [inicio])])
    visitados.add(inicio)
    
    while fila:
        vertice, caminho = fila.popleft()
        
        for vizinho in grafo[vertice]:
            if vizinho == fim:
                return caminho + [vizinho]
            
            if vizinho not in visitados:
                visitados.add(vizinho)
                fila.append((vizinho, caminho + [vizinho]))
    
    return None  # Caminho não encontrado

# Exemplo
caminho = bfs_menor_caminho(grafo, 'A', 'F')
print("Menor caminho de A para F:", caminho)
# Saída: ['A', 'C', 'F']
```

## BFS em Árvores

```python
class No:
    def __init__(self, valor):
        self.valor = valor
        self.esquerda = None
        self.direita = None

def bfs_arvore(raiz):
    """
    BFS em árvore binária - percurso por nível
    """
    if not raiz:
        return []
    
    resultado = []
    fila = deque([raiz])
    
    while fila:
        no = fila.popleft()
        resultado.append(no.valor)
        
        if no.esquerda:
            fila.append(no.esquerda)
        if no.direita:
            fila.append(no.direita)
    
    return resultado

# Exemplo de uso
#       1
#      / \
#     2   3
#    / \
#   4   5

raiz = No(1)
raiz.esquerda = No(2)
raiz.direita = No(3)
raiz.esquerda.esquerda = No(4)
raiz.esquerda.direita = No(5)

print("BFS na árvore:", bfs_arvore(raiz))
# Saída: [1, 2, 3, 4, 5]
```

## Detectando Componentes Conectados

```python
def componentes_conectados(grafo):
    """
    Encontra todos os componentes conectados
    """
    visitados = set()
    componentes = []
    
    for vertice in grafo:
        if vertice not in visitados:
            componente = []
            fila = deque([vertice])
            visitados.add(vertice)
            
            while fila:
                v = fila.popleft()
                componente.append(v)
                
                for vizinho in grafo[v]:
                    if vizinho not in visitados:
                        visitados.add(vizinho)
                        fila.append(vizinho)
            
            componentes.append(componente)
    
    return componentes

# Grafo com componentes desconectados
grafo_desconectado = {
    'A': ['B'], 'B': ['A'],
    'C': ['D'], 'D': ['C'],
    'E': []
}

print("Componentes:", componentes_conectados(grafo_desconectado))
# Saída: [['A', 'B'], ['C', 'D'], ['E']]
```

## Aplicação: Jogo dos 15

```python
def resolver_jogo_15(estado_inicial, estado_final):
    """
    Resolve o jogo dos 15 usando BFS
    """
    if estado_inicial == estado_final:
        return [estado_inicial]
    
    visitados = set()
    fila = deque([(estado_inicial, [estado_inicial])])
    visitados.add(tuple(map(tuple, estado_inicial)))
    
    while fila:
        estado, caminho = fila.popleft()
        
        for proximo_estado in obter_movimentos_validos(estado):
            estado_tuple = tuple(map(tuple, proximo_estado))
            
            if proximo_estado == estado_final:
                return caminho + [proximo_estado]
            
            if estado_tuple not in visitados:
                visitados.add(estado_tuple)
                fila.append((proximo_estado, caminho + [proximo_estado]))
    
    return None

def obter_movimentos_validos(estado):
    """
    Gera todos os movimentos válidos a partir do estado atual
    """
    movimentos = []
    # Encontra a posição do espaço vazio (0)
    for i in range(len(estado)):
        for j in range(len(estado[i])):
            if estado[i][j] == 0:
                # Gera movimentos possíveis
                for di, dj in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < len(estado) and 0 <= nj < len(estado[0]):
                        novo_estado = [row[:] for row in estado]
                        novo_estado[i][j], novo_estado[ni][nj] = novo_estado[ni][nj], novo_estado[i][j]
                        movimentos.append(novo_estado)
    return movimentos
```

## Análise de Complexidade

| Aspecto | Complexidade |
|---------|--------------|
| **Tempo** | O(V + E) |
| **Espaço** | O(V) |
| **Pior caso** | Visita todos os vértices |
| **Melhor caso** | Objetivo encontrado cedo |

Onde:
- V = número de vértices
- E = número de arestas

## BFS vs DFS

| Característica | BFS | DFS |
|---------------|-----|-----|
| **Estrutura** | Fila | Pilha |
| **Memória** | Mais memória | Menos memória |
| **Menor caminho** | ✅ Garante | ❌ Não garante |
| **Implementação** | Iterativa | Recursiva/Iterativa |
| **Uso típico** | Menor caminho | Detectar ciclos |

## Aplicações Práticas

### Redes Sociais
```python
def grau_separacao(grafo, pessoa1, pessoa2):
    """
    Encontra o grau de separação entre duas pessoas
    """
    caminho = bfs_menor_caminho(grafo, pessoa1, pessoa2)
    return len(caminho) - 1 if caminho else -1
```

### Jogos
- Resolver quebra-cabeças
- Encontrar saída em labirintos
- IA para jogos de tabuleiro

### Roteamento de Rede
- Encontrar menor número de saltos
- Protocolos de roteamento
- Análise de conectividade

### Análise de Dependências
```python
def ordem_instalacao(dependencias):
    """
    Determina ordem de instalação de pacotes
    """
    # Usar BFS para ordenação topológica
    pass
```

## Dicas e Otimizações

### Boas Práticas
- Use `deque` para performance da fila
- Marque vértices como visitados ao adicioná-los na fila
- Considere usar bidirectional BFS para caminhos longos
- Implemente early termination quando possível

### Otimizações
```python
def bfs_bidirecional(grafo, inicio, fim):
    """
    BFS bidirecional - mais eficiente para caminhos longos
    """
    if inicio == fim:
        return [inicio]
    
    fila1 = deque([inicio])
    fila2 = deque([fim])
    visitados1 = {inicio}
    visitados2 = {fim}
    
    while fila1 and fila2:
        # Expande a menor fila
        if len(fila1) <= len(fila2):
            if expandir_fila(grafo, fila1, visitados1, visitados2):
                return reconstruir_caminho(...)
        else:
            if expandir_fila(grafo, fila2, visitados2, visitados1):
                return reconstruir_caminho(...)
    
    return None
```

### Armadilhas Comuns
- Não marcar vértices como visitados cedo
- Usar lista em vez de deque (performance)
- Não considerar grafos desconectados
- Confundir BFS com DFS em implementações recursivas

## Exercícios para Praticar

**Básico**: Implemente BFS que retorna apenas vértices alcançáveis
**Intermediário**: Encontre o diâmetro de um grafo (maior distância entre dois vértices)
**Avançado**: Implemente BFS que encontra todos os caminhos mais curtos
**Desafio**: Resolva o problema do cavalo no tabuleiro de xadrez

## Próximos Passos

- Estude algoritmos de caminho mínimo com pesos (Dijkstra)
- Aprenda sobre BFS em grafos direcionados
- Explore A* (A estrela) para busca heurística
- Investigue algoritmos de fluxo máximo

## Recursos Adicionais

- [BFS Visualização](https://www.cs.usfca.edu/~galles/visualization/BFS.html)
- [Algoritmos de Grafos - Sedgewick](https://algs4.cs.princeton.edu/41graph/)
- [GeeksforGeeks BFS](https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/)

*BFS é sua ferramenta para explorar o mundo camada por camada. Domine-a e você terá um dos algoritmos mais úteis da computação!*
