# SimHash

## O que é SimHash?

SimHash é um algoritmo de hash sensível à localidade (locality-sensitive hashing) desenvolvido por Moses Charikar em 2002. É especialmente útil para detectar documentos similares ou near-duplicates, sendo amplamente usado em motores de busca, detecção de spam e sistemas de recomendação.

## Princípio Fundamental

Diferente de hashes criptográficos tradicionais, o SimHash tem a propriedade de que **documentos similares produzem hashes similares**. A distância de Hamming entre dois SimHashes é proporcional à dissimilaridade dos documentos originais.

### Propriedades Chave
- **Locality-Sensitive**: Documentos similares → hashes similares
- **Tamanho Fixo**: Sempre produz hash de tamanho fixo (geralmente 64 bits)
- **Eficiência**: Computação rápida O(n) onde n é o tamanho do documento
- **Comparação Rápida**: Distância calculada via XOR e contagem de bits

## Algoritmo SimHash

### Processo Básico
```
- Extrair features do documento (palavras, n-gramas, etc.)
- Para cada feature:
   a. Calcular hash criptográfico (ex: MD5, SHA-1)
   b. Converter para vetor binário
   c. Aplicar peso da feature
- Somar todos os vetores ponderados
- Converter resultado para hash binário final
```

### Implementação Completa

```python
import hashlib
import re
from collections import Counter, defaultdict
from typing import List, Set, Tuple, Dict, Any

class SimHash:
    def __init__(self, text: str = None, hash_size: int = 64, features: List[str] = None):
        """
        Inicializa SimHash
        
        Args:
            text: Texto para gerar SimHash
            hash_size: Tamanho do hash em bits (padrão 64)
            features: Features pré-extraídas (opcional)
        """
        self.hash_size = hash_size
        self.hash_value = 0
        
        if features:
            self.hash_value = self._compute_hash_from_features(features)
        elif text:
            self.hash_value = self._compute_hash_from_text(text)
    
    def _extract_features(self, text: str) -> Dict[str, int]:
        """
        Extrai features do texto
        Usa palavras individuais com suas frequências
        """
        # Normalizar texto
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)  # Remover pontuação
        
        # Extrair palavras
        words = text.split()
        
        # Filtrar palavras muito curtas
        words = [word for word in words if len(word) > 2]
        
        # Contar frequências
        return dict(Counter(words))
    
    def _extract_ngram_features(self, text: str, n: int = 2) -> Dict[str, int]:
        """
        Extrai n-gramas como features
        Útil para detectar similaridade estrutural
        """
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        
        # Gerar n-gramas de caracteres
        char_ngrams = []
        for i in range(len(text) - n + 1):
            ngram = text[i:i+n]
            if not ngram.isspace():
                char_ngrams.append(ngram)
        
        return dict(Counter(char_ngrams))
    
    def _extract_shingle_features(self, text: str, k: int = 3) -> Dict[str, int]:
        """
        Extrai shingles (k-gramas de palavras) como features
        Útil para detectar similaridade semântica
        """
        words = text.lower().split()
        words = [word for word in words if len(word) > 2]
        
        shingles = []
        for i in range(len(words) - k + 1):
            shingle = ' '.join(words[i:i+k])
            shingles.append(shingle)
        
        return dict(Counter(shingles))
    
    def _hash_feature(self, feature: str) -> int:
        """
        Gera hash de uma feature
        Usa SHA-1 e converte para inteiro
        """
        if isinstance(feature, str):
            feature = feature.encode('utf-8')
        
        # Usar SHA-1 para gerar hash
        sha1_hash = hashlib.sha1(feature).hexdigest()
        
        # Converter para inteiro e limitar ao tamanho do hash
        hash_int = int(sha1_hash, 16)
        return hash_int & ((1 << self.hash_size) - 1)
    
    def _compute_hash_from_features(self, features: Dict[str, int]) -> int:
        """
        Computa SimHash a partir de features ponderadas
        """
        # Vetor de pesos para cada bit
        bit_weights = [0] * self.hash_size
        
        for feature, weight in features.items():
            # Hash da feature
            feature_hash = self._hash_feature(feature)
            
            # Para cada bit no hash
            for i in range(self.hash_size):
                # Se bit é 1, adicionar peso; se 0, subtrair peso
                if (feature_hash >> i) & 1:
                    bit_weights[i] += weight
                else:
                    bit_weights[i] -= weight
        
        # Converter pesos para hash binário final
        final_hash = 0
        for i in range(self.hash_size):
            if bit_weights[i] > 0:
                final_hash |= (1 << i)
        
        return final_hash
    
    def _compute_hash_from_text(self, text: str) -> int:
        """Computa SimHash diretamente do texto"""
        features = self._extract_features(text)
        return self._compute_hash_from_features(features)
    
    def hamming_distance(self, other: 'SimHash') -> int:
        """
        Calcula distância de Hamming entre dois SimHashes
        Número de bits diferentes
        """
        return bin(self.hash_value ^ other.hash_value).count('1')
    
    def similarity(self, other: 'SimHash') -> float:
        """
        Calcula similaridade normalizada (0.0 a 1.0)
        1.0 = idênticos, 0.0 = completamente diferentes
        """
        distance = self.hamming_distance(other)
        return 1.0 - (distance / self.hash_size)
    
    def is_similar(self, other: 'SimHash', threshold: int = 3) -> bool:
        """
        Verifica se dois documentos são similares
        threshold: máxima distância de Hamming para considerar similares
        """
        return self.hamming_distance(other) <= threshold
    
    def to_hex(self) -> str:
        """Converte hash para representação hexadecimal"""
        hex_length = self.hash_size // 4
        return f"{self.hash_value:0{hex_length}x}"
    
    def to_binary(self) -> str:
        """Converte hash para representação binária"""
        return f"{self.hash_value:0{self.hash_size}b}"
    
    def __str__(self) -> str:
        return self.to_hex()
    
    def __repr__(self) -> str:
        return f"SimHash(hash_value={self.hash_value}, hash_size={self.hash_size})"
    
    def __eq__(self, other: 'SimHash') -> bool:
        return self.hash_value == other.hash_value
    
    def __hash__(self) -> int:
        return self.hash_value

# Exemplo de uso básico
def demo_basic_simhash():
    """Demonstração básica do SimHash"""
    
    # Documentos de teste
    doc1 = "O gato subiu no telhado e desceu pela escada"
    doc2 = "O gato subiu no telhado e desceu pela porta"
    doc3 = "O cachorro correu no parque com seu dono"
    doc4 = "Hoje está fazendo muito sol e calor"
    
    # Gerar SimHashes
    hash1 = SimHash(doc1)
    hash2 = SimHash(doc2) 
    hash3 = SimHash(doc3)
    hash4 = SimHash(doc4)
    
    # Comparações
    print("Comparações SimHash:")
    print(f"Doc1: {doc1}")
    print(f"Hash1: {hash1}")
    print()
    
    comparisons = [
        (hash1, hash2, "Doc1 vs Doc2 (similares)"),
        (hash1, hash3, "Doc1 vs Doc3 (diferentes)"),
        (hash1, hash4, "Doc1 vs Doc4 (muito diferentes)")
    ]
    
    for h1, h2, description in comparisons:
        distance = h1.hamming_distance(h2)
        similarity = h1.similarity(h2)
        is_similar = h1.is_similar(h2, threshold=3)
        
        print(f"{description}:")
        print(f"  Distância Hamming: {distance}")
        print(f"  Similaridade: {similarity:.3f}")
        print(f"  São similares: {is_similar}")
        print()

if __name__ == "__main__":
    demo_basic_simhash()
```

