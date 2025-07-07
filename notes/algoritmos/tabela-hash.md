### Tabela Hash - Estrutura de Dados de Acesso Rápido

**O que é uma Tabela Hash?**

Uma **tabela hash** (hash table) é uma estrutura de dados que implementa um mapa associativo, permitindo acesso, inserção e remoção de elementos em tempo médio O(1). Ela usa uma **função hash** para mapear chaves para índices em um array.

**Analogia:** É como um índice de um livro - você procura uma palavra (chave) e o índice te diz exatamente em qual página (posição) encontrá-la, sem precisar folhear todo o livro.

### Como Funciona uma Tabela Hash

| Componente | Função | Importância |
|------------|--------|-------------|
| **Array Base** | Armazena os dados |  Estrutura principal |
| **Função Hash** | Converte chave em índice |  Determina posição |
| **Tratamento de Colisões** | Resolve conflitos |  Mantém performance |
| **Fator de Carga** | Controla densidade |  Equilibra espaço/tempo |

### Função Hash Fundamental

```python
class TabelaHashSimples:
    def __init__(self, tamanho=10):
        self.tamanho = tamanho
        self.tabela = [None] * tamanho
    
    def hash_function(self, chave):
        """Função hash básica usando módulo"""
        if isinstance(chave, str):
            # Soma dos valores ASCII dos caracteres
            hash_value = sum(ord(char) for char in chave)
        else:
            hash_value = hash(chave)
        
        return hash_value % self.tamanho
    
    def inserir(self, chave, valor):
        indice = self.hash_function(chave)
        self.tabela[indice] = (chave, valor)
        print(f"'{chave}' → índice {indice}")
    
    def buscar(self, chave):
        indice = self.hash_function(chave)
        if self.tabela[indice] and self.tabela[indice][0] == chave:
            return self.tabela[indice][1]
        return None

# Demonstração
tabela = TabelaHashSimples(7)
tabela.inserir("nome", "João")
tabela.inserir("idade", 30)
tabela.inserir("cidade", "São Paulo")

print("Busca 'nome':", tabela.buscar("nome"))
```

### Colisões - O Maior Desafio

**O que são Colisões?**

**Colisões** ocorrem quando duas chaves diferentes produzem o mesmo índice hash. É inevitável devido ao **Princípio da Casa dos Pombos** - se temos mais chaves que posições, algumas vão colidir.

#### Demonstração de Colisões

```python
def demonstrar_colisoes():
    print("=== DEMONSTRAÇÃO DE COLISÕES ===")
    
    def hash_simples(chave, tamanho):
        return sum(ord(c) for c in chave) % tamanho
    
    tamanho = 5
    chaves = ["abc", "bca", "cab", "xyz", "zyx"]
    
    print(f"Tamanho da tabela: {tamanho}")
    print("\nMapeamento de chaves:")
    
    indices_usados = {}
    for chave in chaves:
        indice = hash_simples(chave, tamanho)
        print(f"'{chave}' → {indice}")
        
        if indice in indices_usados:
            print(f"  ❌ COLISÃO com '{indices_usados[indice]}'!")
        else:
            indices_usados[indice] = chave

demonstrar_colisoes()
```

### Métodos de Resolução de Colisões

#### 1. Encadeamento (Chaining)

