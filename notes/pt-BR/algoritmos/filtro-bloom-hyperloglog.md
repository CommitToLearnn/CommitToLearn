# Filtro de Bloom e HyperLogLog

## Filtro de Bloom

### O que é um Filtro de Bloom?

Um Filtro de Bloom é uma estrutura de dados probabilística que testa se um elemento é membro de um conjunto. Pode ter falsos positivos, mas nunca falsos negativos. É extremamente eficiente em espaço e tempo.

### Funcionamento Básico

```
Conjunto: {a, b, c}
Bit Array: [0, 0, 0, 0, 0, 0, 0, 0]

Após inserir 'a': [1, 0, 1, 0, 0, 1, 0, 0]
Após inserir 'b': [1, 1, 1, 0, 0, 1, 0, 1]
Após inserir 'c': [1, 1, 1, 1, 0, 1, 0, 1]

Para verificar 'a': verifica posições hash(a) → se todas = 1, pode estar no conjunto
```

### Implementação Básica

```python
import hashlib
import math
from bitarray import bitarray

class BloomFilter:
    def __init__(self, expected_items, false_positive_rate=0.01):
        """
        Inicializa filtro de Bloom
        
        Args:
            expected_items: Número esperado de elementos
            false_positive_rate: Taxa de falsos positivos desejada
        """
        self.expected_items = expected_items
        self.false_positive_rate = false_positive_rate
        
        # Calcular tamanho ótimo do bit array
        self.size = self._calculate_size(expected_items, false_positive_rate)
        
        # Calcular número ótimo de hash functions
        self.hash_count = self._calculate_hash_count(self.size, expected_items)
        
        # Inicializar bit array
        self.bit_array = bitarray(self.size)
        self.bit_array.setall(0)
        
        # Contador de elementos inseridos
        self.items_added = 0
    
    def _calculate_size(self, n, p):
        """
        Calcula tamanho ótimo do bit array
        Formula: m = -(n * ln(p)) / (ln(2)^2)
        """
        m = -(n * math.log(p)) / (math.log(2) ** 2)
        return int(m)
    
    def _calculate_hash_count(self, m, n):
        """
        Calcula número ótimo de hash functions
        Formula: k = (m/n) * ln(2)
        """
        k = (m / n) * math.log(2)
        return int(k)
    
    def _hash(self, item, seed):
        """Gera hash usando diferentes seeds"""
        combined = f"{item}{seed}".encode('utf-8')
        digest = hashlib.md5(combined).hexdigest()
        return int(digest, 16) % self.size
    
    def add(self, item):
        """Adiciona item ao filtro"""
        for i in range(self.hash_count):
            index = self._hash(item, i)
            self.bit_array[index] = 1
        
        self.items_added += 1
    
    def contains(self, item):
        """
        Verifica se item pode estar no conjunto
        Retorna: True (pode estar) ou False (definitivamente não está)
        """
        for i in range(self.hash_count):
            index = self._hash(item, i)
            if self.bit_array[index] == 0:
                return False
        return True
    
    def estimated_false_positive_rate(self):
        """Calcula taxa atual de falsos positivos"""
        if self.items_added == 0:
            return 0.0
        
        # Formula: (1 - e^(-k*n/m))^k
        k = self.hash_count
        n = self.items_added
        m = self.size
        
        return (1 - math.exp(-k * n / m)) ** k
    
    def get_stats(self):
        """Retorna estatísticas do filtro"""
        bits_set = self.bit_array.count(1)
        load_factor = bits_set / self.size
        
        return {
            'size': self.size,
            'hash_functions': self.hash_count,
            'items_added': self.items_added,
            'bits_set': bits_set,
            'load_factor': load_factor,
            'estimated_fpr': self.estimated_false_positive_rate()
        }

# Exemplo de uso
if __name__ == "__main__":
    # Criar filtro para 1000 itens com 1% de falsos positivos
    bf = BloomFilter(expected_items=1000, false_positive_rate=0.01)
    
    # Adicionar alguns itens
    items_to_add = ['apple', 'banana', 'cherry', 'date', 'elderberry']
    for item in items_to_add:
        bf.add(item)
    
    # Testar membership
    test_items = ['apple', 'banana', 'grape', 'kiwi']
    for item in test_items:
        result = bf.contains(item)
        print(f"'{item}' pode estar no conjunto: {result}")
    
    # Mostrar estatísticas
    stats = bf.get_stats()
    print(f"\nEstatísticas do Filtro:")
    for key, value in stats.items():
        print(f"{key}: {value}")
```

