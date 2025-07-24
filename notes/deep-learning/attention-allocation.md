# Attention Allocation

Attention Allocation refere-se a como os modelos distribuem e alocam recursos de atenção entre diferentes tokens, camadas e cabeças de atenção.

## Conceito Básico
- Distribuição de "recursos cognitivos" do modelo
- Como a atenção é direcionada e priorizada
- Otimização da capacidade limitada de atenção
- Impacto direto na qualidade das representações

## Mecanismos de Alocação

### 1. Token-Level Allocation
```python
# Como atenção é distribuída entre tokens
# Alguns tokens recebem mais atenção que outros

def analyze_token_attention(attention_weights, tokens):
    """
    Analisa alocação de atenção por token
    """
    # Soma atenção recebida por cada token
    attention_received = attention_weights.sum(dim=0)  # [seq_len]
    
    # Soma atenção dada por cada token  
    attention_given = attention_weights.sum(dim=1)     # [seq_len]
    
    # Tokens importantes recebem/dão mais atenção
    important_tokens = torch.topk(attention_received, k=5)
    
    return {
        'received': attention_received,
        'given': attention_given,
        'important': important_tokens
    }

# Padrões observados:
# - Tokens de conteúdo > tokens funcionais
# - Substantivos e verbos > artigos e preposições
# - Primeira e última posição frequentemente importantes
```

### 2. Layer-wise Allocation
```python
# Diferentes layers capturam diferentes tipos de informação
# Early layers: sintaxe, gramática
# Middle layers: semântica
# Late layers: tarefa específica

class LayerWiseAttentionAnalysis:
    def __init__(self, model):
        self.model = model
        
    def analyze_layer_patterns(self, input_ids):
        layer_attentions = []
        
        # Extrair atenção de cada layer
        with torch.no_grad():
            outputs = self.model(input_ids, output_attentions=True)
            layer_attentions = outputs.attentions
        
        # Analisar padrões por layer
        patterns = {}
        for i, attention in enumerate(layer_attentions):
            patterns[f'layer_{i}'] = {
                'entropy': self.compute_entropy(attention),
                'locality': self.compute_locality(attention),
                'diversity': self.compute_diversity(attention)
            }
        
        return patterns
    
    def compute_entropy(self, attention):
        # Alta entropia = atenção distribuída
        # Baixa entropia = atenção concentrada
        probs = attention + 1e-10  # Evitar log(0)
        entropy = -torch.sum(probs * torch.log(probs), dim=-1)
        return entropy.mean().item()
```

### 3. Head-wise Allocation
```python
# Multi-head attention: cada cabeça especializa em padrões diferentes
# Head specialization analysis

def analyze_head_specialization(attention_heads, tokens):
    """
    Analisa especialização das cabeças de atenção
    """
    num_heads = attention_heads.shape[1]
    specializations = {}
    
    for head_idx in range(num_heads):
        head_attention = attention_heads[:, head_idx, :, :]
        
        # Métricas de especialização
        specializations[f'head_{head_idx}'] = {
            'locality_score': compute_locality_score(head_attention),
            'syntactic_score': compute_syntactic_score(head_attention, tokens),
            'semantic_score': compute_semantic_score(head_attention, tokens),
            'attention_distance': compute_attention_distance(head_attention)
        }
    
    return specializations

def compute_locality_score(attention_matrix):
    """
    Mede se atenção é local (tokens próximos) ou global
    """
    seq_len = attention_matrix.shape[-1]
    distances = torch.abs(torch.arange(seq_len).unsqueeze(0) - 
                         torch.arange(seq_len).unsqueeze(1))
    
    # Produto ponderado: atenção * distância
    weighted_distance = (attention_matrix * distances.float()).sum() / attention_matrix.sum()
    
    # Normalizar: 0 = muito local, 1 = muito global
    locality_score = 1 - (weighted_distance / (seq_len / 2))
    return locality_score.item()
```

## Padrões de Alocação

