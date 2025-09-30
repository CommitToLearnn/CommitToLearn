# Hash Índice Invertido para Busca na Web

## O que é um Índice Invertido?

Um índice invertido é uma estrutura de dados que mapeia cada termo único em uma coleção de documentos para uma lista de documentos que contêm esse termo. É a estrutura fundamental por trás dos motores de busca modernos como Google, Bing e Elasticsearch.

## Estrutura Básica

### Conceito
```
Termo → Lista de Documentos que contêm o termo
```

### Exemplo Simples
```
Documentos:
Doc1: "gato subiu no telhado"
Doc2: "cachorro correu no parque"
Doc3: "gato desceu do telhado"

Índice Invertido:
"gato" → [Doc1, Doc3]
"subiu" → [Doc1]
"no" → [Doc1, Doc2]
"telhado" → [Doc1, Doc3]
"cachorro" → [Doc2]
"correu" → [Doc2]
"parque" → [Doc2]
"desceu" → [Doc3]
"do" → [Doc3]
```

## Implementação com Hash Table

### Estrutura de Dados
```python
class InvertedIndex:
    def __init__(self):
        # Hash table: termo → posting list
        self.index = {}
        self.documents = {}
        self.doc_count = 0
    
    def add_document(self, doc_id, content):
        """Adiciona documento ao índice"""
        self.documents[doc_id] = content
        
        # Tokenização e normalização
        terms = self.tokenize(content)
        
        for term in terms:
            if term not in self.index:
                self.index[term] = PostingList()
            
            self.index[term].add_document(doc_id)
    
    def tokenize(self, text):
        """Tokeniza e normaliza o texto"""
        import re
        # Converte para minúsculas e remove pontuação
        text = re.sub(r'[^\w\s]', '', text.lower())
        return text.split()

class PostingList:
    def __init__(self):
        self.documents = []
        self.frequencies = {}
    
    def add_document(self, doc_id):
        if doc_id not in self.frequencies:
            self.documents.append(doc_id)
            self.frequencies[doc_id] = 0
        self.frequencies[doc_id] += 1
```

### Implementação Otimizada
```python
import hashlib
from collections import defaultdict, Counter
import math

class OptimizedInvertedIndex:
    def __init__(self):
        self.index = defaultdict(dict)  # termo → {doc_id: freq}
        self.documents = {}
        self.doc_lengths = {}  # Para normalização TF-IDF
        self.total_docs = 0
    
    def add_document(self, doc_id, content):
        """Adiciona documento com cálculo de TF-IDF"""
        self.documents[doc_id] = content
        self.total_docs += 1
        
        terms = self.tokenize(content)
        term_counts = Counter(terms)
        
        # Armazenar frequências dos termos
        for term, freq in term_counts.items():
            self.index[term][doc_id] = freq
        
        # Calcular comprimento do documento para normalização
        self.doc_lengths[doc_id] = math.sqrt(sum(freq**2 for freq in term_counts.values()))
    
    def search(self, query, top_k=10):
        """Busca usando TF-IDF scoring"""
        query_terms = self.tokenize(query)
        
        if not query_terms:
            return []
        
        # Calcular scores para cada documento
        doc_scores = defaultdict(float)
        
        for term in query_terms:
            if term in self.index:
                # IDF (Inverse Document Frequency)
                df = len(self.index[term])  # Document frequency
                idf = math.log(self.total_docs / df)
                
                for doc_id, tf in self.index[term].items():
                    # TF-IDF score
                    tf_idf = (tf / self.doc_lengths[doc_id]) * idf
                    doc_scores[doc_id] += tf_idf
        
        # Ordenar por score e retornar top-k
        results = sorted(doc_scores.items(), key=lambda x: x[1], reverse=True)
        return results[:top_k]
    
    def boolean_search(self, query):
        """Busca booleana AND/OR/NOT"""
        # Parser simples para operadores booleanos
        if ' AND ' in query:
            terms = query.split(' AND ')
            return self._intersect_terms(terms)
        elif ' OR ' in query:
            terms = query.split(' OR ')
            return self._union_terms(terms)
        else:
            # Busca simples
            term = query.strip().lower()
            return list(self.index.get(term, {}).keys())
    
    def _intersect_terms(self, terms):
        """Interseção de posting lists (AND)"""
        if not terms:
            return []
        
        # Começar com documentos do primeiro termo
        result_docs = set(self.index.get(terms[0].strip().lower(), {}).keys())
        
        # Interseção com outros termos
        for term in terms[1:]:
            term_docs = set(self.index.get(term.strip().lower(), {}).keys())
            result_docs = result_docs.intersection(term_docs)
        
        return list(result_docs)
    
    def _union_terms(self, terms):
        """União de posting lists (OR)"""
        result_docs = set()
        
        for term in terms:
            term_docs = set(self.index.get(term.strip().lower(), {}).keys())
            result_docs = result_docs.union(term_docs)
        
        return list(result_docs)
```