### Versão Avançada com Múltiplas Features

```python
class AdvancedSimHash(SimHash):
    def __init__(self, text: str = None, hash_size: int = 64, 
                 use_words: bool = True, use_ngrams: bool = True, 
                 use_shingles: bool = True, ngram_size: int = 2, 
                 shingle_size: int = 3):
        """
        SimHash avançado com múltiplos tipos de features
        
        Args:
            use_words: Usar palavras individuais
            use_ngrams: Usar n-gramas de caracteres
            use_shingles: Usar shingles (n-gramas de palavras)
            ngram_size: Tamanho dos n-gramas
            shingle_size: Tamanho dos shingles
        """
        self.hash_size = hash_size
        self.use_words = use_words
        self.use_ngrams = use_ngrams
        self.use_shingles = use_shingles
        self.ngram_size = ngram_size
        self.shingle_size = shingle_size
        
        if text:
            self.hash_value = self._compute_advanced_hash(text)
        else:
            self.hash_value = 0
    
    def _compute_advanced_hash(self, text: str) -> int:
        """Computa hash usando múltiplos tipos de features"""
        all_features = {}
        
        # Palavras individuais
        if self.use_words:
            word_features = self._extract_features(text)
            for feature, weight in word_features.items():
                all_features[f"word:{feature}"] = weight
        
        # N-gramas de caracteres
        if self.use_ngrams:
            ngram_features = self._extract_ngram_features(text, self.ngram_size)
            for feature, weight in ngram_features.items():
                all_features[f"ngram:{feature}"] = weight * 0.5  # Peso menor
        
        # Shingles (n-gramas de palavras)
        if self.use_shingles:
            shingle_features = self._extract_shingle_features(text, self.shingle_size)
            for feature, weight in shingle_features.items():
                all_features[f"shingle:{feature}"] = weight * 1.5  # Peso maior
        
        return self._compute_hash_from_features(all_features)
    
    def get_feature_importance(self, text: str) -> Dict[str, float]:
        """Analisa importância das diferentes features"""
        word_features = self._extract_features(text) if self.use_words else {}
        ngram_features = self._extract_ngram_features(text, self.ngram_size) if self.use_ngrams else {}
        shingle_features = self._extract_shingle_features(text, self.shingle_size) if self.use_shingles else {}
        
        total_words = sum(word_features.values())
        total_ngrams = sum(ngram_features.values())
        total_shingles = sum(shingle_features.values())
        total_features = total_words + total_ngrams + total_shingles
        
        if total_features == 0:
            return {}
        
        return {
            'words': total_words / total_features,
            'ngrams': total_ngrams / total_features,
            'shingles': total_shingles / total_features
        }
```

