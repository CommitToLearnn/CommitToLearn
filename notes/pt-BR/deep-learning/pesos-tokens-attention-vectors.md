# Pesos entre Tokens e Attention Vectors

A análise dos pesos entre tokens e vetores de atenção revela como modelos processam relações semânticas e sintáticas, distribuindo importância através da sequência.

## Conceito Básico
- **Pesos de Atenção**: Valores que determinam importância relativa entre tokens
- **Attention Vectors**: Representações ponderadas resultantes da atenção
- **Proximidade Semântica**: Tokens similares tendem a ter maior atenção mútua
- **Distribuição de Importância**: Como recursos cognitivos são alocados

## Matemática dos Pesos de Atenção

### Cálculo dos Pesos
```python
import torch
import torch.nn.functional as F
import math

def compute_attention_weights(queries, keys, values, mask=None):
    """
    Calcula pesos de atenção e vetores resultantes
    
    Args:
        queries: [batch, seq_len, d_model]
        keys: [batch, seq_len, d_model]  
        values: [batch, seq_len, d_model]
    """
    d_k = queries.shape[-1]
    
    # 1. Compute attention scores
    scores = torch.matmul(queries, keys.transpose(-2, -1)) / math.sqrt(d_k)
    # scores: [batch, seq_len, seq_len]
    
    # 2. Apply mask if provided
    if mask is not None:
        scores = scores.masked_fill(mask == 0, -float('inf'))
    
    # 3. Softmax para obter pesos normalizados
    attention_weights = F.softmax(scores, dim=-1)
    # attention_weights[i,j] = quanto token i atende ao token j
    
    # 4. Aplicar pesos aos valores
    attention_vectors = torch.matmul(attention_weights, values)
    # attention_vectors: [batch, seq_len, d_model]
    
    return attention_weights, attention_vectors

# Propriedades dos pesos:
# - Soma de cada linha = 1.0 (distribuição de probabilidade)
# - Valores entre 0 e 1
# - Refletem importância relativa
```

### Interpretação dos Pesos
```python
def interpret_attention_weights(attention_weights, tokens):
    """
    Interpreta padrões nos pesos de atenção
    """
    seq_len = len(tokens)
    interpretations = {}
    
    for i, query_token in enumerate(tokens):
        # Pesos que este token dá a outros tokens
        outgoing_weights = attention_weights[i, :]
        
        # Top-k tokens que recebem mais atenção
        top_attended = torch.topk(outgoing_weights, k=min(5, seq_len))
        top_tokens = [(tokens[idx], weight.item()) 
                     for idx, weight in zip(top_attended.indices, top_attended.values)]
        
        interpretations[query_token] = {
            'attends_to': top_tokens,
            'attention_entropy': compute_attention_entropy(outgoing_weights),
            'self_attention': outgoing_weights[i].item()
        }
    
    return interpretations

def compute_attention_entropy(weights):
    """
    Entropia da distribuição de atenção
    Alta entropia = atenção distribuída
    Baixa entropia = atenção concentrada
    """
    # Evitar log(0)
    weights = weights + 1e-10
    entropy = -torch.sum(weights * torch.log(weights))
    return entropy.item()
```

## Proximidade Semântica e Vetores

### Similarity-Driven Attention
```python
def analyze_semantic_similarity_attention(embeddings, attention_weights):
    """
    Analisa relação entre similaridade semântica e atenção
    """
    seq_len = embeddings.shape[0]
    
    # Matriz de similaridade coseno entre embeddings
    similarity_matrix = torch.zeros(seq_len, seq_len)
    for i in range(seq_len):
        for j in range(seq_len):
            similarity_matrix[i, j] = F.cosine_similarity(
                embeddings[i].unsqueeze(0), 
                embeddings[j].unsqueeze(0)
            )
    
    # Correlação entre similaridade e atenção
    correlation = torch.corrcoef(torch.stack([
        similarity_matrix.flatten(),
        attention_weights.flatten()
    ]))[0, 1]
    
    return {
        'similarity_matrix': similarity_matrix,
        'attention_similarity_correlation': correlation.item(),
        'semantic_attention_alignment': correlation.item() > 0.3
    }

# Hipótese: Tokens semanticamente similares devem ter maior atenção mútua
# Em espaços bem organizados, esta correlação é positiva
```