## Otimizações de Hash

### Hash Function para Termos
```python
class HashOptimizedIndex:
    def __init__(self, bucket_size=1000000):
        self.bucket_size = bucket_size
        self.buckets = [[] for _ in range(bucket_size)]
    
    def hash_term(self, term):
        """Hash function otimizada para termos"""
        # Usar hash robusto para distribuição uniforme
        return hash(term) % self.bucket_size
    
    def add_term(self, term, doc_id, frequency):
        """Adiciona termo ao bucket correto"""
        bucket_idx = self.hash_term(term)
        
        # Buscar se termo já existe no bucket
        for i, (existing_term, posting_list) in enumerate(self.buckets[bucket_idx]):
            if existing_term == term:
                posting_list[doc_id] = frequency
                return
        
        # Novo termo
        self.buckets[bucket_idx].append((term, {doc_id: frequency}))
```

### Compressão de Posting Lists
```python
import struct

class CompressedPostingList:
    def __init__(self):
        self.docs = []
        self.compressed = None
    
    def add_document(self, doc_id):
        if doc_id not in self.docs:
            self.docs.append(doc_id)
            self.docs.sort()  # Manter ordenado para delta encoding
    
    def compress(self):
        """Comprime usando delta encoding"""
        if not self.docs:
            return b''
        
        compressed = []
        prev_doc = 0
        
        for doc_id in self.docs:
            delta = doc_id - prev_doc
            compressed.append(delta)
            prev_doc = doc_id
        
        # Usar variable byte encoding
        return self._variable_byte_encode(compressed)
    
    def _variable_byte_encode(self, numbers):
        """Variable byte encoding para compressão"""
        result = bytearray()
        
        for num in numbers:
            bytes_needed = []
            
            while num >= 128:
                bytes_needed.append(num % 128)
                num //= 128
            
            # Último byte com bit de continuação
            bytes_needed.append(num + 128)
            
            result.extend(reversed(bytes_needed))
        
        return bytes(result)
```

## Estruturas Avançadas

### Skip Lists para Posting Lists
```python
import random

class SkipListNode:
    def __init__(self, doc_id, level):
        self.doc_id = doc_id
        self.forward = [None] * (level + 1)

class SkipListPostingList:
    def __init__(self, max_level=16):
        self.max_level = max_level
        self.header = SkipListNode(-1, max_level)
        self.level = 0
    
    def random_level(self):
        level = 0
        while random.random() < 0.5 and level < self.max_level:
            level += 1
        return level
    
    def insert(self, doc_id):
        update = [None] * (self.max_level + 1)
        current = self.header
        
        # Encontrar posição de inserção
        for i in range(self.level, -1, -1):
            while (current.forward[i] and 
                   current.forward[i].doc_id < doc_id):
                current = current.forward[i]
            update[i] = current
        
        current = current.forward[0]
        
        if current is None or current.doc_id != doc_id:
            new_level = self.random_level()
            
            if new_level > self.level:
                for i in range(self.level + 1, new_level + 1):
                    update[i] = self.header
                self.level = new_level
            
            new_node = SkipListNode(doc_id, new_level)
            
            for i in range(new_level + 1):
                new_node.forward[i] = update[i].forward[i]
                update[i].forward[i] = new_node
    
    def intersect(self, other):
        """Interseção eficiente de duas skip lists"""
        result = []
        p1 = self.header.forward[0]
        p2 = other.header.forward[0]
        
        while p1 and p2:
            if p1.doc_id == p2.doc_id:
                result.append(p1.doc_id)
                p1 = p1.forward[0]
                p2 = p2.forward[0]
            elif p1.doc_id < p2.doc_id:
                p1 = p1.forward[0]
            else:
                p2 = p2.forward[0]
        
        return result
```

