# Algoritmo de Dijkstra - Menor Caminho em Grafos Ponderados

O algoritmo de Dijkstra é um dos algoritmos mais importantes para encontrar o menor caminho entre vértices em um grafo ponderado com pesos não-negativos. Desenvolvido por Edsger Dijkstra em 1956, é amplamente usado em sistemas de navegação, roteamento de rede e muitas outras aplicações.

## O que é o Algoritmo de Dijkstra?

Dijkstra resolve o problema do **menor caminho de origem única**: dado um grafo ponderado e um vértice de origem, encontra o menor caminho (menor custo) da origem para todos os outros vértices.

**Características:**
- Funciona apenas com pesos **não-negativos**
- Usa uma estratégia **gulosa** (greedy)
- Complexidade: O((V + E) log V) com heap binário
- Garante o caminho ótimo

## Como Funciona o Algoritmo

### Intuição
Imagine que você está no centro de uma cidade e quer encontrar o caminho mais rápido para todos os outros pontos. Dijkstra funciona como "ondas" se espalhando da origem, sempre escolhendo o próximo local mais próximo que ainda não foi visitado.

### Passos do Algoritmo
1. **Inicialização**: Distância da origem = 0, todas as outras = ∞
2. **Escolha**: Seleciona o vértice não visitado com menor distância
3. **Relaxamento**: Atualiza distâncias dos vizinhos se encontrar caminho melhor
4. **Marca**: Marca o vértice como visitado
5. **Repetição**: Repete até visitar todos os vértices

## Implementação em Python

```python
import heapq
from collections import defaultdict

class GrafoDijkstra:
    def __init__(self):
        self.grafo = defaultdict(list)
    
    def adicionar_aresta(self, origem, destino, peso):
        self.grafo[origem].append((destino, peso))
    
    def dijkstra(self, inicio):
        """
        Encontra menor caminho da origem para todos os vértices
        """
        # Distâncias: início = 0, outros = infinito
        distancias = defaultdict(lambda: float('inf'))
        distancias[inicio] = 0
        
        # Predecessores para reconstruir caminho
        predecessores = {}
        
        # Heap de prioridade (distancia, vertice)
        heap = [(0, inicio)]
        visitados = set()
        
        while heap:
            dist_atual, vertice_atual = heapq.heappop(heap)
            
            # Se já visitado, pula
            if vertice_atual in visitados:
                continue
                
            visitados.add(vertice_atual)
            
            # Examina todos os vizinhos
            for vizinho, peso in self.grafo[vertice_atual]:
                if vizinho in visitados:
                    continue
                
                # Calcula nova distância
                nova_distancia = dist_atual + peso
                
                # Se encontrou caminho melhor
                if nova_distancia < distancias[vizinho]:
                    distancias[vizinho] = nova_distancia
                    predecessores[vizinho] = vertice_atual
                    heapq.heappush(heap, (nova_distancia, vizinho))
        
        return dict(distancias), predecessores
    
    def caminho_para(self, inicio, fim, predecessores):
        """
        Reconstrói o caminho da origem até o destino
        """
        if fim not in predecessores and fim != inicio:
            return None
        
        caminho = []
        atual = fim
        
        while atual is not None:
            caminho.append(atual)
            atual = predecessores.get(atual)
        
        return caminho[::-1]

# Exemplo de uso
def exemplo_dijkstra():
    g = GrafoDijkstra()
    
    # Construindo o grafo
    g.adicionar_aresta('A', 'B', 4)
    g.adicionar_aresta('A', 'C', 2)
    g.adicionar_aresta('B', 'D', 3)
    g.adicionar_aresta('B', 'E', 1)
    g.adicionar_aresta('C', 'B', 1)
    g.adicionar_aresta('C', 'D', 5)
    g.adicionar_aresta('D', 'E', 2)
    
    # Executando Dijkstra
    distancias, predecessores = g.dijkstra('A')
    
    print("Menores distâncias de A:")
    for vertice, distancia in sorted(distancias.items()):
        print(f"  A → {vertice}: {distancia}")
    
    # Mostrando caminhos
    for destino in ['B', 'C', 'D', 'E']:
        caminho = g.caminho_para('A', destino, predecessores)
        print(f"Caminho A → {destino}: {' → '.join(caminho)}")

# Saída:
# Menores distâncias de A:
#   A → A: 0
#   A → B: 3
#   A → C: 2
#   A → D: 6
#   A → E: 4
```

## Implementação em Go