### Attention Vector Composition
```python
def analyze_attention_vector_composition(attention_weights, token_embeddings):
    """
    Analisa como attention vectors são compostos
    """
    # Attention vectors = weighted sum of value vectors
    attention_vectors = torch.matmul(attention_weights, token_embeddings)
    
    composition_analysis = {}
    
    for i, attention_vector in enumerate(attention_vectors):
        # Decompor vetor de atenção
        contributions = []
        
        for j, (weight, token_emb) in enumerate(zip(attention_weights[i], token_embeddings)):
            contribution = weight * token_emb
            contribution_magnitude = torch.norm(contribution).item()
            
            contributions.append({
                'token_idx': j,
                'weight': weight.item(),
                'contribution_magnitude': contribution_magnitude,
                'relative_contribution': contribution_magnitude / torch.norm(attention_vector).item()
            })
        
        # Ordenar por contribuição
        contributions.sort(key=lambda x: x['contribution_magnitude'], reverse=True)
        
        composition_analysis[i] = {
            'top_contributors': contributions[:5],
            'effective_contributors': len([c for c in contributions if c['relative_contribution'] > 0.1]),
            'composition_entropy': compute_composition_entropy(contributions)
        }
    
    return composition_analysis

def compute_composition_entropy(contributions):
    """
    Entropia da composição do vetor de atenção
    """
    weights = torch.tensor([c['relative_contribution'] for c in contributions])
    weights = weights + 1e-10
    entropy = -torch.sum(weights * torch.log(weights))
    return entropy.item()
```

## Padrões de Atenção Específicos

### Attention to Content vs Function Words
```python
def analyze_content_function_attention(attention_weights, tokens, pos_tags):
    """
    Analisa atenção para palavras de conteúdo vs funcionais
    """
    content_pos = {'NOUN', 'VERB', 'ADJ', 'ADV'}
    function_pos = {'DET', 'PREP', 'CONJ', 'PRON'}
    
    content_indices = [i for i, pos in enumerate(pos_tags) if pos in content_pos]
    function_indices = [i for i, pos in enumerate(pos_tags) if pos in function_pos]
    
    # Atenção recebida por cada tipo
    content_attention = attention_weights[:, content_indices].sum().item()
    function_attention = attention_weights[:, function_indices].sum().item()
    
    total_attention = content_attention + function_attention
    
    return {
        'content_attention_ratio': content_attention / total_attention,
        'function_attention_ratio': function_attention / total_attention,
        'content_bias': content_attention > function_attention
    }
```

### Positional Attention Patterns
```python
def analyze_positional_attention_patterns(attention_weights):
    """
    Analisa padrões posicionais de atenção
    """
    seq_len = attention_weights.shape[-1]
    position_attention = attention_weights.mean(dim=0)  # Média sobre queries
    
    patterns = {
        'first_token_bias': position_attention[0].item(),
        'last_token_bias': position_attention[-1].item(),
        'middle_attention': position_attention[1:-1].mean().item(),
        'attention_locality': compute_attention_locality(attention_weights),
        'attention_spread': position_attention.std().item()
    }
    
    return patterns

def compute_attention_locality(attention_weights):
    """
    Mede quão local vs global é a atenção
    """
    seq_len = attention_weights.shape[-1]
    
    # Matriz de distâncias posicionais
    distance_matrix = torch.abs(
        torch.arange(seq_len).unsqueeze(0) - 
        torch.arange(seq_len).unsqueeze(1)
    ).float()
    
    # Distância média ponderada pela atenção
    weighted_distance = (attention_weights * distance_matrix).sum() / attention_weights.sum()
    
    # Normalizar pela distância máxima possível
    max_distance = seq_len / 2
    locality_score = 1 - (weighted_distance / max_distance)
    
    return locality_score.item()
```