### Variações Avançadas

#### 1. Counting Bloom Filter
```python
class CountingBloomFilter:
    def __init__(self, expected_items, false_positive_rate=0.01, counter_size=4):
        """
        Filtro de Bloom com contadores para permitir remoção
        
        Args:
            counter_size: Bits por contador (default: 4 bits = valores 0-15)
        """
        self.expected_items = expected_items
        self.false_positive_rate = false_positive_rate
        self.counter_size = counter_size
        self.max_count = (2 ** counter_size) - 1
        
        # Calcular parâmetros
        self.size = self._calculate_size(expected_items, false_positive_rate)
        self.hash_count = self._calculate_hash_count(self.size, expected_items)
        
        # Array de contadores em vez de bits
        self.counters = [0] * self.size
        self.items_added = 0
    
    def _calculate_size(self, n, p):
        m = -(n * math.log(p)) / (math.log(2) ** 2)
        return int(m)
    
    def _calculate_hash_count(self, m, n):
        k = (m / n) * math.log(2)
        return int(k)
    
    def _hash(self, item, seed):
        combined = f"{item}{seed}".encode('utf-8')
        digest = hashlib.sha256(combined).hexdigest()
        return int(digest, 16) % self.size
    
    def add(self, item):
        """Adiciona item (incrementa contadores)"""
        for i in range(self.hash_count):
            index = self._hash(item, i)
            if self.counters[index] < self.max_count:
                self.counters[index] += 1
        
        self.items_added += 1
    
    def remove(self, item):
        """
        Remove item (decrementa contadores)
        Retorna True se item provavelmente estava no conjunto
        """
        # Verificar se item está no filtro
        if not self.contains(item):
            return False
        
        # Decrementar contadores
        for i in range(self.hash_count):
            index = self._hash(item, i)
            if self.counters[index] > 0:
                self.counters[index] -= 1
        
        self.items_added -= 1
        return True
    
    def contains(self, item):
        """Verifica se item pode estar no conjunto"""
        for i in range(self.hash_count):
            index = self._hash(item, i)
            if self.counters[index] == 0:
                return False
        return True
    
    def get_memory_usage(self):
        """Calcula uso de memória em bytes"""
        bits_per_counter = self.counter_size
        total_bits = self.size * bits_per_counter
        return total_bits // 8  # Converter para bytes
```

#### 2. Scalable Bloom Filter
```python
class ScalableBloomFilter:
    def __init__(self, initial_capacity=100, error_rate=0.001, growth_factor=2):
        """
        Filtro de Bloom que cresce dinamicamente
        
        Args:
            initial_capacity: Capacidade inicial
            error_rate: Taxa de erro desejada
            growth_factor: Fator de crescimento
        """
        self.initial_capacity = initial_capacity
        self.error_rate = error_rate
        self.growth_factor = growth_factor
        
        # Lista de filtros
        self.filters = []
        self.current_capacity = initial_capacity
        
        # Criar primeiro filtro
        self._add_filter()
    
    def _add_filter(self):
        """Adiciona novo filtro à sequência"""
        # Cada novo filtro tem erro rate reduzido
        filter_error_rate = self.error_rate * (0.5 ** len(self.filters))
        
        new_filter = BloomFilter(
            expected_items=self.current_capacity,
            false_positive_rate=filter_error_rate
        )
        
        self.filters.append(new_filter)
        self.current_capacity *= self.growth_factor
    
    def add(self, item):
        """Adiciona item ao filtro atual"""
        current_filter = self.filters[-1]
        
        # Se filtro atual está cheio, criar novo
        if current_filter.items_added >= current_filter.expected_items:
            self._add_filter()
            current_filter = self.filters[-1]
        
        current_filter.add(item)
    
    def contains(self, item):
        """Verifica se item está em qualquer filtro"""
        for bloom_filter in self.filters:
            if bloom_filter.contains(item):
                return True
        return False
    
    def get_stats(self):
        """Retorna estatísticas de todos os filtros"""
        total_items = sum(f.items_added for f in self.filters)
        total_size = sum(f.size for f in self.filters)
        
        return {
            'num_filters': len(self.filters),
            'total_items': total_items,
            'total_size_bits': total_size,
            'filters': [f.get_stats() for f in self.filters]
        }
```

