# Early Layers vs High Layers

A análise das diferenças entre camadas iniciais (early layers) e camadas finais (high layers) em redes neurais profundas revela padrões hierárquicos de aprendizado de representações.

## Conceito Básico
- **Early Layers**: Camadas próximas à entrada, capturam features de baixo nível
- **High Layers**: Camadas próximas à saída, capturam abstrações de alto nível
- **Hierarquia de Representações**: Progressão de simples para complexo
- **Especialização Gradual**: Cada camada refina e abstrai informações

## Diferenças Fundamentais

### Early Layers (Camadas Iniciais)
```python
# Características das primeiras camadas
early_layer_properties = {
    "feature_type": "low_level",
    "examples": [
        "edges and contours",      # Visão computacional
        "phonemes and syllables",  # Processamento de fala
        "character patterns",      # NLP
        "local syntax"            # Linguagem
    ],
    "receptive_field": "small",
    "abstraction_level": "concrete",
    "universality": "high"  # Similares entre domínios
}

# Exemplo em CNNs
def analyze_early_conv_filters(model):
    """
    Primeiras camadas convolucionais aprendem detectores de bordas
    """
    first_layer = model.features[0]  # Primeira camada conv
    filters = first_layer.weight.data  # [out_channels, in_channels, h, w]
    
    # Visualizar filtros - geralmente mostram:
    # - Detectores de borda horizontal/vertical
    # - Detectores de cor
    # - Filtros Gabor-like
    
    return filters

# Exemplo em Transformers
def analyze_early_attention_patterns(attention_weights):
    """
    Primeiras camadas focam em padrões sintáticos simples
    """
    # Layer 0-2 tipicamente mostram:
    # - Attention to adjacent tokens
    # - Attention to punctuation
    # - Simple syntactic patterns
    early_patterns = {
        "locality": "high",
        "syntax_focus": "surface_level",
        "semantic_focus": "low"
    }
    return early_patterns
```

### High Layers (Camadas Finais)
```python
# Características das últimas camadas
high_layer_properties = {
    "feature_type": "high_level",
    "examples": [
        "object recognition",      # Visão
        "semantic meaning",        # NLP
        "complex reasoning",       # Tarefas cognitivas
        "task-specific patterns"   # Especializados
    ],
    "receptive_field": "large",
    "abstraction_level": "abstract",
    "universality": "low"  # Específicas para tarefa
}

# Exemplo em CNNs
def analyze_high_conv_features(model, layer_idx=-3):
    """
    Últimas camadas convolucionais reconhecem objetos complexos
    """
    high_layer = model.features[layer_idx]
    
    # Features típicas:
    # - Detectores de faces, objetos
    # - Padrões texturais complexos
    # - Representações semânticas
    
    feature_maps = get_feature_maps(high_layer)
    return feature_maps

# Exemplo em Transformers
def analyze_high_attention_patterns(attention_weights, layer_idx=-1):
    """
    Últimas camadas focam em semântica e relações complexas
    """
    # Layers finais tipicamente mostram:
    # - Long-range dependencies
    # - Semantic relationships
    # - Task-specific patterns
    high_patterns = {
        "locality": "low",
        "syntax_focus": "complex",
        "semantic_focus": "high",
        "task_specificity": "high"
    }
    return high_patterns
```

## Análise por Domínio

### Computer Vision (CNNs)
```python
class LayerAnalysisCV:
    def __init__(self, model):
        self.model = model
    
    def analyze_layer_hierarchy(self):
        analysis = {}
        
        # Early layers (0-20% das camadas)
        analysis['early'] = {
            'features': ['edges', 'corners', 'simple_textures'],
            'receptive_field': 'small (3x3 to 7x7)',
            'invariance': 'translation',
            'universality': 'high across datasets'
        }
        
        # Middle layers (20-70% das camadas)
        analysis['middle'] = {
            'features': ['shapes', 'patterns', 'textures'],
            'receptive_field': 'medium (15x15 to 50x50)',
            'invariance': 'rotation, scale',
            'universality': 'moderate'
        }
        
        # High layers (70-100% das camadas)
        analysis['high'] = {
            'features': ['objects', 'scenes', 'concepts'],
            'receptive_field': 'large (100x100+)',
            'invariance': 'viewpoint, lighting',
            'universality': 'low, task-specific'
        }
        
        return analysis
    
    def compute_receptive_field(self, layer_idx):
        """
        Calcula campo receptivo efetivo
        """
        rf_size = 1
        stride_product = 1
        
        for i in range(layer_idx + 1):
            layer = self.model.features[i]
            if hasattr(layer, 'kernel_size'):
                kernel = layer.kernel_size[0] if isinstance(layer.kernel_size, tuple) else layer.kernel_size
                stride = layer.stride[0] if isinstance(layer.stride, tuple) else layer.stride
                
                rf_size = rf_size + (kernel - 1) * stride_product
                stride_product *= stride
        
        return rf_size
```