```go
package main

import (
    "container/heap"
    "fmt"
    "math"
)

// Aresta representa uma conexão com peso
type Aresta struct {
    Destino string
    Peso    int
}

// Item para a fila de prioridade
type Item struct {
    Vertice   string
    Distancia int
    Index     int
}

// FilaPrioridade implementa heap.Interface
type FilaPrioridade []*Item

func (fp FilaPrioridade) Len() int { return len(fp) }

func (fp FilaPrioridade) Less(i, j int) bool {
    return fp[i].Distancia < fp[j].Distancia
}

func (fp FilaPrioridade) Swap(i, j int) {
    fp[i], fp[j] = fp[j], fp[i]
    fp[i].Index = i
    fp[j].Index = j
}

func (fp *FilaPrioridade) Push(x interface{}) {
    n := len(*fp)
    item := x.(*Item)
    item.Index = n
    *fp = append(*fp, item)
}

func (fp *FilaPrioridade) Pop() interface{} {
    old := *fp
    n := len(old)
    item := old[n-1]
    old[n-1] = nil
    item.Index = -1
    *fp = old[0 : n-1]
    return item
}

// Grafo representa um grafo ponderado
type Grafo struct {
    Vertices map[string][]Aresta
}

func NovoGrafo() *Grafo {
    return &Grafo{Vertices: make(map[string][]Aresta)}
}

func (g *Grafo) AdicionarAresta(origem, destino string, peso int) {
    g.Vertices[origem] = append(g.Vertices[origem], Aresta{destino, peso})
}

// Dijkstra encontra menores caminhos
func (g *Grafo) Dijkstra(inicio string) (map[string]int, map[string]string) {
    distancias := make(map[string]int)
    predecessores := make(map[string]string)
    visitados := make(map[string]bool)
    
    // Inicializa distâncias
    for vertice := range g.Vertices {
        distancias[vertice] = math.MaxInt32
    }
    distancias[inicio] = 0
    
    // Fila de prioridade
    fp := &FilaPrioridade{}
    heap.Init(fp)
    heap.Push(fp, &Item{Vertice: inicio, Distancia: 0})
    
    for fp.Len() > 0 {
        item := heap.Pop(fp).(*Item)
        verticeAtual := item.Vertice
        
        if visitados[verticeAtual] {
            continue
        }
        
        visitados[verticeAtual] = true
        
        // Examina vizinhos
        for _, aresta := range g.Vertices[verticeAtual] {
            vizinho := aresta.Destino
            
            if visitados[vizinho] {
                continue
            }
            
            novaDistancia := distancias[verticeAtual] + aresta.Peso
            
            if novaDistancia < distancias[vizinho] {
                distancias[vizinho] = novaDistancia
                predecessores[vizinho] = verticeAtual
                heap.Push(fp, &Item{Vertice: vizinho, Distancia: novaDistancia})
            }
        }
    }
    
    return distancias, predecessores
}

// CaminhoParaDijkstra reconstrói o caminho
func (g *Grafo) CaminhoParaDijkstra(inicio, fim string, predecessores map[string]string) []string {
    if _, existe := predecessores[fim]; !existe && fim != inicio {
        return nil
    }
    
    var caminho []string
    atual := fim
    
    for atual != "" {
        caminho = append([]string{atual}, caminho...)
        atual = predecessores[atual]
    }
    
    return caminho
}

func main() {
    g := NovoGrafo()
    
    // Construindo grafo
    g.AdicionarAresta("A", "B", 4)
    g.AdicionarAresta("A", "C", 2)
    g.AdicionarAresta("B", "D", 3)
    g.AdicionarAresta("B", "E", 1)
    g.AdicionarAresta("C", "B", 1)
    g.AdicionarAresta("C", "D", 5)
    g.AdicionarAresta("D", "E", 2)
    
    distancias, predecessores := g.Dijkstra("A")
    
    fmt.Println("Menores distâncias de A:")
    for vertice, distancia := range distancias {
        fmt.Printf("  A → %s: %d\n", vertice, distancia)
    }
    
    // Mostrando caminhos
    for _, destino := range []string{"B", "C", "D", "E"} {
        caminho := g.CaminhoParaDijkstra("A", destino, predecessores)
        fmt.Printf("Caminho A → %s: %v\n", destino, caminho)
    }
}
```

## Implementação em Java