## HyperLogLog

### O que é HyperLogLog?

HyperLogLog é um algoritmo probabilístico para estimar a cardinalidade (número de elementos únicos) de grandes conjuntos de dados com uso mínimo de memória. Pode estimar cardinalidades de bilhões de elementos usando apenas alguns KB de memória.

### Princípio Básico

O algoritmo se baseia na observação de que a probabilidade de ver uma sequência de k zeros no início de um número binário aleatório é 2^(-k). Se o máximo número de zeros consecutivos observado é k, então estima-se que existem aproximadamente 2^k elementos únicos.

### Implementação Completa

```python
import hashlib
import math

class HyperLogLog:
    def __init__(self, precision=10):
        """
        Inicializa HyperLogLog
        
        Args:
            precision: Precisão (4-16). Maior = mais preciso mas usa mais memória
                      Memória usada: 2^precision bytes
                      Erro padrão: 1.04 / sqrt(2^precision)
        """
        self.precision = precision
        self.m = 2 ** precision  # Número de buckets
        self.buckets = [0] * self.m
        
        # Constante de correção baseada na precisão
        if self.m >= 128:
            self.alpha = 0.7213 / (1 + 1.079 / self.m)
        elif self.m >= 64:
            self.alpha = 0.709
        elif self.m >= 32:
            self.alpha = 0.697
        else:
            self.alpha = 0.5
    
    def _hash(self, item):
        """Gera hash de 32 bits do item"""
        if isinstance(item, str):
            item = item.encode('utf-8')
        elif not isinstance(item, bytes):
            item = str(item).encode('utf-8')
        
        digest = hashlib.sha1(item).digest()
        # Pegar primeiros 4 bytes para hash de 32 bits
        return int.from_bytes(digest[:4], byteorder='big')
    
    def _leading_zeros(self, num, max_bits=32):
        """Conta zeros à esquerda em representação binária"""
        if num == 0:
            return max_bits
        
        zeros = 0
        mask = 1 << (max_bits - 1)
        
        while zeros < max_bits and (num & mask) == 0:
            zeros += 1
            mask >>= 1
        
        return zeros
    
    def add(self, item):
        """Adiciona item ao HyperLogLog"""
        # Gerar hash
        h = self._hash(item)
        
        # Usar primeiros 'precision' bits para índice do bucket
        bucket_index = h & ((1 << self.precision) - 1)
        
        # Usar bits restantes para contar zeros à esquerda
        remaining_bits = h >> self.precision
        leading_zeros = self._leading_zeros(remaining_bits, 32 - self.precision) + 1
        
        # Atualizar bucket com máximo
        self.buckets[bucket_index] = max(self.buckets[bucket_index], leading_zeros)
    
    def cardinality(self):
        """Estima cardinalidade do conjunto"""
        # Média harmônica dos buckets
        raw_estimate = self.alpha * (self.m ** 2) / sum(2 ** (-x) for x in self.buckets)
        
        # Aplicar correções para casos extremos
        if raw_estimate <= 2.5 * self.m:
            # Correção para pequenas cardinalidades
            empty_buckets = self.buckets.count(0)
            if empty_buckets != 0:
                return self.m * math.log(self.m / empty_buckets)
        
        if raw_estimate <= (1.0/30.0) * (2 ** 32):
            # Sem correção para cardinalidades médias
            return raw_estimate
        else:
            # Correção para grandes cardinalidades
            return -2 ** 32 * math.log(1 - raw_estimate / (2 ** 32))
        
        return raw_estimate
    
    def merge(self, other_hll):
        """
        Merge com outro HyperLogLog (deve ter mesma precisão)
        Útil para computação distribuída
        """
        if self.precision != other_hll.precision:
            raise ValueError("HyperLogLog objects must have same precision")
        
        for i in range(self.m):
            self.buckets[i] = max(self.buckets[i], other_hll.buckets[i])
    
    def error_rate(self):
        """Retorna taxa de erro teórica"""
        return 1.04 / math.sqrt(self.m)
    
    def memory_usage(self):
        """Retorna uso de memória em bytes"""
        # Cada bucket usa aproximadamente 5 bits (valores 0-32)
        return math.ceil(self.m * 5 / 8)
    
    def get_stats(self):
        """Retorna estatísticas do HyperLogLog"""
        non_empty_buckets = sum(1 for x in self.buckets if x > 0)
        max_bucket_value = max(self.buckets)
        avg_bucket_value = sum(self.buckets) / len(self.buckets)
        
        return {
            'precision': self.precision,
            'num_buckets': self.m,
            'non_empty_buckets': non_empty_buckets,
            'max_bucket_value': max_bucket_value,
            'avg_bucket_value': avg_bucket_value,
            'estimated_cardinality': self.cardinality(),
            'theoretical_error_rate': self.error_rate(),
            'memory_usage_bytes': self.memory_usage()
        }

# Exemplo de uso e comparação
def test_hyperloglog():
    """Testa HyperLogLog com diferentes precisões"""
    import random
    import time
    
    # Gerar dados de teste
    true_cardinality = 100000
    data = set()
    
    print("Gerando dados de teste...")
    while len(data) < true_cardinality:
        data.add(f"item_{random.randint(1, true_cardinality * 2)}")
    
    print(f"Cardinalidade real: {len(data)}")
    
    # Testar diferentes precisões
    precisions = [8, 10, 12, 14]
    
    for precision in precisions:
        print(f"\nTestando precisão {precision}:")
        
        hll = HyperLogLog(precision=precision)
        
        start_time = time.time()
        for item in data:
            hll.add(item)
        end_time = time.time()
        
        estimated = hll.cardinality()
        error = abs(estimated - len(data)) / len(data) * 100
        
        stats = hll.get_stats()
        
        print(f"  Cardinalidade estimada: {estimated:.0f}")
        print(f"  Erro: {error:.2f}%")
        print(f"  Erro teórico: {stats['theoretical_error_rate']*100:.2f}%")
        print(f"  Memória usada: {stats['memory_usage_bytes']} bytes")
        print(f"  Tempo: {end_time - start_time:.3f}s")

if __name__ == "__main__":
    test_hyperloglog()
```

