### Análise de Casos: Médio vs Pior Caso em Algoritmos

**O que são Casos de Análise?**

A **análise de casos** é fundamental para entender o comportamento de algoritmos em diferentes cenários. Ela nos ajuda a prever como um algoritmo se comportará com dados do mundo real.

**Analogia:** Imagine que você está dirigindo para o trabalho. O melhor caso seria pegar todos os semáforos verdes, o pior caso seria pegar todos vermelhos, e o caso médio seria uma mistura realista de ambos.

### Tipos de Casos de Análise

| Tipo de Caso | Descrição | Quando Ocorre | Importância |
|--------------|-----------|---------------|-------------|
| **Melhor Caso** | Cenário mais favorável | Dados idealmente organizados |  Limite inferior |
| **Caso Médio** | Comportamento típico esperado | Dados aleatórios/reais |  **Mais realista** |
| **Pior Caso** | Cenário mais desfavorável | Dados organizados adversamente |  **Limite superior** |

### Por que o Caso Médio é Crucial?

O **caso médio** representa o que você pode esperar na prática com dados reais, não idealizados.

```python
import random
import time

def medir_performance_busca_linear(tamanho_lista, tentativas=1000):
    resultados = {
        'melhor_caso': float('inf'),
        'pior_caso': 0,
        'tempos_medios': []
    }
    
    for _ in range(tentativas):
        # Criar lista de teste
        lista = list(range(tamanho_lista))
        elemento = random.randint(0, tamanho_lista - 1)
        
        # Medir tempo
        inicio = time.time()
        busca_linear(lista, elemento)
        tempo = time.time() - inicio
        
        # Registrar resultados
        resultados['melhor_caso'] = min(resultados['melhor_caso'], tempo)
        resultados['pior_caso'] = max(resultados['pior_caso'], tempo)
        resultados['tempos_medios'].append(tempo)
    
    # Calcular média
    tempo_medio = sum(resultados['tempos_medios']) / len(resultados['tempos_medios'])
    
    return {
        'melhor': resultados['melhor_caso'],
        'medio': tempo_medio,
        'pior': resultados['pior_caso']
    }

def busca_linear(lista, item):
    for i, elemento in enumerate(lista):
        if elemento == item:
            return i
    return -1
```

### Exemplos Práticos de Análise

#### Busca Linear

```python
def busca_linear_analise(lista, item):
    """
    Melhor caso: O(1) - elemento está na primeira posição
    Caso médio: O(n/2) ≈ O(n) - elemento está no meio
    Pior caso: O(n) - elemento está no final ou não existe
    """
    comparacoes = 0
    
    for i, elemento in enumerate(lista):
        comparacoes += 1
        if elemento == item:
            print(f"Encontrado em {comparacoes} comparações (posição {i})")
            return i
    
    print(f"Não encontrado após {comparacoes} comparações")
    return -1

# Demonstração
lista = [1, 3, 5, 7, 9, 11, 13, 15]

print("=== ANÁLISE DE CASOS - BUSCA LINEAR ===")
print("Melhor caso (primeiro elemento):")
busca_linear_analise(lista, 1)

print("\nCaso médio (elemento no meio):")
busca_linear_analise(lista, 9)

print("\nPior caso (elemento inexistente):")
busca_linear_analise(lista, 20)
```

#### QuickSort - Caso Clássico