## Aplicações Práticas

### Detector de Documentos Duplicados

```python
class DuplicateDetector:
    def __init__(self, threshold: int = 3, hash_size: int = 64):
        """
        Detector de documentos duplicados usando SimHash
        
        Args:
            threshold: Distância máxima para considerar duplicado
            hash_size: Tamanho do hash em bits
        """
        self.threshold = threshold
        self.hash_size = hash_size
        self.documents = {}  # id -> (text, simhash)
        self.hash_index = defaultdict(set)  # hash -> set of doc_ids
    
    def add_document(self, doc_id: str, text: str) -> Dict[str, Any]:
        """
        Adiciona documento e detecta duplicados
        
        Returns:
            Dict com informações sobre duplicados encontrados
        """
        simhash = AdvancedSimHash(text, hash_size=self.hash_size)
        
        # Procurar duplicados
        duplicates = self._find_duplicates(simhash)
        
        # Armazenar documento
        self.documents[doc_id] = {
            'text': text,
            'simhash': simhash,
            'length': len(text),
            'word_count': len(text.split())
        }
        
        # Indexar hash
        self.hash_index[simhash.hash_value].add(doc_id)
        
        return {
            'doc_id': doc_id,
            'simhash': str(simhash),
            'duplicates_found': len(duplicates),
            'duplicate_ids': list(duplicates.keys()),
            'similarities': duplicates
        }
    
    def _find_duplicates(self, target_hash: SimHash) -> Dict[str, float]:
        """Encontra documentos similares ao hash alvo"""
        duplicates = {}
        
        for doc_id, doc_info in self.documents.items():
            stored_hash = doc_info['simhash']
            distance = target_hash.hamming_distance(stored_hash)
            
            if distance <= self.threshold:
                similarity = target_hash.similarity(stored_hash)
                duplicates[doc_id] = similarity
        
        return duplicates
    
    def find_duplicates_fast(self, target_hash: SimHash) -> List[str]:
        """
        Busca rápida de duplicados usando indexação
        Para datasets grandes, usar LSH (Locality Sensitive Hashing)
        """
        candidates = set()
        
        # Verificar hashes exatos
        candidates.update(self.hash_index.get(target_hash.hash_value, set()))
        
        # Para busca aproximada, seria necessário implementar LSH
        # Esta é uma versão simplificada
        
        return list(candidates)
    
    def get_duplicate_clusters(self) -> List[List[str]]:
        """Agrupa documentos em clusters de duplicados"""
        visited = set()
        clusters = []
        
        for doc_id in self.documents:
            if doc_id in visited:
                continue
            
            # Iniciar novo cluster
            cluster = [doc_id]
            visited.add(doc_id)
            
            # Encontrar todos os duplicados deste documento
            doc_hash = self.documents[doc_id]['simhash']
            duplicates = self._find_duplicates(doc_hash)
            
            for dup_id, similarity in duplicates.items():
                if dup_id != doc_id and dup_id not in visited:
                    cluster.append(dup_id)
                    visited.add(dup_id)
            
            if len(cluster) > 1:  # Apenas clusters com duplicados
                clusters.append(cluster)
        
        return clusters
    
    def analyze_collection(self) -> Dict[str, Any]:
        """Analisa coleção completa de documentos"""
        if not self.documents:
            return {}
        
        clusters = self.get_duplicate_clusters()
        total_docs = len(self.documents)
        duplicate_docs = sum(len(cluster) for cluster in clusters)
        unique_docs = total_docs - duplicate_docs
        
        # Estatísticas de similaridade
        similarities = []
        for doc_id in self.documents:
            doc_hash = self.documents[doc_id]['simhash']
            for other_id in self.documents:
                if doc_id != other_id:
                    other_hash = self.documents[other_id]['simhash']
                    sim = doc_hash.similarity(other_hash)
                    similarities.append(sim)
        
        avg_similarity = sum(similarities) / len(similarities) if similarities else 0
        
        return {
            'total_documents': total_docs,
            'unique_documents': unique_docs,
            'duplicate_documents': duplicate_docs,
            'duplicate_clusters': len(clusters),
            'avg_similarity': avg_similarity,
            'largest_cluster_size': max(len(cluster) for cluster in clusters) if clusters else 0,
            'clusters': clusters
        }

# Exemplo de uso
def demo_duplicate_detection():
    """Demonstração do detector de duplicados"""
    
    detector = DuplicateDetector(threshold=3)
    
    # Documentos de teste
    documents = [
        ("doc1", "Python é uma linguagem de programação poderosa e versátil"),
        ("doc2", "Python é uma linguagem de programação poderosa e flexível"),  # Similar
        ("doc3", "Java é uma linguagem orientada a objetos muito popular"),
        ("doc4", "Python é linguagem de programação poderosa e versátil"),  # Quase idêntico
        ("doc5", "Machine learning está revolucionando a tecnologia moderna"),
        ("doc6", "O aprendizado de máquina está transformando a tecnologia atual"),  # Similar
    ]
    
    print("Adicionando documentos e detectando duplicados:")
    print("-" * 50)
    
    # Adicionar documentos
    for doc_id, text in documents:
        result = detector.add_document(doc_id, text)
        print(f"\n{doc_id}: {text}")
        print(f"SimHash: {result['simhash']}")
        if result['duplicates_found'] > 0:
            print(f"Duplicados encontrados: {result['duplicate_ids']}")
            for dup_id, similarity in result['similarities'].items():
                print(f"  {dup_id}: {similarity:.3f}")
    
    # Análise da coleção
    print("\n" + "="*50)
    print("ANÁLISE DA COLEÇÃO")
    print("="*50)
    
    analysis = detector.analyze_collection()
    for key, value in analysis.items():
        if key != 'clusters':
            print(f"{key}: {value}")
    
    print("\nClusters de duplicados:")
    for i, cluster in enumerate(analysis['clusters'], 1):
        print(f"Cluster {i}: {cluster}")

if __name__ == "__main__":
    demo_duplicate_detection()
```