### Head Specialization Patterns
```python
def analyze_head_specialization(multi_head_attention, tokens):
    """
    Analisa especialização de diferentes cabeças de atenção
    """
    num_heads = multi_head_attention.shape[1]
    head_specializations = {}
    
    for head_idx in range(num_heads):
        head_attention = multi_head_attention[:, head_idx, :, :]
        
        specialization = {
            'attention_pattern': classify_attention_pattern(head_attention),
            'syntactic_score': compute_syntactic_attention_score(head_attention, tokens),
            'semantic_score': compute_semantic_attention_score(head_attention, tokens),
            'locality_preference': compute_attention_locality(head_attention),
            'function_word_bias': compute_function_word_bias(head_attention, tokens)
        }
        
        head_specializations[f'head_{head_idx}'] = specialization
    
    return head_specializations

def classify_attention_pattern(attention_matrix):
    """
    Classifica padrão de atenção da cabeça
    """
    # Diagonal dominance
    diagonal_strength = torch.diag(attention_matrix).mean()
    
    # Localidade
    locality = compute_attention_locality(attention_matrix)
    
    # Distribuição
    entropy = compute_attention_entropy(attention_matrix.flatten())
    
    if diagonal_strength > 0.5:
        return "self_attention_dominant"
    elif locality > 0.7:
        return "local_attention"
    elif entropy > 3.0:
        return "distributed_attention"
    else:
        return "focused_attention"
```

## Otimização dos Pesos de Atenção

### Attention Regularization
```python
class AttentionWeightRegularizer:
    def __init__(self, entropy_weight=0.1, sparsity_weight=0.1):
        self.entropy_weight = entropy_weight
        self.sparsity_weight = sparsity_weight
    
    def compute_regularization_loss(self, attention_weights):
        """
        Regulariza pesos de atenção para melhor distribuição
        """
        # Entropy regularization - evita atenção muito concentrada
        entropy_loss = self.entropy_regularization(attention_weights)
        
        # Sparsity regularization - promove atenção esparsa
        sparsity_loss = self.sparsity_regularization(attention_weights)
        
        total_loss = (self.entropy_weight * entropy_loss + 
                     self.sparsity_weight * sparsity_loss)
        
        return total_loss
    
    def entropy_regularization(self, attention_weights):
        """
        Penaliza atenção muito concentrada ou muito distribuída
        """
        # Calcular entropia por linha (query)
        probs = attention_weights + 1e-10
        entropy = -torch.sum(probs * torch.log(probs), dim=-1)
        
        # Target entropy (nem muito alto, nem muito baixo)
        seq_len = attention_weights.shape[-1]
        target_entropy = torch.log(torch.tensor(seq_len / 4.0))
        
        # Penalizar desvio do target
        entropy_loss = torch.mean((entropy - target_entropy) ** 2)
        return entropy_loss
    
    def sparsity_regularization(self, attention_weights):
        """
        Promove sparsity nos pesos de atenção
        """
        # L1 regularization nos pesos
        sparsity_loss = torch.mean(torch.abs(attention_weights))
        return sparsity_loss
```

### Attention Weight Clipping
```python
def clip_attention_weights(attention_weights, min_val=1e-6, max_val=0.8):
    """
    Limita pesos de atenção para evitar dominância extrema
    """
    # Clipping preservando normalização
    clipped = torch.clamp(attention_weights, min_val, max_val)
    
    # Re-normalizar para manter soma = 1
    normalized = clipped / clipped.sum(dim=-1, keepdim=True)
    
    return normalized
```

## Visualização e Interpretação