```python
def quicksort_com_contador(arr, contador_comparacoes=[0]):
    """QuickSort com contador de comparações para análise"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    esquerda, meio, direita = [], [], []
    
    for elemento in arr:
        contador_comparacoes[0] += 1
        if elemento < pivot:
            esquerda.append(elemento)
        elif elemento == pivot:
            meio.append(elemento)
        else:
            direita.append(elemento)
    
    return (quicksort_com_contador(esquerda, contador_comparacoes) + 
            meio + 
            quicksort_com_contador(direita, contador_comparacoes))

def demonstrar_casos_quicksort():
    print("=== ANÁLISE QUICKSORT ===")
    
    # Melhor caso: lista aleatória balanceada
    import random
    melhor_caso = [random.randint(1, 100) for _ in range(16)]
    contador = [0]
    quicksort_com_contador(melhor_caso.copy(), contador)
    print(f"Caso médio/melhor - Comparações: {contador[0]}")
    
    # Pior caso: lista já ordenada
    pior_caso = list(range(16))
    contador = [0]
    quicksort_com_contador(pior_caso.copy(), contador)
    print(f"Pior caso (ordenada) - Comparações: {contador[0]}")
    
    # Análise teórica
    n = 16
    print(f"\nAnálise teórica para n={n}:")
    print(f"Melhor caso: O(n log n) ≈ {n * 4:.0f} comparações")
    print(f"Pior caso: O(n²) ≈ {n * n:.0f} comparações")

demonstrar_casos_quicksort()
```

### Hash Tables - Análise Realista

```python
class HashTableAnalise:
    def __init__(self, tamanho=10):
        self.tamanho = tamanho
        self.tabela = [[] for _ in range(tamanho)]
        self.colisoes = 0
        self.operacoes = 0
    
    def hash_function(self, chave):
        return hash(chave) % self.tamanho
    
    def inserir(self, chave, valor):
        self.operacoes += 1
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        # Contar colisões
        if bucket:
            self.colisoes += 1
        
        # Verificar se chave já existe
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                bucket[i] = (chave, valor)
                return
        
        bucket.append((chave, valor))
    
    def buscar(self, chave):
        self.operacoes += 1
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        for k, v in bucket:
            if k == chave:
                return v
        return None
    
    def estatisticas(self):
        elementos_total = sum(len(bucket) for bucket in self.tabela)
        buckets_ocupados = sum(1 for bucket in self.tabela if bucket)
        
        print(f"=== ESTATÍSTICAS HASH TABLE ===")
        print(f"Elementos: {elementos_total}")
        print(f"Buckets ocupados: {buckets_ocupados}/{self.tamanho}")
        print(f"Fator de carga: {elementos_total/self.tamanho:.2f}")
        print(f"Colisões: {self.colisoes}")
        print(f"Taxa de colisão: {self.colisoes/self.operacoes*100:.1f}%")

# Demonstração
def demonstrar_hash_table():
    ht = HashTableAnalise(7)  # Tamanho pequeno para forçar colisões
    
    # Inserir dados que causam diferentes cenários
    dados = [
        ("janeiro", 31), ("fevereiro", 28), ("março", 31),
        ("abril", 30), ("maio", 31), ("junho", 30),
        ("julho", 31), ("agosto", 31), ("setembro", 30),
        ("outubro", 31), ("novembro", 30), ("dezembro", 31)
    ]
    
    for chave, valor in dados:
        ht.inserir(chave, valor)
    
    ht.estatisticas()
    
    print(f"\n=== ANÁLISE DE CASOS ===")
    print(f"Melhor caso: O(1) - sem colisões")
    print(f"Caso médio: O(1 + α) onde α é o fator de carga")
    print(f"Pior caso: O(n) - todas as chaves no mesmo bucket")

demonstrar_hash_table()
```

### Análise Probabilística

#### Algoritmo de Monte Carlo para Estimativa π

```python
import random
import math

def estimar_pi_monte_carlo(num_pontos):
    """
    Caso médio: Converge para π com erro proporcional a 1/√n
    Análise: Quanto mais pontos, melhor a estimativa
    """
    pontos_dentro_circulo = 0
    
    for _ in range(num_pontos):
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        
        if x*x + y*y <= 1:
            pontos_dentro_circulo += 1
    
    pi_estimado = 4 * pontos_dentro_circulo / num_pontos
    erro = abs(pi_estimado - math.pi)
    
    return pi_estimado, erro

def analisar_convergencia():
    print("=== ANÁLISE MONTE CARLO - ESTIMATIVA π ===")
    
    for n in [100, 1000, 10000, 100000]:
        pi_est, erro = estimar_pi_monte_carlo(n)
        print(f"n={n:6d}: π≈{pi_est:.6f}, erro={erro:.6f}")
    
    print(f"\nπ real: {math.pi:.6f}")
    print("Observação: Erro diminui proporcionalmente a 1/√n")

analisar_convergencia()
```