### Sistema de Recomendação Baseado em Conteúdo

```python
class ContentRecommendationSystem:
    def __init__(self, similarity_threshold: float = 0.8):
        """
        Sistema de recomendação baseado em similaridade de conteúdo
        
        Args:
            similarity_threshold: Limiar mínimo de similaridade para recomendar
        """
        self.similarity_threshold = similarity_threshold
        self.items = {}  # item_id -> {text, simhash, metadata}
        self.user_profiles = {}  # user_id -> {liked_items, profile_hash}
    
    def add_item(self, item_id: str, title: str, description: str, 
                 category: str = None, tags: List[str] = None) -> None:
        """Adiciona item ao sistema"""
        
        # Combinar todas as informações textuais
        combined_text = f"{title} {description}"
        if tags:
            combined_text += " " + " ".join(tags)
        
        simhash = AdvancedSimHash(combined_text)
        
        self.items[item_id] = {
            'title': title,
            'description': description,
            'category': category,
            'tags': tags or [],
            'combined_text': combined_text,
            'simhash': simhash
        }
    
    def add_user_interaction(self, user_id: str, item_id: str, 
                           interaction_type: str = 'like') -> None:
        """Registra interação do usuário com item"""
        
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = {
                'liked_items': set(),
                'disliked_items': set(),
                'profile_hash': None
            }
        
        if interaction_type == 'like':
            self.user_profiles[user_id]['liked_items'].add(item_id)
        elif interaction_type == 'dislike':
            self.user_profiles[user_id]['disliked_items'].add(item_id)
        
        # Atualizar perfil do usuário
        self._update_user_profile(user_id)
    
    def _update_user_profile(self, user_id: str) -> None:
        """Atualiza perfil SimHash do usuário baseado em itens curtidos"""
        
        liked_items = self.user_profiles[user_id]['liked_items']
        
        if not liked_items:
            return
        
        # Combinar texto de todos os itens curtidos
        combined_texts = []
        for item_id in liked_items:
            if item_id in self.items:
                combined_texts.append(self.items[item_id]['combined_text'])
        
        if combined_texts:
            user_profile_text = " ".join(combined_texts)
            self.user_profiles[user_id]['profile_hash'] = AdvancedSimHash(user_profile_text)
    
    def get_recommendations(self, user_id: str, num_recommendations: int = 10) -> List[Dict]:
        """Gera recomendações para usuário"""
        
        if user_id not in self.user_profiles:
            return []
        
        user_profile = self.user_profiles[user_id]
        profile_hash = user_profile['profile_hash']
        
        if not profile_hash:
            return []
        
        # Calcular similaridade com todos os itens
        recommendations = []
        liked_items = user_profile['liked_items']
        disliked_items = user_profile['disliked_items']
        
        for item_id, item_info in self.items.items():
            # Pular itens já interagidos
            if item_id in liked_items or item_id in disliked_items:
                continue
            
            similarity = profile_hash.similarity(item_info['simhash'])
            
            if similarity >= self.similarity_threshold:
                recommendations.append({
                    'item_id': item_id,
                    'title': item_info['title'],
                    'similarity': similarity,
                    'category': item_info['category'],
                    'tags': item_info['tags']
                })
        
        # Ordenar por similaridade e retornar top-N
        recommendations.sort(key=lambda x: x['similarity'], reverse=True)
        return recommendations[:num_recommendations]
    
    def find_similar_items(self, item_id: str, num_similar: int = 5) -> List[Dict]:
        """Encontra itens similares a um item específico"""
        
        if item_id not in self.items:
            return []
        
        target_item = self.items[item_id]
        target_hash = target_item['simhash']
        
        similar_items = []
        
        for other_id, other_info in self.items.items():
            if other_id == item_id:
                continue
            
            similarity = target_hash.similarity(other_info['simhash'])
            
            similar_items.append({
                'item_id': other_id,
                'title': other_info['title'],
                'similarity': similarity,
                'category': other_info['category']
            })
        
        # Ordenar por similaridade
        similar_items.sort(key=lambda x: x['similarity'], reverse=True)
        return similar_items[:num_similar]
    
    def analyze_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Analisa preferências do usuário"""
        
        if user_id not in self.user_profiles:
            return {}
        
        liked_items = self.user_profiles[user_id]['liked_items']
        
        # Estatísticas por categoria
        category_counts = {}
        tag_counts = {}
        
        for item_id in liked_items:
            if item_id in self.items:
                item = self.items[item_id]
                
                # Contar categorias
                category = item['category']
                if category:
                    category_counts[category] = category_counts.get(category, 0) + 1
                
                # Contar tags
                for tag in item['tags']:
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        return {
            'total_liked_items': len(liked_items),
            'favorite_categories': sorted(category_counts.items(), 
                                        key=lambda x: x[1], reverse=True),
            'favorite_tags': sorted(tag_counts.items(), 
                                  key=lambda x: x[1], reverse=True)[:10]
        }

# Exemplo de uso
def demo_recommendation_system():
    """Demonstração do sistema de recomendação"""
    
    rec_system = ContentRecommendationSystem(similarity_threshold=0.6)
    
    # Adicionar itens
    items_data = [
        ("item1", "Aprendizado de Python", "Curso completo de Python para iniciantes", "Programação", ["python", "curso", "iniciante"]),
        ("item2", "Machine Learning com Python", "Introdução ao ML usando Python e scikit-learn", "IA", ["python", "machine-learning", "ia"]),
        ("item3", "Desenvolvimento Web Django", "Criando aplicações web com Django framework", "Web", ["django", "web", "python"]),
        ("item4", "JavaScript Moderno", "ES6+ e desenvolvimento frontend", "Web", ["javascript", "frontend", "es6"]),
        ("item5", "Deep Learning TensorFlow", "Redes neurais profundas com TensorFlow", "IA", ["tensorflow", "deep-learning", "ia"]),
        ("item6", "React para Iniciantes", "Desenvolvimento frontend com React", "Web", ["react", "frontend", "javascript"]),
        ("item7", "Análise de Dados Python", "Pandas, NumPy e visualização de dados", "Dados", ["python", "pandas", "dados"]),
        ("item8", "Algoritmos e Estruturas", "Algoritmos fundamentais em Python", "Programação", ["algoritmos", "python", "estruturas"]),
    ]
    
    for item_data in items_data:
        rec_system.add_item(*item_data)
    
    # Simular interações do usuário
    user_id = "user123"
    
    # Usuário gosta de itens relacionados a Python e IA
    rec_system.add_user_interaction(user_id, "item1", "like")  # Python básico
    rec_system.add_user_interaction(user_id, "item2", "like")  # ML Python
    rec_system.add_user_interaction(user_id, "item7", "like")  # Análise dados
    rec_system.add_user_interaction(user_id, "item4", "dislike")  # JavaScript
    
    print("SISTEMA DE RECOMENDAÇÃO - DEMO")
    print("=" * 40)
    
    # Analisar preferências
    preferences = rec_system.analyze_user_preferences(user_id)
    print(f"\nPreferências do {user_id}:")
    print(f"Itens curtidos: {preferences['total_liked_items']}")
    print(f"Categorias favoritas: {preferences['favorite_categories']}")
    print(f"Tags favoritas: {preferences['favorite_tags']}")
    
    # Gerar recomendações
    recommendations = rec_system.get_recommendations(user_id, num_recommendations=5)
    print(f"\nRecomendações para {user_id}:")
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec['title']} (similaridade: {rec['similarity']:.3f})")
        print(f"   Categoria: {rec['category']}, Tags: {rec['tags']}")
    
    # Encontrar itens similares
    print(f"\nItens similares ao 'Machine Learning com Python':")
    similar_items = rec_system.find_similar_items("item2", num_similar=3)
    for item in similar_items:
        print(f"- {item['title']} (similaridade: {item['similarity']:.3f})")

if __name__ == "__main__":
    demo_recommendation_system()
```