### 1. Attention to Function Words
```python
# Tokens funcionais frequentemente recebem atenção desproporcional
# [SEP], [CLS], pontuação, artigos

def function_word_attention(attention_weights, tokens):
    function_words = ['the', 'a', 'an', 'and', 'or', 'but', '[SEP]', '[CLS]']
    
    function_attention = 0
    content_attention = 0
    
    for i, token in enumerate(tokens):
        if token.lower() in function_words:
            function_attention += attention_weights[:, i].sum()
        else:
            content_attention += attention_weights[:, i].sum()
    
    # Proporção de atenção para palavras funcionais
    function_ratio = function_attention / (function_attention + content_attention)
    return function_ratio

# Observação: Modelos frequentemente "over-attend" a function words
# Pode indicar ineficiência na alocação de recursos
```

### 2. Positional Bias
```python
# Bias para primeira e última posições
# Recency bias vs primacy bias

def positional_bias_analysis(attention_weights):
    seq_len = attention_weights.shape[-1]
    
    # Atenção recebida por posição
    position_attention = attention_weights.mean(dim=0)  # Média sobre queries
    
    # Bias para início
    start_bias = position_attention[:seq_len//4].mean()
    
    # Bias para fim  
    end_bias = position_attention[-seq_len//4:].mean()
    
    # Bias para meio
    middle_bias = position_attention[seq_len//4:-seq_len//4].mean()
    
    return {
        'start_bias': start_bias.item(),
        'middle_bias': middle_bias.item(),
        'end_bias': end_bias.item()
    }
```

### 3. Content vs Context Allocation
```python
# Balanceamento entre focar no token atual vs contexto

def content_context_balance(attention_weights):
    seq_len = attention_weights.shape[-1]
    
    # Atenção para si mesmo (diagonal principal)
    self_attention = torch.diag(attention_weights).mean()
    
    # Atenção para contexto (off-diagonal)
    context_attention = (attention_weights.sum() - torch.diag(attention_weights).sum()) / (seq_len * (seq_len - 1))
    
    return {
        'self_attention': self_attention.item(),
        'context_attention': context_attention.item(),
        'balance_ratio': (context_attention / self_attention).item()
    }
```

## Otimização da Alocação

### 1. Attention Regularization
```python
# Regularizar distribuição de atenção para melhor alocação

class AttentionRegularization(nn.Module):
    def __init__(self, entropy_weight=0.1, diversity_weight=0.1):
        super().__init__()
        self.entropy_weight = entropy_weight
        self.diversity_weight = diversity_weight
    
    def forward(self, attention_weights):
        batch_size, num_heads, seq_len, seq_len = attention_weights.shape
        
        # Entropy regularization - promove distribuição uniforme
        entropy_loss = self.entropy_regularization(attention_weights)
        
        # Diversity regularization - promove diferentes padrões entre heads
        diversity_loss = self.diversity_regularization(attention_weights)
        
        total_loss = (self.entropy_weight * entropy_loss + 
                     self.diversity_weight * diversity_loss)
        
        return total_loss
    
    def entropy_regularization(self, attention_weights):
        # Penaliza atenção muito concentrada
        probs = attention_weights + 1e-10
        entropy = -torch.sum(probs * torch.log(probs), dim=-1)
        
        # Queremos entropia moderada (nem muito alta, nem muito baixa)
        target_entropy = torch.log(torch.tensor(attention_weights.shape[-1] / 4.0))
        entropy_loss = torch.abs(entropy - target_entropy).mean()
        
        return entropy_loss
```

### 2. Sparse Attention Allocation
```python
# Alocar atenção apenas para tokens mais relevantes

class SparseAttentionAllocation(nn.Module):
    def __init__(self, sparsity_ratio=0.1):
        super().__init__()
        self.sparsity_ratio = sparsity_ratio
    
    def forward(self, attention_scores):
        # Manter apenas top-k conexões de atenção
        seq_len = attention_scores.shape[-1]
        k = max(1, int(seq_len * self.sparsity_ratio))
        
        # Top-k atenção para cada query
        top_k_values, top_k_indices = torch.topk(attention_scores, k, dim=-1)
        
        # Criar máscara esparsa
        sparse_mask = torch.zeros_like(attention_scores)
        sparse_mask.scatter_(-1, top_k_indices, 1.0)
        
        # Aplicar máscara
        sparse_attention = attention_scores * sparse_mask
        sparse_attention = sparse_attention.masked_fill(sparse_mask == 0, -float('inf'))
        
        return torch.softmax(sparse_attention, dim=-1)
```