### Algoritmos Randomizados vs Determinísticos

```python
import random

def quicksort_deterministico(arr):
    """Sempre escolhe o primeiro elemento como pivô"""
    if len(arr) <= 1:
        return arr
    
    pivot = arr[0]  # Determinístico
    esquerda = [x for x in arr[1:] if x < pivot]
    direita = [x for x in arr[1:] if x >= pivot]
    
    return quicksort_deterministico(esquerda) + [pivot] + quicksort_deterministico(direita)

def quicksort_randomizado(arr):
    """Escolhe pivô aleatório"""
    if len(arr) <= 1:
        return arr
    
    pivot_index = random.randint(0, len(arr) - 1)
    pivot = arr[pivot_index]  # Randomizado
    
    esquerda = [x for x in arr if x < pivot]
    meio = [x for x in arr if x == pivot]
    direita = [x for x in arr if x > pivot]
    
    return quicksort_randomizado(esquerda) + meio + quicksort_randomizado(direita)

def comparar_abordagens():
    print("=== DETERMINÍSTICO vs RANDOMIZADO ===")
    
    # Pior caso para determinístico
    arr_ordenado = list(range(100))
    
    print("Array já ordenado (pior caso para determinístico):")
    print("Determinístico: O(n²) - muito lento")
    print("Randomizado: O(n log n) esperado - rápido")
    
    # Demonstração
    import time
    
    # Teste pequeno para não travar
    teste = list(range(20))
    
    inicio = time.time()
    quicksort_deterministico(teste.copy())
    tempo_det = time.time() - inicio
    
    inicio = time.time()
    quicksort_randomizado(teste.copy())
    tempo_rand = time.time() - inicio
    
    print(f"\nTempo determinístico: {tempo_det:.6f}s")
    print(f"Tempo randomizado: {tempo_rand:.6f}s")

comparar_abordagens()
```

### Análise Amortizada

```python
class ArrayDinamico:
    """Demonstração de análise amortizada com redimensionamento"""
    
    def __init__(self):
        self.capacidade = 1
        self.tamanho = 0
        self.array = [None] * self.capacidade
        self.operacoes_redimensionamento = 0
        self.custo_total = 0
    
    def append(self, elemento):
        # Se precisar redimensionar
        if self.tamanho >= self.capacidade:
            self._redimensionar()
        
        self.array[self.tamanho] = elemento
        self.tamanho += 1
        self.custo_total += 1  # Custo da inserção
    
    def _redimensionar(self):
        """Dobra o tamanho do array"""
        self.operacoes_redimensionamento += 1
        nova_capacidade = self.capacidade * 2
        novo_array = [None] * nova_capacidade
        
        # Copiar elementos (custo O(n))
        for i in range(self.tamanho):
            novo_array[i] = self.array[i]
        
        self.array = novo_array
        self.capacidade = nova_capacidade
        self.custo_total += self.tamanho  # Custo da cópia
    
    def analisar_custo_amortizado(self):
        if self.tamanho == 0:
            return 0
        return self.custo_total / self.tamanho

def demonstrar_analise_amortizada():
    print("=== ANÁLISE AMORTIZADA - ARRAY DINÂMICO ===")
    
    arr = ArrayDinamico()
    
    # Inserir elementos e analisar custo
    marcos = [10, 50, 100, 500, 1000]
    
    for i in range(1000):
        arr.append(f"elemento_{i}")
        
        if (i + 1) in marcos:
            custo_amortizado = arr.analisar_custo_amortizado()
            print(f"Após {i+1:4d} inserções:")
            print(f"  Redimensionamentos: {arr.operacoes_redimensionamento}")
            print(f"  Custo amortizado: {custo_amortizado:.2f}")
            print(f"  Capacidade atual: {arr.capacidade}")
            print()
    
    print("Observação: Custo amortizado converge para O(1) por inserção")

demonstrar_analise_amortizada()
```