### Natural Language Processing (Transformers)
```python
class LayerAnalysisNLP:
    def __init__(self, model):
        self.model = model
    
    def analyze_linguistic_hierarchy(self):
        """
        Hierarquia linguística em Transformers
        """
        linguistic_hierarchy = {
            'layer_0_2': {
                'focus': 'surface_syntax',
                'patterns': ['POS tagging', 'simple dependencies'],
                'attention_distance': 'short (1-3 tokens)',
                'examples': 'article-noun, verb-object'
            },
            
            'layer_3_6': {
                'focus': 'complex_syntax',
                'patterns': ['syntactic roles', 'phrase structure'],
                'attention_distance': 'medium (3-10 tokens)',
                'examples': 'subject-verb agreement, relative clauses'
            },
            
            'layer_7_plus': {
                'focus': 'semantics_pragmatics',
                'patterns': ['coreference', 'semantic roles'],
                'attention_distance': 'long (10+ tokens)',
                'examples': 'anaphora resolution, discourse relations'
            }
        }
        
        return linguistic_hierarchy
    
    def measure_attention_locality(self, attention_weights):
        """
        Mede localidade da atenção por camada
        """
        num_layers = len(attention_weights)
        locality_scores = []
        
        for layer_idx, layer_attention in enumerate(attention_weights):
            # Calcular distância média da atenção
            seq_len = layer_attention.shape[-1]
            distance_matrix = torch.abs(
                torch.arange(seq_len).unsqueeze(0) - 
                torch.arange(seq_len).unsqueeze(1)
            ).float()
            
            weighted_distance = (layer_attention * distance_matrix).sum() / layer_attention.sum()
            locality_scores.append(weighted_distance.item())
        
        return locality_scores
```

### Speech Processing
```python
class LayerAnalysisSpeech:
    def analyze_speech_hierarchy(self):
        """
        Hierarquia no processamento de fala
        """
        speech_hierarchy = {
            'early_layers': {
                'level': 'acoustic_phonetic',
                'features': ['spectral features', 'formants', 'phonemes'],
                'time_scale': 'milliseconds (10-50ms)',
                'invariance': 'speaker_independent'
            },
            
            'middle_layers': {
                'level': 'linguistic',
                'features': ['syllables', 'morphemes', 'words'],
                'time_scale': 'centiseconds (100-500ms)',
                'invariance': 'accent_variations'
            },
            
            'high_layers': {
                'level': 'semantic_pragmatic',
                'features': ['phrases', 'concepts', 'intent'],
                'time_scale': 'seconds (1-10s)',
                'invariance': 'domain_independent'
            }
        }
        
        return speech_hierarchy
```

## Transferibilidade entre Camadas

### Layer Transfer Analysis
```python
def analyze_layer_transferability(source_model, target_task):
    """
    Analisa qual camadas são mais transferíveis
    """
    transfer_results = {}
    
    for layer_idx in range(len(source_model.layers)):
        # Freeze até layer_idx, fine-tune o resto
        frozen_model = freeze_layers_until(source_model, layer_idx)
        
        # Treinar no target_task
        performance = train_and_evaluate(frozen_model, target_task)
        
        transfer_results[layer_idx] = {
            'performance': performance,
            'transferability': calculate_transferability(performance)
        }
    
    return transfer_results

def calculate_transferability(performance):
    """
    Early layers: alta transferibilidade
    High layers: baixa transferibilidade
    """
    # Métrica baseada em performance relativa
    baseline_performance = 0.5  # Random baseline
    max_performance = 0.95      # Upper bound
    
    transferability = (performance - baseline_performance) / (max_performance - baseline_performance)
    return max(0, min(1, transferability))
```