```python
class TabelaHashEncadeamento:
    def __init__(self, tamanho=10):
        self.tamanho = tamanho
        self.tabela = [[] for _ in range(tamanho)]
        self.total_elementos = 0
        self.colisoes = 0
    
    def hash_function(self, chave):
        return hash(chave) % self.tamanho
    
    def inserir(self, chave, valor):
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        # Verificar se chave já existe
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                bucket[i] = (chave, valor)  # Atualizar
                return
        
        # Detectar colisão
        if bucket:  # Se bucket não está vazio
            self.colisoes += 1
            print(f"Colisão detectada no índice {indice}")
        
        # Adicionar novo elemento
        bucket.append((chave, valor))
        self.total_elementos += 1
    
    def buscar(self, chave):
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        for k, v in bucket:
            if k == chave:
                return v
        return None
    
    def remover(self, chave):
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                del bucket[i]
                self.total_elementos -= 1
                return True
        return False
    
    def estatisticas(self):
        buckets_ocupados = sum(1 for bucket in self.tabela if bucket)
        maior_bucket = max(len(bucket) for bucket in self.tabela)
        fator_carga = self.total_elementos / self.tamanho
        
        print(f"\n=== ESTATÍSTICAS ===")
        print(f"Elementos: {self.total_elementos}")
        print(f"Buckets ocupados: {buckets_ocupados}/{self.tamanho}")
        print(f"Fator de carga: {fator_carga:.2f}")
        print(f"Colisões: {self.colisoes}")
        print(f"Maior bucket: {maior_bucket} elementos")
        
        return {
            'fator_carga': fator_carga,
            'colisoes': self.colisoes,
            'eficiencia': buckets_ocupados / self.tamanho
        }

# Teste com encadeamento
def testar_encadeamento():
    print("=== TESTE ENCADEAMENTO ===")
    tabela = TabelaHashEncadeamento(5)  # Tamanho pequeno para forçar colisões
    
    dados = [
        ("python", "linguagem"), ("java", "plataforma"), 
        ("go", "eficiência"), ("rust", "segurança"),
        ("javascript", "web"), ("typescript", "tipagem")
    ]
    
    for chave, valor in dados:
        tabela.inserir(chave, valor)
    
    # Testar buscas
    print(f"\nBusca 'python': {tabela.buscar('python')}")
    print(f"Busca 'go': {tabela.buscar('go')}")
    print(f"Busca 'inexistente': {tabela.buscar('inexistente')}")
    
    tabela.estatisticas()

testar_encadeamento()
```

#### 2. Endereçamento Aberto (Open Addressing)

```python
class TabelaHashEnderecoAberto:
    def __init__(self, tamanho=10):
        self.tamanho = tamanho
        self.chaves = [None] * tamanho
        self.valores = [None] * tamanho
        self.deletados = [False] * tamanho
        self.total_elementos = 0
        self.tentativas_total = 0
    
    def hash_function(self, chave):
        return hash(chave) % self.tamanho
    
    def sondagem_linear(self, chave):
        """Sondagem linear: tenta próximas posições sequencialmente"""
        indice = self.hash_function(chave)
        tentativas = 0
        
        while (self.chaves[indice] is not None and 
               self.chaves[indice] != chave and 
               not self.deletados[indice]):
            indice = (indice + 1) % self.tamanho
            tentativas += 1
            
            if tentativas >= self.tamanho:
                raise Exception("Tabela cheia!")
        
        self.tentativas_total += tentativas
        return indice, tentativas
    
    def sondagem_quadratica(self, chave):
        """Sondagem quadrática: tenta posições com saltos quadráticos"""
        indice_base = self.hash_function(chave)
        tentativas = 0
        
        while tentativas < self.tamanho:
            indice = (indice_base + tentativas * tentativas) % self.tamanho
            
            if (self.chaves[indice] is None or 
                self.chaves[indice] == chave or 
                self.deletados[indice]):
                self.tentativas_total += tentativas
                return indice, tentativas
            
            tentativas += 1
        
        raise Exception("Não foi possível encontrar posição!")
    
    def inserir(self, chave, valor, metodo='linear'):
        if self.total_elementos >= self.tamanho * 0.7:  # Limit load factor
            print("⚠️  Fator de carga alto! Consider resize.")
        
        if metodo == 'linear':
            indice, tentativas = self.sondagem_linear(chave)
        else:
            indice, tentativas = self.sondagem_quadratica(chave)
        
        # Se não é atualização, é inserção nova
        if self.chaves[indice] != chave:
            self.total_elementos += 1
        
        self.chaves[indice] = chave
        self.valores[indice] = valor
        self.deletados[indice] = False
        
        if tentativas > 0:
            print(f"'{chave}' inserido após {tentativas} tentativas")
    
    def buscar(self, chave, metodo='linear'):
        if metodo == 'linear':
            indice, tentativas = self.sondagem_linear(chave)
        else:
            indice, tentativas = self.sondagem_quadratica(chave)
        
        if self.chaves[indice] == chave and not self.deletados[indice]:
            return self.valores[indice]
        return None
    
    def remover(self, chave, metodo='linear'):
        if metodo == 'linear':
            indice, _ = self.sondagem_linear(chave)
        else:
            indice, _ = self.sondagem_quadratica(chave)
        
        if self.chaves[indice] == chave and not self.deletados[indice]:
            self.deletados[indice] = True
            self.total_elementos -= 1
            return True
        return False
    
    def fator_carga(self):
        return self.total_elementos / self.tamanho
    
    def estatisticas(self):
        fator = self.fator_carga()
        tentativas_medias = (self.tentativas_total / self.total_elementos 
                           if self.total_elementos > 0 else 0)
        
        print(f"\n=== ESTATÍSTICAS ENDEREÇAMENTO ABERTO ===")
        print(f"Elementos: {self.total_elementos}/{self.tamanho}")
        print(f"Fator de carga: {fator:.2f}")
        print(f"Tentativas médias: {tentativas_medias:.2f}")
        print(f"Slots vazios: {self.tamanho - self.total_elementos}")

# Comparação de métodos
def comparar_sondagem():
    print("=== COMPARAÇÃO SONDAGEM LINEAR vs QUADRÁTICA ===")
    
    # Linear
    tabela_linear = TabelaHashEnderecoAberto(11)
    print("\n--- SONDAGEM LINEAR ---")
    for i in range(8):
        chave = f"item{i}"
        tabela_linear.inserir(chave, i, 'linear')
    tabela_linear.estatisticas()
    
    # Quadrática
    tabela_quad = TabelaHashEnderecoAberto(11)
    print("\n--- SONDAGEM QUADRÁTICA ---")
    for i in range(8):
        chave = f"item{i}"
        tabela_quad.inserir(chave, i, 'quadratica')
    tabela_quad.estatisticas()

comparar_sondagem()
```