### Dicas Práticas para Análise

#### Como Escolher a Análise Adequada

```python
def guia_analise_algoritmos():
    print("=== GUIA: QUANDO USAR CADA ANÁLISE ===")
    
    casos_uso = {
        "Sistemas em Tempo Real": {
            "análise": "Pior caso",
            "razão": "Garantir que deadlines sejam sempre cumpridos",
            "exemplo": "Sistemas de freios ABS, controladores de voo"
        },
        
        "Aplicações Web": {
            "análise": "Caso médio",
            "razão": "Otimizar para comportamento típico do usuário",
            "exemplo": "Buscas em bases de dados, APIs REST"
        },
        
        "Algoritmos de Machine Learning": {
            "análise": "Caso médio + análise probabilística",
            "razão": "Dados raramente são adversários intencionais",
            "exemplo": "Treinamento de redes neurais, clustering"
        },
        
        "Sistemas de Segurança": {
            "análise": "Pior caso",
            "razão": "Adversários podem escolher dados maliciosos",
            "exemplo": "Sistemas criptográficos, autenticação"
        },
        
        "Algoritmos de Pesquisa": {
            "análise": "Caso médio",
            "razão": "Consultas típicas são aleatórias",
            "exemplo": "Motores de busca, recomendações"
        }
    }
    
    for contexto, info in casos_uso.items():
        print(f"\n📍 {contexto}:")
        print(f"   Análise: {info['análise']}")
        print(f"   Razão: {info['razão']}")
        print(f"   Exemplo: {info['exemplo']}")

guia_analise_algoritmos()
```

### Ferramentas de Profiling

```python
import time
import cProfile
import pstats

def profile_algoritmo(func, *args):
    """Ferramenta para medir performance real"""
    
    # Medição de tempo simples
    inicio = time.time()
    resultado = func(*args)
    tempo_execucao = time.time() - inicio
    
    print(f"Tempo de execução: {tempo_execucao:.6f}s")
    
    # Profiling detalhado
    pr = cProfile.Profile()
    pr.enable()
    func(*args)
    pr.disable()
    
    # Análise dos resultados
    stats = pstats.Stats(pr)
    stats.sort_stats('cumulative')
    print("\nTop 5 funções mais custosas:")
    stats.print_stats(5)
    
    return resultado

# Exemplo de uso
def algoritmo_exemplo(n):
    """Algoritmo de exemplo para profiling"""
    total = 0
    for i in range(n):
        for j in range(i):
            total += i * j
    return total

print("=== PROFILING DE ALGORITMO ===")
# profile_algoritmo(algoritmo_exemplo, 1000)
```

### Recursos Externos

📚 **Documentação e Tutoriais:**
- [Algorithm Analysis - Khan Academy](https://www.khanacademy.org/computing/computer-science/algorithms)
- [Average Case Analysis - GeeksforGeeks](https://www.geeksforgeeks.org/analysis-of-algorithms-set-2-asymptotic-analysis/)
- [Probabilistic Analysis - MIT OpenCourseWare](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/)

🎥 **Vídeos Recomendados:**
- [Average vs Worst Case Analysis](https://www.youtube.com/watch?v=V42FBiohc6c)
- [Amortized Analysis Explained](https://www.youtube.com/watch?v=3MpzavV3Mks)

🛠️ **Ferramentas Interativas:**
- [Big-O Complexity Chart](https://www.bigocheatsheet.com/)
- [Algorithm Visualizer](https://algorithm-visualizer.org/)

A análise de casos é fundamental para tomar decisões informadas sobre qual algoritmo usar em cada situação prática!
