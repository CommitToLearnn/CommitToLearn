# Filas - Estrutura de Dados FIFO

A fila é uma estrutura de dados linear que segue o princípio FIFO (First In, First Out) - o primeiro elemento a entrar é o primeiro a sair, como uma fila de banco ou supermercado.

## O que é uma Fila?

Uma fila é uma coleção ordenada de elementos onde:
- **Inserções** acontecem no final (rear/back)
- **Remoções** acontecem no início (front)
- Acesso aos elementos é restrito às extremidades

É como uma fila na vida real: quem chega primeiro é atendido primeiro!

## Operações Fundamentais

### Operações Básicas
- **Enqueue (Enfileirar)**: Adiciona elemento no final
- **Dequeue (Desenfileirar)**: Remove elemento do início
- **Front/Peek**: Visualiza o primeiro elemento sem removê-lo
- **IsEmpty**: Verifica se a fila está vazia
- **Size**: Retorna o número de elementos

### Operações Auxiliares
- **Rear**: Visualiza o último elemento
- **Clear**: Remove todos os elementos
- **Display**: Mostra todos os elementos

## Visualização da Fila

```
Enqueue →  [  ] [  ] [  ] [  ]  → Dequeue
          rear              front
           ↑                  ↓
      Novos elementos    Elementos saem
```

## Implementação com Lista Python

```python
class Fila:
    def __init__(self):
        self.itens = []
    
    def enqueue(self, item):
        """Adiciona item no final da fila"""
        self.itens.append(item)
    
    def dequeue(self):
        """Remove e retorna o primeiro item"""
        if self.is_empty():
            raise IndexError("Fila vazia")
        return self.itens.pop(0)
    
    def front(self):
        """Retorna o primeiro item sem removê-lo"""
        if self.is_empty():
            raise IndexError("Fila vazia")
        return self.itens[0]
    
    def rear(self):
        """Retorna o último item"""
        if self.is_empty():
            raise IndexError("Fila vazia")
        return self.itens[-1]
    
    def is_empty(self):
        """Verifica se a fila está vazia"""
        return len(self.itens) == 0
    
    def size(self):
        """Retorna o tamanho da fila"""
        return len(self.itens)
    
    def display(self):
        """Mostra todos os elementos"""
        return self.itens.copy()

# Exemplo de uso
fila = Fila()
fila.enqueue("A")
fila.enqueue("B")
fila.enqueue("C")

print("Fila:", fila.display())  # ['A', 'B', 'C']
print("Front:", fila.front())   # A
print("Rear:", fila.rear())     # C
print("Dequeue:", fila.dequeue())  # A
print("Nova fila:", fila.display())  # ['B', 'C']
```

## Implementação Otimizada com Deque

```python
from collections import deque

class FilaOtimizada:
    def __init__(self):
        self.itens = deque()
    
    def enqueue(self, item):
        """O(1) - Adiciona no final"""
        self.itens.append(item)
    
    def dequeue(self):
        """O(1) - Remove do início"""
        if self.is_empty():
            raise IndexError("Fila vazia")
        return self.itens.popleft()
    
    def front(self):
        """O(1) - Primeiro elemento"""
        if self.is_empty():
            raise IndexError("Fila vazia")
        return self.itens[0]
    
    def rear(self):
        """O(1) - Último elemento"""
        if self.is_empty():
            raise IndexError("Fila vazia")
        return self.itens[-1]
    
    def is_empty(self):
        return len(self.itens) == 0
    
    def size(self):
        return len(self.itens)
    
    def display(self):
        return list(self.itens)
```

## Fila Circular

```python
class FilaCircular:
    def __init__(self, capacidade):
        self.capacidade = capacidade
        self.itens = [None] * capacidade
        self.front = 0
        self.rear = 0
        self.tamanho = 0
    
    def enqueue(self, item):
        if self.is_full():
            raise OverflowError("Fila cheia")
        
        self.itens[self.rear] = item
        self.rear = (self.rear + 1) % self.capacidade
        self.tamanho += 1
    
    def dequeue(self):
        if self.is_empty():
            raise IndexError("Fila vazia")
        
        item = self.itens[self.front]
        self.itens[self.front] = None
        self.front = (self.front + 1) % self.capacidade
        self.tamanho -= 1
        return item
    
    def is_empty(self):
        return self.tamanho == 0
    
    def is_full(self):
        return self.tamanho == self.capacidade
    
    def display(self):
        if self.is_empty():
            return []
        
        resultado = []
        i = self.front
        for _ in range(self.tamanho):
            resultado.append(self.itens[i])
            i = (i + 1) % self.capacidade
        return resultado

# Exemplo
fila_circular = FilaCircular(3)
fila_circular.enqueue("X")
fila_circular.enqueue("Y")
fila_circular.enqueue("Z")
print("Fila circular:", fila_circular.display())  # ['X', 'Y', 'Z']
```