### Fator de Carga (Load Factor)

**Definição:** O **fator de carga** é a razão entre o número de elementos armazenados e o tamanho total da tabela.

```
Fator de Carga = Número de Elementos / Tamanho da Tabela
```

#### Análise do Impacto do Fator de Carga

```python
import random
import time

class AnalisadorFatorCarga:
    def __init__(self):
        self.resultados = {}
    
    def testar_fator_carga(self, tamanho_tabela, fatores_teste):
        """Testa performance para diferentes fatores de carga"""
        
        for fator in fatores_teste:
            num_elementos = int(tamanho_tabela * fator)
            
            # Criar tabela com encadeamento
            tabela = TabelaHashEncadeamento(tamanho_tabela)
            
            # Inserir elementos
            elementos = [(f"chave{i}", f"valor{i}") for i in range(num_elementos)]
            
            inicio_insercao = time.time()
            for chave, valor in elementos:
                tabela.inserir(chave, valor)
            tempo_insercao = time.time() - inicio_insercao
            
            # Testar buscas
            chaves_busca = [f"chave{random.randint(0, num_elementos-1)}" 
                           for _ in range(100)]
            
            inicio_busca = time.time()
            for chave in chaves_busca:
                tabela.buscar(chave)
            tempo_busca = time.time() - inicio_busca
            
            # Calcular estatísticas
            stats = tabela.estatisticas()
            
            self.resultados[fator] = {
                'tempo_insercao': tempo_insercao,
                'tempo_busca': tempo_busca,
                'colisoes': stats['colisoes'],
                'eficiencia': stats['eficiencia']
            }
            
            print(f"\nFator {fator:.1f}: {tempo_busca*1000:.2f}ms busca, "
                  f"{stats['colisoes']} colisões")
    
    def relatorio_completo(self):
        print("\n=== RELATÓRIO IMPACTO FATOR DE CARGA ===")
        print("Fator | Busca(ms) | Colisões | Eficiência")
        print("-" * 45)
        
        for fator, dados in self.resultados.items():
            print(f"{fator:4.1f}  | {dados['tempo_busca']*1000:8.2f} | "
                  f"{dados['colisoes']:8d} | {dados['eficiencia']:9.2f}")

# Executar análise
def analisar_fator_carga():
    analisador = AnalisadorFatorCarga()
    fatores = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0]
    
    print("Analisando impacto do fator de carga...")
    analisador.testar_fator_carga(100, fatores)
    analisador.relatorio_completo()
    
    print(f"\n📊 CONCLUSÕES:")
    print(f"• Fator < 0.75: Performance ótima")
    print(f"• Fator 0.75-1.0: Performance boa")
    print(f"• Fator > 1.0: Performance degrada rapidamente")

analisar_fator_carga()
```