```java
import java.util.*;

class Aresta {
    String destino;
    int peso;
    
    public Aresta(String destino, int peso) {
        this.destino = destino;
        this.peso = peso;
    }
}

class No implements Comparable<No> {
    String vertice;
    int distancia;
    
    public No(String vertice, int distancia) {
        this.vertice = vertice;
        this.distancia = distancia;
    }
    
    @Override
    public int compareTo(No outro) {
        return Integer.compare(this.distancia, outro.distancia);
    }
}

public class GrafoDijkstra {
    private Map<String, List<Aresta>> grafo;
    
    public GrafoDijkstra() {
        this.grafo = new HashMap<>();
    }
    
    public void adicionarAresta(String origem, String destino, int peso) {
        grafo.computeIfAbsent(origem, k -> new ArrayList<>())
              .add(new Aresta(destino, peso));
    }
    
    public Map<String, Integer> dijkstra(String inicio) {
        Map<String, Integer> distancias = new HashMap<>();
        Map<String, String> predecessores = new HashMap<>();
        Set<String> visitados = new HashSet<>();
        PriorityQueue<No> filaPrioridade = new PriorityQueue<>();
        
        // Inicializa distâncias
        for (String vertice : grafo.keySet()) {
            distancias.put(vertice, Integer.MAX_VALUE);
        }
        distancias.put(inicio, 0);
        
        filaPrioridade.offer(new No(inicio, 0));
        
        while (!filaPrioridade.isEmpty()) {
            No noAtual = filaPrioridade.poll();
            String verticeAtual = noAtual.vertice;
            
            if (visitados.contains(verticeAtual)) {
                continue;
            }
            
            visitados.add(verticeAtual);
            
            // Examina vizinhos
            List<Aresta> vizinhos = grafo.get(verticeAtual);
            if (vizinhos != null) {
                for (Aresta aresta : vizinhos) {
                    String vizinho = aresta.destino;
                    
                    if (visitados.contains(vizinho)) {
                        continue;
                    }
                    
                    int novaDistancia = distancias.get(verticeAtual) + aresta.peso;
                    
                    if (novaDistancia < distancias.get(vizinho)) {
                        distancias.put(vizinho, novaDistancia);
                        predecessores.put(vizinho, verticeAtual);
                        filaPrioridade.offer(new No(vizinho, novaDistancia));
                    }
                }
            }
        }
        
        return distancias;
    }
    
    public List<String> caminhoParaDijkstra(String inicio, String fim, 
                                           Map<String, String> predecessores) {
        if (!predecessores.containsKey(fim) && !fim.equals(inicio)) {
            return null;
        }
        
        List<String> caminho = new ArrayList<>();
        String atual = fim;
        
        while (atual != null) {
            caminho.add(0, atual);
            atual = predecessores.get(atual);
        }
        
        return caminho;
    }
    
    public static void main(String[] args) {
        GrafoDijkstra g = new GrafoDijkstra();
        
        // Construindo grafo
        g.adicionarAresta("A", "B", 4);
        g.adicionarAresta("A", "C", 2);
        g.adicionarAresta("B", "D", 3);
        g.adicionarAresta("B", "E", 1);
        g.adicionarAresta("C", "B", 1);
        g.adicionarAresta("C", "D", 5);
        g.adicionarAresta("D", "E", 2);
        
        Map<String, Integer> distancias = g.dijkstra("A");
        
        System.out.println("Menores distâncias de A:");
        distancias.entrySet().stream()
                  .sorted(Map.Entry.comparingByKey())
                  .forEach(entry -> 
                      System.out.printf("  A → %s: %d%n", 
                                      entry.getKey(), entry.getValue()));
    }
}
```

## Visualização do Algoritmo

```
Grafo exemplo:
    A ----4---- B
    |         / |
    2       1   3
    |     /     |
    C ---5----- D ----2---- E

Execução passo a passo:
1. Início: dist[A]=0, todas outras=∞
2. Visita A: atualiza C(2), B(4)
3. Visita C: atualiza B(3) - melhor que 4
4. Visita B: atualiza E(4), D(6)
5. Visita E: atualiza D(6) - não melhora
6. Visita D: fim

Resultado:
A→A: 0  A→C: 2  A→B: 3  A→E: 4  A→D: 6
```

## Aplicações Práticas

### Sistema de Navegação GPS
```python
class GPSNavegacao:
    def __init__(self):
        self.mapa = GrafoDijkstra()
    
    def adicionar_estrada(self, cidade1, cidade2, distancia):
        # Estradas são bidirecionais
        self.mapa.adicionar_aresta(cidade1, cidade2, distancia)
        self.mapa.adicionar_aresta(cidade2, cidade1, distancia)
    
    def rota_mais_rapida(self, origem, destino):
        distancias, predecessores = self.mapa.dijkstra(origem)
        
        if destino not in distancias:
            return None, float('inf')
        
        caminho = self.mapa.caminho_para(origem, destino, predecessores)
        distancia_total = distancias[destino]
        
        return caminho, distancia_total

# Uso
gps = GPSNavegacao()
gps.adicionar_estrada("São Paulo", "Rio de Janeiro", 430)
gps.adicionar_estrada("São Paulo", "Belo Horizonte", 586)
gps.adicionar_estrada("Rio de Janeiro", "Belo Horizonte", 434)

caminho, distancia = gps.rota_mais_rapida("São Paulo", "Rio de Janeiro")
print(f"Menor rota: {' → '.join(caminho)} ({distancia} km)")
```