### Web Crawler com Detecção de Conteúdo Duplicado

```python
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import time
from collections import deque

class WebCrawlerWithDeduplication:
    def __init__(self, similarity_threshold: int = 3, delay: float = 1.0):
        """
        Web crawler que detecta e evita conteúdo duplicado
        
        Args:
            similarity_threshold: Distância máxima para considerar duplicado
            delay: Delay entre requisições (segundos)
        """
        self.similarity_threshold = similarity_threshold
        self.delay = delay
        
        self.visited_urls = set()
        self.content_hashes = {}  # url -> simhash
        self.duplicate_groups = defaultdict(list)  # hash -> [urls]
        self.crawl_queue = deque()
        
        # Estatísticas
        self.stats = {
            'pages_crawled': 0,
            'duplicates_found': 0,
            'unique_content': 0,
            'errors': 0
        }
    
    def extract_text_content(self, html: str) -> str:
        """Extrai texto limpo do HTML"""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Remover scripts e styles
            for element in soup(['script', 'style', 'nav', 'footer', 'header']):
                element.decompose()
            
            # Extrair texto
            text = soup.get_text()
            
            # Limpar texto
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            return text
        
        except Exception as e:
            print(f"Erro ao extrair texto: {e}")
            return ""
    
    def is_duplicate_content(self, content: str) -> Tuple[bool, List[str]]:
        """Verifica se conteúdo é duplicado"""
        content_hash = AdvancedSimHash(content)
        
        duplicates = []
        for url, stored_hash in self.content_hashes.items():
            distance = content_hash.hamming_distance(stored_hash)
            if distance <= self.similarity_threshold:
                duplicates.append(url)
        
        return len(duplicates) > 0, duplicates
    
    def crawl_url(self, url: str) -> Dict[str, Any]:
        """Crawl de uma URL específica"""
        if url in self.visited_urls:
            return {'status': 'already_visited', 'url': url}
        
        try:
            # Fazer requisição
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            # Extrair conteúdo
            content = self.extract_text_content(response.text)
            
            if not content or len(content) < 100:  # Conteúdo muito pequeno
                return {'status': 'insufficient_content', 'url': url}
            
            # Verificar duplicação
            is_duplicate, duplicate_urls = self.is_duplicate_content(content)
            
            # Gerar SimHash
            content_hash = AdvancedSimHash(content)
            
            # Armazenar
            self.visited_urls.add(url)
            self.content_hashes[url] = content_hash
            
            # Atualizar estatísticas
            self.stats['pages_crawled'] += 1
            
            if is_duplicate:
                self.stats['duplicates_found'] += 1
                # Agrupar duplicados
                hash_key = str(content_hash)
                self.duplicate_groups[hash_key].append(url)
                for dup_url in duplicate_urls:
                    if dup_url not in self.duplicate_groups[hash_key]:
                        self.duplicate_groups[hash_key].append(dup_url)
            else:
                self.stats['unique_content'] += 1
            
            # Extrair links para continuar crawling
            soup = BeautifulSoup(response.text, 'html.parser')
            links = []
            for link in soup.find_all('a', href=True):
                absolute_url = urljoin(url, link['href'])
                if self._is_valid_url(absolute_url) and absolute_url not in self.visited_urls:
                    links.append(absolute_url)
            
            return {
                'status': 'success',
                'url': url,
                'content_length': len(content),
                'simhash': str(content_hash),
                'is_duplicate': is_duplicate,
                'duplicate_urls': duplicate_urls,
                'links_found': len(links),
                'links': links[:10]  # Primeiros 10 links
            }
        
        except Exception as e:
            self.stats['errors'] += 1
            return {'status': 'error', 'url': url, 'error': str(e)}
    
    def _is_valid_url(self, url: str) -> bool:
        """Valida se URL deve ser crawled"""
        try:
            parsed = urlparse(url)
            return (parsed.scheme in ['http', 'https'] and 
                   parsed.netloc and 
                   not any(ext in url.lower() for ext in ['.pdf', '.jpg', '.png', '.gif', '.zip']))
        except:
            return False
    
    def crawl_website(self, start_url: str, max_pages: int = 50, 
                     same_domain_only: bool = True) -> Dict[str, Any]:
        """Crawl completo de um website"""
        
        start_domain = urlparse(start_url).netloc
        self.crawl_queue.append(start_url)
        
        results = []
        pages_crawled = 0
        
        print(f"Iniciando crawl de {start_url}")
        print(f"Máximo de páginas: {max_pages}")
        print("-" * 50)
        
        while self.crawl_queue and pages_crawled < max_pages:
            current_url = self.crawl_queue.popleft()
            
            # Verificar domínio se necessário
            if same_domain_only:
                current_domain = urlparse(current_url).netloc
                if current_domain != start_domain:
                    continue
            
            print(f"Crawling: {current_url}")
            
            # Crawl da página
            result = self.crawl_url(current_url)
            results.append(result)
            
            if result['status'] == 'success':
                pages_crawled += 1
                
                # Adicionar novos links à queue
                for link in result.get('links', []):
                    if link not in self.visited_urls and link not in self.crawl_queue:
                        self.crawl_queue.append(link)
                
                print(f"  Status: {result['status']}")
                print(f"  Conteúdo: {result['content_length']} chars")
                print(f"  Duplicado: {result['is_duplicate']}")
                print(f"  Links encontrados: {result['links_found']}")
            else:
                print(f"  Status: {result['status']}")
            
            print()
            
            # Delay entre requisições
            time.sleep(self.delay)
        
        return {
            'total_results': len(results),
            'successful_crawls': pages_crawled,
            'statistics': self.stats,
            'duplicate_groups': dict(self.duplicate_groups),
            'results': results
        }
    
    def get_duplicate_report(self) -> Dict[str, Any]:
        """Gera relatório de conteúdo duplicado"""
        duplicate_groups = []
        
        for hash_key, urls in self.duplicate_groups.items():
            if len(urls) > 1:
                # Calcular similaridades entre URLs do grupo
                similarities = {}
                for i, url1 in enumerate(urls):
                    for url2 in urls[i+1:]:
                        if url1 in self.content_hashes and url2 in self.content_hashes:
                            sim = self.content_hashes[url1].similarity(self.content_hashes[url2])
                            similarities[f"{url1} <-> {url2}"] = sim
                
                duplicate_groups.append({
                    'hash': hash_key,
                    'urls': urls,
                    'count': len(urls),
                    'similarities': similarities
                })
        
        return {
            'total_duplicate_groups': len(duplicate_groups),
            'total_duplicate_pages': sum(group['count'] for group in duplicate_groups),
            'groups': duplicate_groups
        }

# Exemplo de uso
def demo_web_crawler():
    """Demonstração do web crawler com detecção de duplicados"""
    
    crawler = WebCrawlerWithDeduplication(similarity_threshold=3, delay=0.5)
    
    # URL de exemplo (substitua por uma real)
    start_url = "https://example.com"
    
    print("WEB CRAWLER COM DETECÇÃO DE DUPLICADOS")
    print("=" * 50)
    
    # Executar crawl
    crawl_results = crawler.crawl_website(
        start_url=start_url,
        max_pages=10,
        same_domain_only=True
    )
    
    # Mostrar estatísticas
    print("\nESTATÍSTICAS FINAIS:")
    print("-" * 30)
    stats = crawl_results['statistics']
    for key, value in stats.items():
        print(f"{key}: {value}")
    
    # Relatório de duplicados
    duplicate_report = crawler.get_duplicate_report()
    print(f"\nRELATÓRIO DE DUPLICADOS:")
    print("-" * 30)
    print(f"Grupos de duplicados: {duplicate_report['total_duplicate_groups']}")
    print(f"Páginas duplicadas: {duplicate_report['total_duplicate_pages']}")
    
    for i, group in enumerate(duplicate_report['groups'], 1):
        print(f"\nGrupo {i} ({group['count']} URLs):")
        for url in group['urls']:
            print(f"  - {url}")

if __name__ == "__main__":
    demo_web_crawler()
```