### Redimensionamento Dinâmico

```python
class TabelaHashDinamica:
    def __init__(self, tamanho_inicial=8):
        self.tamanho = tamanho_inicial
        self.tabela = [[] for _ in range(self.tamanho)]
        self.total_elementos = 0
        self.redimensionamentos = 0
        self.limite_superior = 0.75  # Redimensiona quando > 75%
        self.limite_inferior = 0.25  # Redimensiona quando < 25%
    
    def hash_function(self, chave):
        return hash(chave) % self.tamanho
    
    def fator_carga(self):
        return self.total_elementos / self.tamanho
    
    def redimensionar(self, novo_tamanho):
        """Redimensiona a tabela mantendo todos os elementos"""
        print(f"🔄 Redimensionando de {self.tamanho} para {novo_tamanho}")
        
        # Salvar elementos atuais
        elementos_antigos = []
        for bucket in self.tabela:
            elementos_antigos.extend(bucket)
        
        # Recriar tabela
        self.tamanho = novo_tamanho
        self.tabela = [[] for _ in range(self.tamanho)]
        self.total_elementos = 0
        self.redimensionamentos += 1
        
        # Reinserir elementos
        for chave, valor in elementos_antigos:
            self._inserir_sem_redimensionar(chave, valor)
    
    def _inserir_sem_redimensionar(self, chave, valor):
        """Inserção interna sem verificar redimensionamento"""
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        # Verificar se já existe
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                bucket[i] = (chave, valor)
                return
        
        # Adicionar novo
        bucket.append((chave, valor))
        self.total_elementos += 1
    
    def inserir(self, chave, valor):
        # Verificar se precisa expandir
        if self.fator_carga() > self.limite_superior:
            self.redimensionar(self.tamanho * 2)
        
        self._inserir_sem_redimensionar(chave, valor)
    
    def remover(self, chave):
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        for i, (k, v) in enumerate(bucket):
            if k == chave:
                del bucket[i]
                self.total_elementos -= 1
                
                # Verificar se precisa contrair
                if (self.fator_carga() < self.limite_inferior and 
                    self.tamanho > 8):  # Manter tamanho mínimo
                    self.redimensionar(max(8, self.tamanho // 2))
                
                return True
        return False
    
    def buscar(self, chave):
        indice = self.hash_function(chave)
        bucket = self.tabela[indice]
        
        for k, v in bucket:
            if k == chave:
                return v
        return None
    
    def estatisticas(self):
        maior_bucket = max(len(bucket) for bucket in self.tabela)
        buckets_vazios = sum(1 for bucket in self.tabela if not bucket)
        
        print(f"\n=== ESTATÍSTICAS TABELA DINÂMICA ===")
        print(f"Tamanho atual: {self.tamanho}")
        print(f"Elementos: {self.total_elementos}")
        print(f"Fator de carga: {self.fator_carga():.3f}")
        print(f"Redimensionamentos: {self.redimensionamentos}")
        print(f"Maior bucket: {maior_bucket}")
        print(f"Buckets vazios: {buckets_vazios}/{self.tamanho}")

# Demonstração de redimensionamento
def demonstrar_redimensionamento():
    print("=== DEMONSTRAÇÃO REDIMENSIONAMENTO ===")
    
    tabela = TabelaHashDinamica(4)  # Começar pequeno
    
    # Inserir muitos elementos para forçar expansões
    print("\n--- INSERINDO ELEMENTOS ---")
    for i in range(20):
        tabela.inserir(f"chave{i:02d}", f"valor{i}")
        if i % 5 == 4:  # Mostrar status a cada 5 inserções
            print(f"Após {i+1} inserções: tamanho={tabela.tamanho}, "
                  f"fator={tabela.fator_carga():.2f}")
    
    tabela.estatisticas()
    
    # Remover elementos para forçar contrações
    print("\n--- REMOVENDO ELEMENTOS ---")
    for i in range(15):
        tabela.remover(f"chave{i:02d}")
        if i % 3 == 2:  # Mostrar status a cada 3 remoções
            print(f"Após {i+1} remoções: tamanho={tabela.tamanho}, "
                  f"fator={tabela.fator_carga():.2f}")
    
    tabela.estatisticas()

demonstrar_redimensionamento()
```