### Universal vs Task-Specific Features
```python
class FeatureUniversalityAnalysis:
    def __init__(self):
        self.universality_scores = {}
    
    def compute_feature_universality(self, models_dict):
        """
        Compara features entre diferentes tarefas/domínios
        """
        for layer_idx in range(self.get_min_layers(models_dict)):
            layer_similarities = []
            
            # Comparar features entre todos os pares de modelos
            model_pairs = itertools.combinations(models_dict.items(), 2)
            
            for (name1, model1), (name2, model2) in model_pairs:
                features1 = extract_features(model1, layer_idx)
                features2 = extract_features(model2, layer_idx)
                
                similarity = compute_feature_similarity(features1, features2)
                layer_similarities.append(similarity)
            
            # Universalidade = média das similaridades
            self.universality_scores[layer_idx] = np.mean(layer_similarities)
        
        return self.universality_scores
    
    def compute_feature_similarity(self, features1, features2):
        """
        Similaridade entre conjuntos de features
        """
        # Canonical Correlation Analysis (CCA)
        cca = CCA(n_components=min(features1.shape[1], features2.shape[1]))
        cca.fit(features1, features2)
        
        # Soma das correlações canônicas
        similarity = np.sum(cca.score(features1, features2))
        return similarity
```

## Probing e Interpretabilidade

### Layer-wise Probing
```python
class LayerProbing:
    def __init__(self, model):
        self.model = model
        self.probing_results = {}
    
    def probe_linguistic_features(self, dataset):
        """
        Testa que informação linguística cada camada captura
        """
        linguistic_tasks = [
            'pos_tagging',
            'syntactic_parsing', 
            'semantic_role_labeling',
            'coreference_resolution',
            'sentiment_analysis'
        ]
        
        for layer_idx in range(len(self.model.layers)):
            layer_features = self.extract_layer_features(layer_idx, dataset)
            
            for task in linguistic_tasks:
                probe_accuracy = self.train_probe(layer_features, task)
                
                self.probing_results[(layer_idx, task)] = probe_accuracy
        
        return self.probing_results
    
    def train_probe(self, features, task):
        """
        Treina classificador simples para tarefa específica
        """
        X_train, X_test, y_train, y_test = train_test_split(
            features, self.get_labels(task)
        )
        
        # Classificador linear simples
        probe = LogisticRegression()
        probe.fit(X_train, y_train)
        
        accuracy = probe.score(X_test, y_test)
        return accuracy
```

### Information Flow Analysis
```python
def analyze_information_flow(model, input_data):
    """
    Analisa como informação flui através das camadas
    """
    layer_outputs = []
    x = input_data
    
    # Forward pass salvando outputs de cada camada
    for layer in model.layers:
        x = layer(x)
        layer_outputs.append(x.detach())
    
    # Análise do fluxo de informação
    info_flow = {}
    
    for i, output in enumerate(layer_outputs):
        info_flow[i] = {
            'mutual_information': compute_mutual_information(input_data, output),
            'information_retention': compute_information_retention(output),
            'layer_complexity': compute_layer_complexity(output)
        }
    
    return info_flow

def compute_mutual_information(x, y):
    """
    Informação mútua entre entrada e representação
    """
    # Estimativa usando k-nearest neighbors
    from sklearn.feature_selection import mutual_info_regression
    
    x_flat = x.reshape(x.shape[0], -1)
    y_flat = y.reshape(y.shape[0], -1)
    
    mi_scores = []
    for i in range(min(10, y_flat.shape[1])):  # Sample subset
        mi = mutual_info_regression(x_flat, y_flat[:, i])
        mi_scores.append(np.mean(mi))
    
    return np.mean(mi_scores)
```

## Implications para Design de Arquitetura

### Optimal Depth
```python
def find_optimal_depth(task_complexity, data_size):
    """
    Determina profundidade ótima baseada na complexidade da tarefa
    """
    depth_recommendations = {
        'simple_classification': {
            'min_depth': 3,
            'max_depth': 10,
            'factors': ['data_size', 'feature_complexity']
        },
        
        'complex_reasoning': {
            'min_depth': 12,
            'max_depth': 100,
            'factors': ['reasoning_steps', 'abstraction_levels']
        },
        
        'generative_modeling': {
            'min_depth': 6,
            'max_depth': 50,
            'factors': ['sequence_length', 'vocabulary_size']
        }
    }
    
    return depth_recommendations.get(task_complexity, {})

# Skip connections e residual learning
# Ajudam informação a fluir através de muitas camadas
# Permitem redes mais profundas sem degradação de gradiente
```