## Otimizações e Variações

### SimHash com Pesos Dinâmicos

```python
class WeightedSimHash(SimHash):
    def __init__(self, text: str = None, feature_weights: Dict[str, float] = None):
        """
        SimHash com pesos customizados para diferentes tipos de features
        
        Args:
            feature_weights: Dicionário com pesos para tipos de features
        """
        self.feature_weights = feature_weights or {
            'title': 3.0,      # Títulos têm peso maior
            'header': 2.0,     # Cabeçalhos têm peso médio
            'content': 1.0,    # Conteúdo tem peso normal
            'footer': 0.5      # Rodapés têm peso menor
        }
        
        super().__init__(text if text else "")
    
    def compute_weighted_hash(self, document_parts: Dict[str, str]) -> int:
        """
        Computa hash considerando diferentes partes do documento
        
        Args:
            document_parts: {'title': texto, 'content': texto, etc.}
        """
        all_features = {}
        
        for part_type, text in document_parts.items():
            weight_multiplier = self.feature_weights.get(part_type, 1.0)
            
            # Extrair features da parte
            features = self._extract_features(text)
            
            # Aplicar peso
            for feature, freq in features.items():
                weighted_key = f"{part_type}:{feature}"
                all_features[weighted_key] = freq * weight_multiplier
        
        return self._compute_hash_from_features(all_features)
```