### Attention Heatmaps
```python
import matplotlib.pyplot as plt
import seaborn as sns

def plot_attention_heatmap(attention_weights, tokens, save_path=None):
    """
    Visualiza matriz de atenção como heatmap
    """
    plt.figure(figsize=(12, 10))
    
    # Criar heatmap
    sns.heatmap(
        attention_weights.cpu().numpy(),
        xticklabels=tokens,
        yticklabels=tokens,
        cmap='Blues',
        cbar_kws={'label': 'Attention Weight'},
        square=True
    )
    
    plt.title('Attention Weight Matrix')
    plt.xlabel('Keys (attended to)')
    plt.ylabel('Queries (attending from)')
    plt.xticks(rotation=45)
    plt.yticks(rotation=0)
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    
    plt.show()

def plot_attention_vectors_tsne(attention_vectors, tokens):
    """
    Visualiza attention vectors em 2D usando t-SNE
    """
    from sklearn.manifold import TSNE
    
    # Reduzir dimensionalidade
    tsne = TSNE(n_components=2, random_state=42)
    vectors_2d = tsne.fit_transform(attention_vectors.cpu().numpy())
    
    plt.figure(figsize=(12, 8))
    scatter = plt.scatter(vectors_2d[:, 0], vectors_2d[:, 1], 
                         c=range(len(tokens)), cmap='viridis')
    
    # Adicionar labels dos tokens
    for i, token in enumerate(tokens):
        plt.annotate(token, (vectors_2d[i, 0], vectors_2d[i, 1]),
                    xytext=(5, 5), textcoords='offset points')
    
    plt.title('Attention Vectors in 2D Space')
    plt.xlabel('t-SNE Component 1')
    plt.ylabel('t-SNE Component 2')
    plt.colorbar(scatter, label='Token Position')
    plt.show()
```

### Attention Flow Analysis
```python
def analyze_attention_flow(attention_weights_all_layers, tokens):
    """
    Analisa fluxo de atenção através das camadas
    """
    num_layers = len(attention_weights_all_layers)
    flow_analysis = {}
    
    for token_idx, token in enumerate(tokens):
        token_flow = []
        
        for layer_idx, layer_attention in enumerate(attention_weights_all_layers):
            # Atenção recebida por este token nesta camada
            incoming_attention = layer_attention[:, token_idx].mean().item()
            
            # Atenção dada por este token nesta camada  
            outgoing_attention = layer_attention[token_idx, :].mean().item()
            
            token_flow.append({
                'layer': layer_idx,
                'incoming': incoming_attention,
                'outgoing': outgoing_attention,
                'net_flow': incoming_attention - outgoing_attention
            })
        
        flow_analysis[token] = token_flow
    
    return flow_analysis
```

## Impacto na Performance

### Quality Metrics
```python
def evaluate_attention_quality(attention_weights, ground_truth_alignments=None):
    """
    Avalia qualidade dos pesos de atenção
    """
    metrics = {}
    
    # Diversidade de atenção
    metrics['attention_diversity'] = compute_attention_diversity(attention_weights)
    
    # Entropia média
    metrics['mean_entropy'] = compute_mean_attention_entropy(attention_weights)
    
    # Sparsity
    metrics['sparsity'] = compute_attention_sparsity(attention_weights)
    
    # Se temos ground truth, calcular alinhamento
    if ground_truth_alignments is not None:
        metrics['alignment_accuracy'] = compute_alignment_accuracy(
            attention_weights, ground_truth_alignments
        )
    
    return metrics

def compute_attention_diversity(attention_weights):
    """
    Mede diversidade nas distribuições de atenção
    """
    # Variância entre distribuições de atenção
    attention_variance = torch.var(attention_weights, dim=0).mean()
    return attention_variance.item()

def compute_attention_sparsity(attention_weights, threshold=0.1):
    """
    Mede sparsity dos pesos de atenção
    """
    # Proporção de pesos abaixo do threshold
    sparse_ratio = (attention_weights < threshold).float().mean()
    return sparse_ratio.item()
```