### Bloom Filters para Pré-filtro
```python
import hashlib
import math

class BloomFilter:
    def __init__(self, expected_items, false_positive_rate=0.01):
        self.size = self._calculate_size(expected_items, false_positive_rate)
        self.hash_count = self._calculate_hash_count(self.size, expected_items)
        self.bit_array = [0] * self.size
    
    def _calculate_size(self, n, p):
        """Calcula tamanho ótimo do bit array"""
        return int(-n * math.log(p) / (math.log(2) ** 2))
    
    def _calculate_hash_count(self, m, n):
        """Calcula número ótimo de hash functions"""
        return int(m / n * math.log(2))
    
    def _hash(self, item, seed):
        """Gera hash com seed"""
        return int(hashlib.md5(f"{item}{seed}".encode()).hexdigest(), 16) % self.size
    
    def add(self, item):
        """Adiciona item ao bloom filter"""
        for i in range(self.hash_count):
            index = self._hash(item, i)
            self.bit_array[index] = 1
    
    def contains(self, item):
        """Verifica se item pode estar no conjunto"""
        for i in range(self.hash_count):
            index = self._hash(item, i)
            if self.bit_array[index] == 0:
                return False
        return True

class BloomFilterIndex:
    def __init__(self):
        self.index = {}
        self.bloom_filters = {}
    
    def add_document(self, doc_id, content):
        terms = content.lower().split()
        
        # Criar bloom filter para o documento
        bf = BloomFilter(len(terms))
        for term in terms:
            bf.add(term)
        
        self.bloom_filters[doc_id] = bf
        
        # Adicionar ao índice invertido normal
        for term in terms:
            if term not in self.index:
                self.index[term] = []
            self.index[term].append(doc_id)
    
    def search_with_bloom(self, query):
        """Busca usando bloom filter como pré-filtro"""
        query_terms = query.lower().split()
        
        # Pré-filtrar documentos usando bloom filter
        candidate_docs = []
        for doc_id, bf in self.bloom_filters.items():
            if all(bf.contains(term) for term in query_terms):
                candidate_docs.append(doc_id)
        
        # Verificação exata nos candidatos
        result_docs = []
        for doc_id in candidate_docs:
            # Verificar se todos os termos estão realmente no documento
            if all(doc_id in self.index.get(term, []) for term in query_terms):
                result_docs.append(doc_id)
        
        return result_docs
```

## Aplicações em Motores de Busca

### Google-style Search Engine
```python
class WebSearchEngine:
    def __init__(self):
        self.inverted_index = OptimizedInvertedIndex()
        self.page_rank = {}
        self.link_graph = {}
    
    def index_web_page(self, url, content, links):
        """Indexa página web com PageRank"""
        doc_id = self._url_to_doc_id(url)
        
        # Extrair e processar texto
        text_content = self._extract_text(content)
        self.inverted_index.add_document(doc_id, text_content)
        
        # Armazenar links para PageRank
        self.link_graph[doc_id] = links
    
    def search(self, query, max_results=20):
        """Busca combinando TF-IDF com PageRank"""
        # Busca textual
        text_results = self.inverted_index.search(query, max_results * 2)
        
        # Combinar com PageRank
        final_scores = []
        for doc_id, text_score in text_results:
            pagerank_score = self.page_rank.get(doc_id, 0.1)
            combined_score = 0.7 * text_score + 0.3 * pagerank_score
            final_scores.append((doc_id, combined_score))
        
        # Ordenar e retornar
        final_scores.sort(key=lambda x: x[1], reverse=True)
        return final_scores[:max_results]
    
    def calculate_pagerank(self, iterations=50, damping=0.85):
        """Algoritmo PageRank simplificado"""
        docs = list(self.link_graph.keys())
        n = len(docs)
        
        # Inicializar PageRank
        for doc in docs:
            self.page_rank[doc] = 1.0 / n
        
        # Iterações do PageRank
        for _ in range(iterations):
            new_ranks = {}
            
            for doc in docs:
                rank_sum = 0
                
                # Somar contribuições de documentos que apontam para este
                for other_doc, links in self.link_graph.items():
                    if doc in links:
                        out_degree = len(links) if links else 1
                        rank_sum += self.page_rank[other_doc] / out_degree
                
                new_ranks[doc] = (1 - damping) / n + damping * rank_sum
            
            self.page_rank = new_ranks
```