## Aplicações Práticas

### Sistema de Atendimento
```python
class SistemaAtendimento:
    def __init__(self):
        self.fila_normal = Fila()
        self.fila_prioritaria = Fila()
    
    def adicionar_cliente(self, cliente, prioritario=False):
        if prioritario:
            self.fila_prioritaria.enqueue(cliente)
        else:
            self.fila_normal.enqueue(cliente)
    
    def atender_proximo(self):
        if not self.fila_prioritaria.is_empty():
            return self.fila_prioritaria.dequeue()
        elif not self.fila_normal.is_empty():
            return self.fila_normal.dequeue()
        else:
            return None
    
    def status_filas(self):
        return {
            'prioritaria': self.fila_prioritaria.size(),
            'normal': self.fila_normal.size()
        }

# Exemplo de uso
atendimento = SistemaAtendimento()
atendimento.adicionar_cliente("João")
atendimento.adicionar_cliente("Maria", prioritario=True)
atendimento.adicionar_cliente("Pedro")

print("Próximo:", atendimento.atender_proximo())  # Maria
print("Status:", atendimento.status_filas())      # {'prioritaria': 0, 'normal': 2}
```

### Buffer de Impressão
```python
class BufferImpressao:
    def __init__(self, capacidade_maxima=10):
        self.fila = FilaCircular(capacidade_maxima)
        self.imprimindo = False
    
    def adicionar_documento(self, documento):
        try:
            self.fila.enqueue(documento)
            print(f"Documento '{documento}' adicionado à fila")
        except OverflowError:
            print("Buffer cheio! Aguarde...")
    
    def processar_impressao(self):
        if not self.fila.is_empty() and not self.imprimindo:
            self.imprimindo = True
            documento = self.fila.dequeue()
            print(f"Imprimindo: {documento}")
            # Simula tempo de impressão
            self.imprimindo = False
            return documento
        return None
    
    def status(self):
        return {
            'fila': self.fila.display(),
            'imprimindo': self.imprimindo
        }
```

### BFS em Grafos
```python
def bfs_com_fila(grafo, inicio):
    """
    Busca em largura usando fila
    """
    visitados = set()
    fila = Fila()
    
    fila.enqueue(inicio)
    visitados.add(inicio)
    resultado = []
    
    while not fila.is_empty():
        vertice = fila.dequeue()
        resultado.append(vertice)
        
        for vizinho in grafo.get(vertice, []):
            if vizinho not in visitados:
                fila.enqueue(vizinho)
                visitados.add(vizinho)
    
    return resultado

# Exemplo
grafo = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [],
    'E': ['F'],
    'F': []
}

print("BFS:", bfs_com_fila(grafo, 'A'))  # ['A', 'B', 'C', 'D', 'E', 'F']
```

## Simulação de Processos

```python
class ProcessoSO:
    def __init__(self, id_processo, tempo_cpu):
        self.id = id_processo
        self.tempo_cpu = tempo_cpu
        self.tempo_espera = 0
    
    def __str__(self):
        return f"P{self.id}(CPU:{self.tempo_cpu})"

class EscalonadorFCFS:
    """First Come First Served - Escalonador FIFO"""
    
    def __init__(self):
        self.fila_prontos = Fila()
        self.tempo_atual = 0
    
    def adicionar_processo(self, processo):
        self.fila_prontos.enqueue(processo)
        print(f"Processo {processo} adicionado")
    
    def executar_processos(self):
        while not self.fila_prontos.is_empty():
            processo = self.fila_prontos.dequeue()
            
            processo.tempo_espera = self.tempo_atual
            print(f"Executando {processo} (Espera: {processo.tempo_espera})")
            
            self.tempo_atual += processo.tempo_cpu
            print(f"Processo {processo} concluído no tempo {self.tempo_atual}")

# Exemplo
escalonador = EscalonadorFCFS()
escalonador.adicionar_processo(ProcessoSO(1, 5))
escalonador.adicionar_processo(ProcessoSO(2, 3))
escalonador.adicionar_processo(ProcessoSO(3, 8))
escalonador.executar_processos()
```

## Análise de Complexidade

### Implementação com Lista
| Operação | Complexidade |
|----------|--------------|
| Enqueue | O(1) |
| Dequeue | O(n) |
| Front | O(1) |
| Rear | O(1) |
| Size | O(1) |

### Implementação com Deque
| Operação | Complexidade |
|----------|--------------|
| Enqueue | O(1) |
| Dequeue | O(1) |
| Front | O(1) |
| Rear | O(1) |
| Size | O(1) |