### HyperLogLog++ (Melhoramento do Google)

```python
class HyperLogLogPlusPlus(HyperLogLog):
    def __init__(self, precision=10):
        super().__init__(precision)
        self.sparse_list = {}  # Para representação esparsa
        self.sparse_mode = True
        self.sparse_threshold = self.m // 6
    
    def add(self, item):
        """Versão otimizada que usa representação esparsa inicialmente"""
        h = self._hash(item)
        bucket_index = h & ((1 << self.precision) - 1)
        remaining_bits = h >> self.precision
        leading_zeros = self._leading_zeros(remaining_bits, 32 - self.precision) + 1
        
        if self.sparse_mode:
            # Modo esparso: armazenar apenas buckets não-zero
            current_value = self.sparse_list.get(bucket_index, 0)
            if leading_zeros > current_value:
                self.sparse_list[bucket_index] = leading_zeros
                
                # Verificar se deve mudar para modo denso
                if len(self.sparse_list) > self.sparse_threshold:
                    self._convert_to_dense()
        else:
            # Modo denso: usar array normal
            self.buckets[bucket_index] = max(self.buckets[bucket_index], leading_zeros)
    
    def _convert_to_dense(self):
        """Converte de representação esparsa para densa"""
        self.buckets = [0] * self.m
        for bucket_index, value in self.sparse_list.items():
            self.buckets[bucket_index] = value
        
        self.sparse_mode = False
        self.sparse_list = {}
    
    def cardinality(self):
        """Cardinalidade com correções do HLL++"""
        if self.sparse_mode:
            # Converter temporariamente para calcular
            temp_buckets = [0] * self.m
            for bucket_index, value in self.sparse_list.items():
                temp_buckets[bucket_index] = value
            
            # Usar correção melhorada para pequenas cardinalidades
            empty_buckets = sum(1 for x in temp_buckets if x == 0)
            if empty_buckets > 0:
                return self._small_range_correction(temp_buckets)
        
        return super().cardinality()
    
    def _small_range_correction(self, buckets):
        """Correção melhorada para pequenas cardinalidades"""
        raw_estimate = self.alpha * (self.m ** 2) / sum(2 ** (-x) for x in buckets)
        
        if raw_estimate <= 5 * self.m:
            empty_buckets = buckets.count(0)
            if empty_buckets != 0:
                return self.m * math.log(self.m / empty_buckets)
        
        return raw_estimate
    
    def memory_usage(self):
        """Uso de memória considerando modo esparso/denso"""
        if self.sparse_mode:
            # Cada entrada esparsa: 4 bytes (índice) + 1 byte (valor)
            return len(self.sparse_list) * 5
        else:
            return super().memory_usage()
```