### Análise de Desempenho

#### Complexidade Temporal

| Operação | Melhor Caso | Caso Médio | Pior Caso |
|----------|-------------|------------|-----------|
| **Busca** | O(1) | O(1) | O(n) |
| **Inserção** | O(1) | O(1) | O(n) |
| **Remoção** | O(1) | O(1) | O(n) |

#### Benchmark Comparativo

```python
import time
import random

class BenchmarkHashTable:
    def __init__(self):
        self.resultados = {}
    
    def benchmark_operacao(self, estrutura, operacao, dados, repeticoes=1000):
        """Benchmark uma operação específica"""
        tempos = []
        
        for _ in range(repeticoes):
            inicio = time.perf_counter()
            
            if operacao == 'inserir':
                for chave, valor in dados:
                    estrutura.inserir(chave, valor)
            elif operacao == 'buscar':
                for chave, _ in dados:
                    estrutura.buscar(chave)
            elif operacao == 'remover':
                for chave, _ in dados:
                    estrutura.remover(chave)
            
            fim = time.perf_counter()
            tempos.append(fim - inicio)
        
        return {
            'tempo_medio': sum(tempos) / len(tempos),
            'tempo_min': min(tempos),
            'tempo_max': max(tempos)
        }
    
    def comparar_estruturas(self, tamanhos=[100, 1000, 10000]):
        """Compara hash table com outras estruturas"""
        
        for tamanho in tamanhos:
            print(f"\n=== BENCHMARK TAMANHO {tamanho} ===")
            
            # Dados de teste
            dados = [(f"chave{i}", f"valor{i}") for i in range(tamanho)]
            random.shuffle(dados)
            
            # Hash Table
            hash_table = TabelaHashEncadeamento(tamanho // 10)
            tempo_hash = self.benchmark_operacao(hash_table, 'inserir', dados, 10)
            
            # Lista (busca linear) - para comparação
            lista = []
            inicio = time.perf_counter()
            for _ in range(10):
                for chave, valor in dados:
                    lista.append((chave, valor))
            tempo_lista = time.perf_counter() - inicio
            
            print(f"Hash Table - Inserção: {tempo_hash['tempo_medio']*1000:.2f}ms")
            print(f"Lista - Inserção: {tempo_lista*100:.2f}ms")
            print(f"Hash Table é {tempo_lista/tempo_hash['tempo_medio']:.1f}x mais rápida")

# Executar benchmark
def executar_benchmark():
    benchmark = BenchmarkHashTable()
    benchmark.comparar_estruturas([100, 1000, 5000])

executar_benchmark()
```

### Funções Hash Avançadas