## Fila vs Pilha

| Característica | Fila (FIFO) | Pilha (LIFO) |
|---------------|-------------|--------------|
| **Princípio** | Primeiro a entrar, primeiro a sair | Último a entrar, primeiro a sair |
| **Inserção** | Final (rear) | Topo |
| **Remoção** | Início (front) | Topo |
| **Uso típico** | BFS, Processos | DFS, Expressões |
| **Analogia** | Fila de banco | Pilha de pratos |

## Tipos Especiais de Filas

### Fila de Prioridade
```python
import heapq

class FilaPrioridade:
    def __init__(self):
        self.heap = []
    
    def enqueue(self, item, prioridade):
        heapq.heappush(self.heap, (prioridade, item))
    
    def dequeue(self):
        if self.is_empty():
            raise IndexError("Fila vazia")
        return heapq.heappop(self.heap)[1]
    
    def is_empty(self):
        return len(self.heap) == 0

# Exemplo
fila_prioridade = FilaPrioridade()
fila_prioridade.enqueue("Tarefa Normal", 3)
fila_prioridade.enqueue("Tarefa Urgente", 1)
fila_prioridade.enqueue("Tarefa Baixa", 5)

print(fila_prioridade.dequeue())  # Tarefa Urgente
```

### Deque (Double-ended Queue)
```python
from collections import deque

# Deque permite inserção/remoção em ambas as extremidades
dq = deque()
dq.append("direita")      # Adiciona à direita
dq.appendleft("esquerda") # Adiciona à esquerda
print(dq)  # deque(['esquerda', 'direita'])

print(dq.pop())      # Remove da direita
print(dq.popleft())  # Remove da esquerda
```

## Dicas e Boas Práticas

### Quando Usar Filas
- Processamento sequencial (FIFO)
- Algoritmos de busca (BFS)
- Sistemas de atendimento
- Buffers de comunicação
- Escalonamento de processos

### Otimizações
- Use `collections.deque` para performance
- Implemente fila circular para capacidade fixa
- Considere fila de prioridade quando necessário
- Use thread-safe queues para programação concorrente

### Armadilhas Comuns
- Usar `pop(0)` em listas (O(n))
- Não verificar se a fila está vazia
- Confundir FIFO com LIFO
- Não considerar overflow em filas de capacidade fixa

## Exercícios para Praticar

**Básico**: Implemente uma fila que suporte operação de peek no rear
**Intermediário**: Crie uma fila que mantenha histórico de operações
**Avançado**: Implemente uma fila thread-safe usando locks
**Desafio**: Crie um sistema de fila com múltiplas prioridades

## Aplicações Avançadas

### Cache LRU usando Fila
```python
class LRUCache:
    def __init__(self, capacidade):
        self.capacidade = capacidade
        self.cache = {}
        self.fila = deque()
    
    def get(self, chave):
        if chave in self.cache:
            # Move para o final (mais recentemente usado)
            self.fila.remove(chave)
            self.fila.append(chave)
            return self.cache[chave]
        return None
    
    def put(self, chave, valor):
        if chave in self.cache:
            self.fila.remove(chave)
        elif len(self.cache) >= self.capacidade:
            # Remove o menos recentemente usado
            lru_key = self.fila.popleft()
            del self.cache[lru_key]
        
        self.cache[chave] = valor
        self.fila.append(chave)
```

### Rate Limiting com Sliding Window
```python
from time import time

class RateLimiter:
    def __init__(self, limite_requisicoes, janela_tempo):
        self.limite = limite_requisicoes
        self.janela = janela_tempo
        self.requisicoes = deque()
    
    def permitir_requisicao(self):
        agora = time()
        
        # Remove requisições antigas
        while self.requisicoes and self.requisicoes[0] < agora - self.janela:
            self.requisicoes.popleft()
        
        if len(self.requisicoes) < self.limite:
            self.requisicoes.append(agora)
            return True
        return False
```

## Próximos Passos

- Estude filas de prioridade e heaps
- Aprenda sobre filas thread-safe
- Explore algoritmos que usam filas (BFS, Dijkstra)
- Investigue padrões de design com filas (Producer-Consumer)

## Recursos Adicionais

- [Queue Visualization](https://www.cs.usfca.edu/~galles/visualization/QueueArray.html)
- [Python Collections - Deque](https://docs.python.org/3/library/collections.html#collections.deque)
- [Queue Applications](https://www.geeksforgeeks.org/applications-of-queue-data-structure/)

*As filas são fundamentais para organizar o processamento sequencial. Domine-as e você terá uma ferramenta essencial para muitos algoritmos e sistemas!*