### Elasticsearch-style Distributed Index
```python
import hashlib
import json

class DistributedInvertedIndex:
    def __init__(self, num_shards=3):
        self.num_shards = num_shards
        self.shards = [OptimizedInvertedIndex() for _ in range(num_shards)]
    
    def _get_shard(self, doc_id):
        """Determina shard baseado no hash do doc_id"""
        return int(hashlib.md5(str(doc_id).encode()).hexdigest(), 16) % self.num_shards
    
    def add_document(self, doc_id, content):
        """Adiciona documento ao shard apropriado"""
        shard_idx = self._get_shard(doc_id)
        self.shards[shard_idx].add_document(doc_id, content)
    
    def search(self, query, top_k=10):
        """Busca distribuída em todos os shards"""
        all_results = []
        
        # Buscar em paralelo em todos os shards
        for shard in self.shards:
            shard_results = shard.search(query, top_k)
            all_results.extend(shard_results)
        
        # Combinar e re-rankar resultados
        all_results.sort(key=lambda x: x[1], reverse=True)
        return all_results[:top_k]
    
    def get_statistics(self):
        """Estatísticas do índice distribuído"""
        stats = {
            'total_docs': sum(shard.total_docs for shard in self.shards),
            'total_terms': sum(len(shard.index) for shard in self.shards),
            'shard_distribution': [shard.total_docs for shard in self.shards]
        }
        return stats
```

## Performance e Otimizações

### Benchmarks Típicos
| Operação | Complexidade | Tempo (1M docs) |
|----------|--------------|-----------------|
| Inserção | O(1) average | ~0.1ms |
| Busca simples | O(1) + O(k) | ~1ms |
| Busca AND | O(min(n1,n2)) | ~5ms |
| Busca OR | O(n1+n2) | ~10ms |

### Otimizações de Memória
```python
class MemoryOptimizedIndex:
    def __init__(self, use_disk_cache=True):
        self.hot_terms = {}  # Termos frequentes em memória
        self.cold_storage = {}  # Termos raros em disco
        self.access_counts = {}
        self.use_disk_cache = use_disk_cache
    
    def add_term(self, term, doc_id, frequency):
        """Adiciona termo com gestão de cache quente/frio"""
        if term in self.hot_terms:
            self.hot_terms[term][doc_id] = frequency
            self.access_counts[term] += 1
        else:
            # Verificar se deve promover para cache quente
            if self.access_counts.get(term, 0) > 10:
                self._promote_to_hot(term)
                self.hot_terms[term][doc_id] = frequency
            else:
                if self.use_disk_cache:
                    self._store_to_disk(term, doc_id, frequency)
                else:
                    if term not in self.cold_storage:
                        self.cold_storage[term] = {}
                    self.cold_storage[term][doc_id] = frequency
```

## Considerações de Escalabilidade

### Particionamento Horizontal
- **Por termo**: Distribuir termos entre servidores
- **Por documento**: Distribuir documentos entre servidores
- **Híbrido**: Combinação das duas abordagens

### Replicação
- **Master-Slave**: Um write master, múltiplos read slaves
- **Multi-Master**: Múltiplos write masters com sincronização
- **Sharding com Replica**: Cada shard replicado

### Cache Strategies
- **LRU Cache**: Para termos mais acessados
- **Bloom Filters**: Para reduzir buscas desnecessárias
- **Pré-computação**: Resultados de queries populares

## Ferramentas e Frameworks

### Open Source
- **Elasticsearch**: Motor de busca distribuído
- **Apache Solr**: Plataforma de busca enterprise
- **Whoosh**: Biblioteca Python pura
- **Xapian**: Biblioteca C++ de busca

### Comerciais
- **Amazon CloudSearch**: Serviço de busca AWS
- **Azure Cognitive Search**: Serviço Microsoft
- **Google Cloud Search**: Plataforma Google

## Exercícios Práticos

### Mini Search Engine
Implementar motor de busca completo para coleção de documentos

### Log Search System
Sistema de busca em logs com indexação em tempo real

### E-commerce Search
Busca de produtos com filtros e facetas

### Auto-complete System
Sistema de auto-completar usando tries e índices invertidos