### SimHash Incremental

```python
class IncrementalSimHash:
    def __init__(self, hash_size: int = 64):
        """SimHash que pode ser atualizado incrementalmente"""
        self.hash_size = hash_size
        self.bit_weights = [0] * hash_size
        self.feature_count = 0
    
    def add_feature(self, feature: str, weight: int = 1):
        """Adiciona feature incrementalmente"""
        feature_hash = self._hash_feature(feature)
        
        for i in range(self.hash_size):
            if (feature_hash >> i) & 1:
                self.bit_weights[i] += weight
            else:
                self.bit_weights[i] -= weight
        
        self.feature_count += 1
    
    def remove_feature(self, feature: str, weight: int = 1):
        """Remove feature incrementalmente"""
        feature_hash = self._hash_feature(feature)
        
        for i in range(self.hash_size):
            if (feature_hash >> i) & 1:
                self.bit_weights[i] -= weight
            else:
                self.bit_weights[i] += weight
        
        self.feature_count -= 1
    
    def get_hash(self) -> int:
        """Obtém hash atual"""
        final_hash = 0
        for i in range(self.hash_size):
            if self.bit_weights[i] > 0:
                final_hash |= (1 << i)
        return final_hash
    
    def _hash_feature(self, feature: str) -> int:
        if isinstance(feature, str):
            feature = feature.encode('utf-8')
        sha1_hash = hashlib.sha1(feature).hexdigest()
        hash_int = int(sha1_hash, 16)
        return hash_int & ((1 << self.hash_size) - 1)
```