### 3. Dynamic Allocation
```python
# Alocação dinâmica baseada no contexto

class DynamicAttentionAllocation(nn.Module):
    def __init__(self, d_model):
        super().__init__()
        self.allocation_network = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.ReLU(),
            nn.Linear(d_model // 2, 1),
            nn.Sigmoid()
        )
    
    def forward(self, query, key, value):
        # Computar scores de alocação baseados no contexto
        allocation_scores = self.allocation_network(query)  # [batch, seq_len, 1]
        
        # Modular atenção baseado nos scores
        attention_scores = torch.matmul(query, key.transpose(-2, -1))
        attention_scores = attention_scores * allocation_scores.unsqueeze(-1)
        
        attention_weights = torch.softmax(attention_scores, dim=-1)
        output = torch.matmul(attention_weights, value)
        
        return output, allocation_scores
```

## Métricas de Qualidade da Alocação

### 1. Attention Entropy
```python
def attention_entropy(attention_weights):
    """
    Mede quão distribuída é a atenção
    Alta entropia = distribuída
    Baixa entropia = concentrada
    """
    probs = attention_weights + 1e-10
    entropy = -torch.sum(probs * torch.log(probs), dim=-1)
    return entropy.mean()
```

### 2. Attention Diversity
```python
def attention_diversity(attention_heads):
    """
    Mede diversidade entre cabeças de atenção
    """
    num_heads = attention_heads.shape[1]
    diversity_scores = []
    
    for i in range(num_heads):
        for j in range(i+1, num_heads):
            # Similaridade coseno entre cabeças
            head_i = attention_heads[:, i, :, :].flatten()
            head_j = attention_heads[:, j, :, :].flatten()
            
            similarity = torch.cosine_similarity(head_i, head_j, dim=0)
            diversity_scores.append(1 - similarity)  # Diversidade = 1 - similaridade
    
    return torch.tensor(diversity_scores).mean()
```

### 3. Allocation Efficiency
```python
def allocation_efficiency(attention_weights, target_labels):
    """
    Mede se atenção está sendo alocada para tokens importantes
    """
    # Definir quais tokens são importantes para a tarefa
    important_positions = (target_labels != 0).float()  # Exemplo
    
    # Atenção total recebida por tokens importantes
    important_attention = (attention_weights.sum(dim=0) * important_positions).sum()
    total_attention = attention_weights.sum()
    
    efficiency = important_attention / total_attention
    return efficiency
```

## Problemas de Má Alocação

### 1. Attention Collapse
```python
# Toda atenção concentrada em poucos tokens
# Resulta em representações pobres

def detect_attention_collapse(attention_weights, threshold=0.8):
    """
    Detecta se atenção está colapsando
    """
    max_attention_per_query = attention_weights.max(dim=-1)[0]
    collapse_ratio = (max_attention_per_query > threshold).float().mean()
    
    return collapse_ratio > 0.5  # Mais de 50% das queries colapsaram
```

### 2. Uniform Attention
```python
# Atenção muito distribuída = não discriminativa
# Todas as posições recebem atenção similar

def detect_uniform_attention(attention_weights, threshold=0.1):
    """
    Detecta atenção muito uniforme
    """
    entropy = attention_entropy(attention_weights)
    max_possible_entropy = torch.log(torch.tensor(attention_weights.shape[-1], dtype=torch.float))
    
    normalized_entropy = entropy / max_possible_entropy
    return normalized_entropy > (1 - threshold)  # Muito próximo da uniformidade
```

### 3. Over-attention to Special Tokens
```python
# Atenção excessiva para [CLS], [SEP], etc.

def detect_special_token_bias(attention_weights, special_positions):
    """
    Detecta bias excessivo para tokens especiais
    """
    special_attention = attention_weights[:, special_positions].sum()
    total_attention = attention_weights.sum()
    
    special_ratio = special_attention / total_attention
    expected_ratio = len(special_positions) / attention_weights.shape[-1]
    
    # Bias significativo se > 2x o esperado
    return special_ratio > (2 * expected_ratio)
```