## Aplicações Práticas

### Sistema de Cache Distribuído
```python
class DistributedCache:
    def __init__(self, cache_size=1000):
        self.cache = {}
        self.cache_size = cache_size
        self.bloom_filter = BloomFilter(expected_items=cache_size * 2)
        self.access_log = HyperLogLog(precision=12)
    
    def get(self, key):
        """Busca item no cache"""
        self.access_log.add(key)
        
        # Verificar bloom filter primeiro (evita buscas desnecessárias)
        if not self.bloom_filter.contains(key):
            return None
        
        return self.cache.get(key)
    
    def put(self, key, value):
        """Adiciona item ao cache"""
        if len(self.cache) >= self.cache_size:
            # Remove item aleatório se cache cheio
            old_key = next(iter(self.cache))
            del self.cache[old_key]
        
        self.cache[key] = value
        self.bloom_filter.add(key)
        self.access_log.add(key)
    
    def get_stats(self):
        """Estatísticas do cache"""
        return {
            'cache_size': len(self.cache),
            'estimated_unique_accesses': self.access_log.cardinality(),
            'bloom_filter_stats': self.bloom_filter.get_stats()
        }
```

### Análise de Logs Web
```python
class WebLogAnalyzer:
    def __init__(self):
        self.unique_ips = HyperLogLog(precision=12)
        self.unique_users = HyperLogLog(precision=12)
        self.seen_urls = BloomFilter(expected_items=100000)
        self.suspicious_ips = BloomFilter(expected_items=10000)
    
    def process_log_entry(self, ip, user_id, url, timestamp):
        """Processa entrada de log"""
        # Contar IPs únicos
        self.unique_ips.add(ip)
        
        # Contar usuários únicos
        if user_id:
            self.unique_users.add(user_id)
        
        # Verificar se URL já foi vista
        url_seen_before = self.seen_urls.contains(url)
        self.seen_urls.add(url)
        
        # Verificar se IP é suspeito
        is_suspicious = self.suspicious_ips.contains(ip)
        
        return {
            'new_url': not url_seen_before,
            'suspicious_ip': is_suspicious
        }
    
    def add_suspicious_ip(self, ip):
        """Adiciona IP à lista de suspeitos"""
        self.suspicious_ips.add(ip)
    
    def get_analytics(self):
        """Retorna análises do log"""
        return {
            'estimated_unique_ips': self.unique_ips.cardinality(),
            'estimated_unique_users': self.unique_users.cardinality(),
            'unique_ips_memory': self.unique_ips.memory_usage(),
            'unique_users_memory': self.unique_users.memory_usage(),
            'seen_urls_stats': self.seen_urls.get_stats()
        }
```

## Comparação de Performance