## Comparação com Outras Técnicas

### SimHash vs MinHash vs LSH

```python
def compare_similarity_algorithms():
    """Compara SimHash com outros algoritmos de similaridade"""
    
    # Dados de teste
    docs = [
        "Python é uma linguagem de programação",
        "Python é linguagem de programação",  # Muito similar
        "Java é uma linguagem orientada a objetos",
        "Machine learning com Python é interessante",
        "Aprendizado de máquina usando Python"  # Similar ao anterior
    ]
    
    print("COMPARAÇÃO DE ALGORITMOS DE SIMILARIDADE")
    print("=" * 50)
    
    # SimHash
    simhashes = [SimHash(doc) for doc in docs]
    print("\nSimHash:")
    for i in range(len(docs)):
        for j in range(i+1, len(docs)):
            distance = simhashes[i].hamming_distance(simhashes[j])
            similarity = simhashes[i].similarity(simhashes[j])
            print(f"Doc{i+1} vs Doc{j+1}: distância={distance}, similaridade={similarity:.3f}")
    
    # Jaccard similarity (para comparação)
    def jaccard_similarity(text1: str, text2: str) -> float:
        set1 = set(text1.lower().split())
        set2 = set(text2.lower().split())
        intersection = len(set1 & set2)
        union = len(set1 | set2)
        return intersection / union if union > 0 else 0
    
    print("\nJaccard Similarity:")
    for i in range(len(docs)):
        for j in range(i+1, len(docs)):
            similarity = jaccard_similarity(docs[i], docs[j])
            print(f"Doc{i+1} vs Doc{j+1}: similaridade={similarity:.3f}")

if __name__ == "__main__":
    compare_similarity_algorithms()
```

## Casos de Uso Específicos

### **Detecção de Plágio**
- Comparação de documentos acadêmicos
- Verificação de originalidade de conteúdo
- Sistemas anti-spam

### **Motores de Busca**
- Deduplição de resultados
- Clustering de documentos similares
- Ranking baseado em originalidade

### **Sistemas de Recomendação**
- Recomendação de conteúdo similar
- Filtragem colaborativa baseada em conteúdo
- Descoberta de preferências do usuário

### **Análise de Redes Sociais**
- Detecção de posts duplicados
- Identificação de trends
- Análise de propagação de informação

### **Sistemas de Backup**
- Deduplição de arquivos
- Otimização de armazenamento
- Verificação de integridade

## Limitações e Considerações

### Limitações do SimHash
- **Sensibilidade a Ordem**: Mudanças na ordem das palavras afetam o hash
- **Features Dominantes**: Features muito frequentes podem dominar o hash
- **Tamanho do Documento**: Documentos muito pequenos podem ser instáveis
- **Idioma**: Funciona melhor em um único idioma

### Otimizações de Performance
- **Indexação LSH**: Para busca rápida em grandes datasets
- **Paralelização**: Computação paralela de hashes
- **Cache**: Cache de features computadas
- **Sampling**: Usar amostragem para documentos muito grandes

SimHash é uma ferramenta poderosa para detecção de similaridade em escala, especialmente útil quando precisamos de comparações rápidas entre grandes volumes de documentos textuais.