### Roteamento de Rede
```python
class RoteadorRede:
    def __init__(self):
        self.topologia = GrafoDijkstra()
    
    def calcular_tabela_roteamento(self, roteador_local):
        distancias, predecessores = self.topologia.dijkstra(roteador_local)
        
        tabela = {}
        for destino in distancias:
            if destino != roteador_local:
                caminho = self.topologia.caminho_para(
                    roteador_local, destino, predecessores
                )
                if len(caminho) > 1:
                    proximo_salto = caminho[1]
                    tabela[destino] = proximo_salto
        
        return tabela
```

## Análise de Complexidade

| Implementação | Complexidade Temporal | Complexidade Espacial |
|---------------|----------------------|----------------------|
| **Array linear** | O(V²) | O(V) |
| **Heap binário** | O((V + E) log V) | O(V) |
| **Heap Fibonacci** | O(E + V log V) | O(V) |

### Quando Usar Cada Implementação
- **Array linear**: Grafos densos (E ≈ V²)
- **Heap binário**: Casos gerais, boa balance
- **Heap Fibonacci**: Grafos muito esparsos (E << V²)

## Variações do Algoritmo

### Dijkstra com Parada Antecipada
```python
def dijkstra_ate_destino(grafo, inicio, destino):
    """Para quando encontra o destino"""
    # ... implementação similar ...
    
    while heap:
        dist_atual, vertice_atual = heapq.heappop(heap)
        
        # Parada antecipada
        if vertice_atual == destino:
            return dist_atual, predecessores
        
        # ... resto da implementação ...
```

### Dijkstra Bidirecional
```python
def dijkstra_bidirecional(grafo, inicio, fim):
    """Busca simultânea de ambos os lados"""
    # Implementação mais complexa que pode ser mais eficiente
    # para caminhos longos em grafos grandes
    pass
```

## Limitações e Alternativas

### Limitações do Dijkstra
- **Apenas pesos não-negativos**
- **Não funciona com ciclos negativos**
- **Pode ser lento em grafos muito grandes**

### Alternativas
- **Bellman-Ford**: Suporta pesos negativos, O(VE)
- **A\***: Usa heurística para ser mais rápido
- **Floyd-Warshall**: Todos os pares de caminhos, O(V³)

## Otimizações Práticas

### Pré-processamento
```python
class DijkstraOtimizado:
    def __init__(self):
        self.grafo = GrafoDijkstra()
        self.cache_distancias = {}
    
    def dijkstra_com_cache(self, inicio):
        if inicio in self.cache_distancias:
            return self.cache_distancias[inicio]
        
        resultado = self.grafo.dijkstra(inicio)
        self.cache_distancias[inicio] = resultado
        return resultado
```

### Paralelização
```python
from concurrent.futures import ThreadPoolExecutor

def dijkstra_paralelo(grafo, origens):
    """Calcula Dijkstra para múltiplas origens em paralelo"""
    with ThreadPoolExecutor() as executor:
        futuros = {
            executor.submit(grafo.dijkstra, origem): origem 
            for origem in origens
        }
        
        resultados = {}
        for futuro in futuros:
            origem = futuros[futuro]
            resultados[origem] = futuro.result()
        
        return resultados
```

## Próximos Passos

- Estude algoritmo A* para busca heurística
- Aprenda Bellman-Ford para grafos com pesos negativos
- Explore algoritmos de fluxo máximo
- Investigue algoritmos approximados para problemas NP-difíceis

## Recursos Adicionais

- [Dijkstra Visualization](https://www.cs.usfca.edu/~galles/visualization/Dijkstra.html)
- [Graph Algorithms - Sedgewick](https://algs4.cs.princeton.edu/44sp/)
- [Introduction to Algorithms - CLRS](https://mitpress.mit.edu/books/introduction-algorithms)

*Dijkstra é fundamental para problemas de otimização em grafos. Domine-o e você terá uma ferramenta poderosa para resolver problemas de caminho mínimo!* 🛣️