### Benchmarks
```python
import time
import random
import sys

def benchmark_data_structures():
    """Compara diferentes estruturas para membership testing"""
    
    # Configurações
    data_sizes = [1000, 10000, 100000, 1000000]
    test_queries = 10000
    
    print("Estrutura\t\tTamanho\t\tMemória (MB)\tTempo Add (s)\tTempo Query (s)\tPrecisão")
    print("-" * 100)
    
    for size in data_sizes:
        # Gerar dados
        data = [f"item_{i}" for i in range(size)]
        query_data = data[:test_queries//2] + [f"missing_{i}" for i in range(test_queries//2)]
        random.shuffle(query_data)
        
        # 1. Set nativo do Python
        start_time = time.time()
        python_set = set()
        for item in data:
            python_set.add(item)
        add_time = time.time() - start_time
        
        start_time = time.time()
        results = [item in python_set for item in query_data]
        query_time = time.time() - start_time
        
        memory_mb = sys.getsizeof(python_set) / (1024 * 1024)
        accuracy = sum(1 for i, item in enumerate(query_data) 
                      if (item in python_set) == (i < test_queries//2)) / test_queries
        
        print(f"Python Set\t\t{size}\t\t{memory_mb:.2f}\t\t{add_time:.3f}\t\t{query_time:.3f}\t\t{accuracy:.3f}")
        
        # 2. Bloom Filter
        start_time = time.time()
        bf = BloomFilter(expected_items=size, false_positive_rate=0.01)
        for item in data:
            bf.add(item)
        add_time = time.time() - start_time
        
        start_time = time.time()
        results = [bf.contains(item) for item in query_data]
        query_time = time.time() - start_time
        
        memory_mb = bf.size / 8 / (1024 * 1024)  # bits to MB
        
        # Calcular precisão (considerando falsos positivos)
        true_positives = sum(1 for i, item in enumerate(query_data[:test_queries//2]) 
                           if bf.contains(item))
        false_positives = sum(1 for item in query_data[test_queries//2:] 
                            if bf.contains(item))
        accuracy = (true_positives + (test_queries//2 - false_positives)) / test_queries
        
        print(f"Bloom Filter\t\t{size}\t\t{memory_mb:.2f}\t\t{add_time:.3f}\t\t{query_time:.3f}\t\t{accuracy:.3f}")
        
        # 3. HyperLogLog (apenas cardinalidade)
        start_time = time.time()
        hll = HyperLogLog(precision=12)
        for item in data:
            hll.add(item)
        add_time = time.time() - start_time
        
        cardinality = hll.cardinality()
        memory_mb = hll.memory_usage() / (1024 * 1024)
        cardinality_error = abs(cardinality - size) / size
        
        print(f"HyperLogLog\t\t{size}\t\t{memory_mb:.2f}\t\t{add_time:.3f}\t\tN/A\t\t{1-cardinality_error:.3f}")
        print()

if __name__ == "__main__":
    benchmark_data_structures()
```

## Casos de Uso Específicos

### **Filtro de Bloom**
- **Cache de CDN**: Verificar se conteúdo está em cache antes de buscar
- **Sistemas de BD**: Verificar se registro pode existir antes de busca em disco
- **Web Crawling**: Evitar revisitar URLs já processadas
- **Spam Detection**: Verificar se email está em blacklist
- **Sistemas P2P**: Verificar se peer tem arquivo antes de solicitar

### **HyperLogLog**
- **Analytics Web**: Contar usuários únicos em tempo real
- **Sistemas de BD**: Estimar cardinalidade para otimização de queries
- **Monitoramento**: Contar eventos únicos em logs
- **IoT**: Contar sensores únicos reportando dados
- **Fraud Detection**: Contar dispositivos únicos por usuário

## Limitações e Considerações

### Filtro de Bloom
- **Falsos Positivos**: Taxa cresce com número de elementos
- **Sem Remoção**: Versão básica não permite remoção
- **Tamanho Fixo**: Precisa estimar tamanho antecipadamente
- **Hash Quality**: Depende de boas funções hash

### HyperLogLog
- **Apenas Cardinalidade**: Não armazena elementos reais
- **Erro Probabilístico**: Precisão depende da memória usada
- **Distribuição de Hash**: Requer boa distribuição dos dados
- **Pequenos Conjuntos**: Menos preciso para cardinalidades muito pequenas

## Implementações Otimizadas

### Usando NumPy para Performance
```python
import numpy as np

class FastBloomFilter:
    def __init__(self, expected_items, false_positive_rate=0.01):
        self.size = int(-(expected_items * math.log(false_positive_rate)) / (math.log(2) ** 2))
        self.hash_count = int((self.size / expected_items) * math.log(2))
        self.bit_array = np.zeros(self.size, dtype=np.uint8)
        
    def _hash_functions(self, item):
        """Gera múltiplos hashes de uma vez"""
        h1 = hash(item) & 0xffffffff
        h2 = hash(str(item)[::-1]) & 0xffffffff
        
        indices = []
        for i in range(self.hash_count):
            combined_hash = (h1 + i * h2) % self.size
            indices.append(combined_hash)
        
        return np.array(indices)
    
    def add(self, item):
        indices = self._hash_functions(item)
        self.bit_array[indices] = 1
    
    def contains(self, item):
        indices = self._hash_functions(item)
        return np.all(self.bit_array[indices] == 1)
```

Essas estruturas de dados probabilísticas são fundamentais em sistemas distribuídos modernos, oferecendo trade-offs valiosos entre precisão, memória e performance.