```python
class FuncoesHashAvancadas:
    
    @staticmethod
    def hash_djb2(chave):
        """Algoritmo DJB2 - muito popular"""
        hash_value = 5381
        for char in str(chave):
            hash_value = ((hash_value << 5) + hash_value) + ord(char)
        return hash_value & 0xFFFFFFFF  # Manter 32-bit
    
    @staticmethod
    def hash_fnv1a(chave):
        """FNV-1a hash - boa distribuição"""
        hash_value = 2166136261  # FNV offset basis
        fnv_prime = 16777619
        
        for char in str(chave):
            hash_value ^= ord(char)
            hash_value *= fnv_prime
            hash_value &= 0xFFFFFFFF
        
        return hash_value
    
    @staticmethod
    def hash_multiplicativo(chave, A=0.6180339887):
        """Método multiplicativo com constante áurea"""
        hash_value = sum(ord(c) for c in str(chave))
        return int((hash_value * A % 1) * (2**32))
    
    @staticmethod
    def testar_distribuicao(funcao_hash, chaves, tamanho_tabela):
        """Testa a distribuição de uma função hash"""
        contadores = [0] * tamanho_tabela
        
        for chave in chaves:
            indice = funcao_hash(chave) % tamanho_tabela
            contadores[indice] += 1
        
        # Calcular estatísticas
        media = len(chaves) / tamanho_tabela
        variancia = sum((count - media)**2 for count in contadores) / tamanho_tabela
        desvio_padrao = variancia ** 0.5
        
        return {
            'contadores': contadores,
            'media': media,
            'desvio_padrao': desvio_padrao,
            'uniformidade': desvio_padrao / media if media > 0 else float('inf')
        }

def comparar_funcoes_hash():
    print("=== COMPARAÇÃO FUNÇÕES HASH ===")
    
    # Gerar chaves de teste
    chaves = [f"usuario{i:04d}" for i in range(1000)]
    chaves.extend([f"email{i}@teste.com" for i in range(1000)])
    
    funcoes = {
        'Python hash()': lambda x: hash(x),
        'DJB2': FuncoesHashAvancadas.hash_djb2,
        'FNV-1a': FuncoesHashAvancadas.hash_fnv1a,
        'Multiplicativo': FuncoesHashAvancadas.hash_multiplicativo
    }
    
    tamanho_tabela = 127  # Número primo
    
    print(f"Testando {len(chaves)} chaves em tabela de tamanho {tamanho_tabela}")
    print("Função          | Uniformidade | Desvio Padrão")
    print("-" * 50)
    
    for nome, funcao in funcoes.items():
        stats = FuncoesHashAvancadas.testar_distribuicao(
            funcao, chaves, tamanho_tabela
        )
        print(f"{nome:15} | {stats['uniformidade']:11.3f} | {stats['desvio_padrao']:12.2f}")

comparar_funcoes_hash()
```

### Aplicações Práticas

#### Cache LRU com Hash Table

```python
class CacheLRU:
    def __init__(self, capacidade):
        self.capacidade = capacidade
        self.cache = {}  # Hash table para O(1) lookup
        self.ordem = []  # Lista para rastrear ordem de acesso
    
    def get(self, chave):
        if chave in self.cache:
            # Mover para o final (mais recente)
            self.ordem.remove(chave)
            self.ordem.append(chave)
            return self.cache[chave]
        return None
    
    def put(self, chave, valor):
        if chave in self.cache:
            # Atualizar valor existente
            self.cache[chave] = valor
            self.ordem.remove(chave)
            self.ordem.append(chave)
        else:
            # Adicionar novo item
            if len(self.cache) >= self.capacidade:
                # Remover item menos recente
                lru_key = self.ordem.pop(0)
                del self.cache[lru_key]
            
            self.cache[chave] = valor
            self.ordem.append(chave)
    
    def status(self):
        print(f"Cache: {dict(list(self.cache.items())[-3:])}")  # Últimos 3
        print(f"Ordem: {self.ordem[-3:]}")  # Mais recentes

# Demonstração Cache LRU
def demo_cache_lru():
    print("=== DEMONSTRAÇÃO CACHE LRU ===")
    cache = CacheLRU(3)
    
    operacoes = [
        ('put', 'a', 1), ('put', 'b', 2), ('put', 'c', 3),
        ('get', 'a', None), ('put', 'd', 4), ('get', 'b', None)
    ]
    
    for op, chave, valor in operacoes:
        if op == 'put':
            cache.put(chave, valor)
            print(f"PUT({chave}, {valor})")
        else:
            resultado = cache.get(chave)
            print(f"GET({chave}) = {resultado}")
        cache.status()
        print()

demo_cache_lru()
```

#### Contador de Frequência

```python
class ContadorFrequencia:
    def __init__(self):
        self.contadores = {}
    
    def incrementar(self, item):
        self.contadores[item] = self.contadores.get(item, 0) + 1
    
    def contar(self, item):
        return self.contadores.get(item, 0)
    
    def mais_comuns(self, n=5):
        return sorted(self.contadores.items(), 
                     key=lambda x: x[1], reverse=True)[:n]
    
    def estatisticas(self):
        total = sum(self.contadores.values())
        unique = len(self.contadores)
        
        print(f"Total de itens: {total}")
        print(f"Itens únicos: {unique}")
        print(f"Frequência média: {total/unique:.2f}")

# Exemplo de uso
def demo_contador():
    print("=== CONTADOR DE FREQUÊNCIA ===")
    
    contador = ContadorFrequencia()
    
    # Simular dados
    import random
    palavras = ['python', 'java', 'go', 'rust', 'javascript']
    for _ in range(100):
        palavra = random.choice(palavras)
        contador.incrementar(palavra)
    
    contador.estatisticas()
    print("\nMais comuns:")
    for palavra, freq in contador.mais_comuns():
        print(f"  {palavra}: {freq}")

demo_contador()
```

### Dicas de Otimização

#### Escolha do Tamanho Inicial

```python
def calcular_tamanho_otimo(num_elementos_esperado, fator_carga_alvo=0.75):
    """Calcula tamanho ótimo da tabela hash"""
    tamanho_minimo = int(num_elementos_esperado / fator_carga_alvo)
    
    # Encontrar próximo número primo maior
    def is_primo(n):
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True
    
    tamanho = tamanho_minimo
    while not is_primo(tamanho):
        tamanho += 1
    
    return tamanho

# Exemplo
elementos_esperados = 1000
tamanho_otimo = calcular_tamanho_otimo(elementos_esperados)
print(f"Para {elementos_esperados} elementos:")
print(f"Tamanho ótimo: {tamanho_otimo}")
print(f"Fator de carga resultante: {elementos_esperados/tamanho_otimo:.2f}")
```

### Quando Usar Hash Tables

#### ✅ Use Hash Tables quando:

- **Acesso rápido** por chave é prioritário
- **Inserções/remoções frequentes** são necessárias
- **Busca O(1)** é requerida
- **Chaves únicas** definem os dados
- **Cache** ou **lookup tables** são necessários

#### ❌ Evite Hash Tables quando:

- **Ordem dos elementos** é importante
- **Busca por intervalos** é necessária
- **Memória é limitada** (overhead das estruturas)
- **Pior caso O(n)** é inaceitável
- **Chaves não são hashable**

### Recursos Externos

📚 **Documentação e Tutoriais:**
- [Hash Table - GeeksforGeeks](https://www.geeksforgeeks.org/hashing-data-structure/)
- [Hash Tables - MIT Introduction to Algorithms](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)
- [Python Dictionary Implementation](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)

🎥 **Vídeos Recomendados:**
- [Hash Tables Explained - CS50](https://www.youtube.com/watch?v=nvzVHwrrub0)
- [Hash Functions and Collisions](https://www.youtube.com/watch?v=rvdJDijO2Ro)

🛠️ **Ferramentas Interativas:**
- [VisuAlgo - Hash Table](https://visualgo.net/en/hashtable) - Visualização interativa
- [Hash Table Simulator](https://www.cs.usfca.edu/~galles/visualization/OpenHash.html)

Hash Tables são uma das estruturas de dados mais importantes e versáteis da ciência da computação, oferecendo acesso extremamente rápido quando bem implementadas!
