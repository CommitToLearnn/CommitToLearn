# Transformers

Transformers são uma arquitetura de rede neural que revolucionou o processamento de linguagem natural e outras áreas de deep learning, baseada inteiramente em mecanismos de atenção.

## Conceito Básico
- Arquitetura baseada puramente em atenção (sem RNNs ou CNNs)
- Processamento paralelo de sequências
- Capacidade de capturar dependências de longo alcance
- Base para modelos como BERT, GPT, T5

## Arquitetura Original

### Encoder-Decoder Structure
```
Input → Encoder → Decoder → Output

Encoder: Input Embeddings + Positional Encoding + N × Encoder Layers
Decoder: Output Embeddings + Positional Encoding + N × Decoder Layers
```

### Encoder Layer
```python
class TransformerEncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        # Multi-Head Self Attention
        self.self_attention = MultiHeadAttention(d_model, num_heads)
        
        # Feed Forward Network
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        
        # Layer Normalization and Residual Connections
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        # Self Attention + Residual + Norm
        attention_output = self.self_attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attention_output))
        
        # Feed Forward + Residual + Norm
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_output))
        
        return x
```

### Decoder Layer
```python
class TransformerDecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        # Masked Self Attention
        self.self_attention = MultiHeadAttention(d_model, num_heads)
        
        # Cross Attention (Encoder-Decoder Attention)
        self.cross_attention = MultiHeadAttention(d_model, num_heads)
        
        # Feed Forward
        self.feed_forward = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x, encoder_output, src_mask=None, tgt_mask=None):
        # Masked Self Attention
        self_att = self.self_attention(x, x, x, tgt_mask)
        x = self.norm1(x + self.dropout(self_att))
        
        # Cross Attention
        cross_att = self.cross_attention(x, encoder_output, encoder_output, src_mask)
        x = self.norm2(x + self.dropout(cross_att))
        
        # Feed Forward
        ff_output = self.feed_forward(x)
        x = self.norm3(x + self.dropout(ff_output))
        
        return x
```

## Componentes Fundamentais

### Positional Encoding
```python
import math

def positional_encoding(seq_len, d_model):
    """
    Adiciona informação posicional aos embeddings
    PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
    PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
    """
    pe = torch.zeros(seq_len, d_model)
    position = torch.arange(0, seq_len).unsqueeze(1).float()
    
    div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                        -(math.log(10000.0) / d_model))
    
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    
    return pe

# Propriedades do PE sinusoidal:
# 1. Valores únicos para cada posição
# 2. Distância relativa consistente
# 3. Extrapolação para sequências mais longas
```

### Layer Normalization
```python
class LayerNorm(nn.Module):
    def __init__(self, features, eps=1e-6):
        super().__init__()
        self.gamma = nn.Parameter(torch.ones(features))
        self.beta = nn.Parameter(torch.zeros(features))
        self.eps = eps
    
    def forward(self, x):
        # Normalizar pela última dimensão (features)
        mean = x.mean(-1, keepdim=True)
        std = x.std(-1, keepdim=True)
        
        return self.gamma * (x - mean) / (std + self.eps) + self.beta

# Pre-norm vs Post-norm:
# Pre-norm: x = x + SubLayer(LayerNorm(x))
# Post-norm: x = LayerNorm(x + SubLayer(x))
```

### Feed Forward Network
```python
class PositionwiseFeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()
        self.w_1 = nn.Linear(d_model, d_ff)
        self.w_2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        self.activation = nn.ReLU()
    
    def forward(self, x):
        # FFN(x) = max(0, xW₁ + b₁)W₂ + b₂
        return self.w_2(self.dropout(self.activation(self.w_1(x))))

# Variações de ativação:
# - ReLU (original)
# - GELU (BERT, GPT)
# - Swish/SiLU
# - GLU variants
```

## Variantes de Transformer

### BERT (Bidirectional Encoder)
```python
class BERT(nn.Module):
    def __init__(self, vocab_size, d_model, num_heads, num_layers, max_seq_len):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model, max_seq_len)
        
        # Apenas Encoder Layers
        self.encoder_layers = nn.ModuleList([
            TransformerEncoderLayer(d_model, num_heads, d_model*4)
            for _ in range(num_layers)
        ])
        
        self.layer_norm = nn.LayerNorm(d_model)
    
    def forward(self, input_ids, attention_mask=None):
        # Embeddings + Positional Encoding
        x = self.embedding(input_ids) + self.positional_encoding
        
        # Encoder Layers
        for layer in self.encoder_layers:
            x = layer(x, attention_mask)
        
        return self.layer_norm(x)

# Características do BERT:
# - Bidirectional (vê todo o contexto)
# - Masked Language Modeling
# - Next Sentence Prediction
```

### GPT (Decoder-only)
```python
class GPT(nn.Module):
    def __init__(self, vocab_size, d_model, num_heads, num_layers, max_seq_len):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model, max_seq_len)
        
        # Apenas Decoder Layers (sem cross-attention)
        self.decoder_layers = nn.ModuleList([
            TransformerDecoderLayer(d_model, num_heads, d_model*4)
            for _ in range(num_layers)
        ])
        
        self.output_projection = nn.Linear(d_model, vocab_size)
    
    def forward(self, input_ids):
        seq_len = input_ids.size(1)
        
        # Causal mask (triangular superior)
        causal_mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()
        
        x = self.embedding(input_ids) + self.positional_encoding[:seq_len]
        
        for layer in self.decoder_layers:
            x = layer(x, mask=causal_mask)
        
        return self.output_projection(x)

# Características do GPT:
# - Autoregressive (unidirectional)
# - Causal masking
# - Language modeling objective
```

### T5 (Text-to-Text Transfer Transformer)
```python
class T5(nn.Module):
    def __init__(self, vocab_size, d_model, num_heads, num_layers):
        super().__init__()
        # Encoder-Decoder completo
        self.encoder = TransformerEncoder(vocab_size, d_model, num_heads, num_layers)
        self.decoder = TransformerDecoder(vocab_size, d_model, num_heads, num_layers)
    
    def forward(self, src_ids, tgt_ids):
        # Encode input
        encoder_output = self.encoder(src_ids)
        
        # Decode with cross-attention
        decoder_output = self.decoder(tgt_ids, encoder_output)
        
        return decoder_output

# Características do T5:
# - Text-to-text format
# - Relative positional encoding
# - Prefix LM objective
```

## Otimizações e Melhorias

### Attention Optimizations
```python
# Flash Attention - otimização de memória
# Sparse Attention - redução de complexidade
# Linear Attention - complexidade linear

class EfficientAttention(nn.Module):
    def __init__(self, d_model, num_heads, attention_type='full'):
        super().__init__()
        self.attention_type = attention_type
        self.d_model = d_model
        self.num_heads = num_heads
        
    def forward(self, q, k, v, mask=None):
        if self.attention_type == 'sparse':
            return self.sparse_attention(q, k, v, mask)
        elif self.attention_type == 'linear':
            return self.linear_attention(q, k, v)
        else:
            return self.full_attention(q, k, v, mask)
```

### Positional Encoding Variants
```python
# Relative Positional Encoding (T5)
class RelativePositionalEncoding(nn.Module):
    def __init__(self, d_model, max_distance=128):
        super().__init__()
        self.embeddings = nn.Embedding(2 * max_distance + 1, d_model)
        self.max_distance = max_distance
    
    def forward(self, seq_len):
        positions = torch.arange(seq_len).unsqueeze(0) - torch.arange(seq_len).unsqueeze(1)
        positions = torch.clamp(positions, -self.max_distance, self.max_distance)
        positions = positions + self.max_distance
        
        return self.embeddings(positions)

# Rotary Positional Embedding (RoPE)
class RotaryPositionalEmbedding(nn.Module):
    def __init__(self, d_model):
        super().__init__()
        self.d_model = d_model
    
    def forward(self, x, position_ids):
        # Aplicar rotação baseada na posição
        # Preserva informação relativa de posição
        return self.apply_rotary_emb(x, position_ids)
```

### Normalization Variants
```python
# RMSNorm - simplificação do LayerNorm
class RMSNorm(nn.Module):
    def __init__(self, d_model, eps=1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(d_model))
        self.eps = eps
    
    def forward(self, x):
        # Apenas normalização RMS, sem centralização
        rms = torch.sqrt(torch.mean(x**2, dim=-1, keepdim=True) + self.eps)
        return self.weight * x / rms

# Pre-norm vs Post-norm
# Pre-norm: melhor estabilidade de treinamento
# Post-norm: melhor performance em alguns casos
```

## Scaling Laws

### Model Scaling
```python
# Relação entre parâmetros e performance
# N = número de parâmetros
# D = tamanho do dataset
# C = compute (FLOPs)

# Chinchilla scaling laws:
# Optimal model size ∝ sqrt(compute_budget)
# Optimal dataset size ∝ sqrt(compute_budget)

def compute_optimal_size(compute_budget):
    # Simplificação das leis de escala
    optimal_params = int(compute_budget ** 0.5 / 10)
    optimal_tokens = int(compute_budget ** 0.5 * 20)
    
    return optimal_params, optimal_tokens
```

### Training Dynamics
```python
# Learning rate scheduling para Transformers
class TransformerLRScheduler:
    def __init__(self, d_model, warmup_steps=4000):
        self.d_model = d_model
        self.warmup_steps = warmup_steps
    
    def get_lr(self, step):
        # Warmup seguido de decay
        arg1 = step ** -0.5
        arg2 = step * (self.warmup_steps ** -1.5)
        
        return (self.d_model ** -0.5) * min(arg1, arg2)
```

## Aplicações e Casos de Uso

### Language Modeling
```python
# GPT-style autoregressive generation
def generate_text(model, prompt, max_length=100):
    model.eval()
    tokens = tokenizer.encode(prompt)
    
    for _ in range(max_length):
        with torch.no_grad():
            logits = model(torch.tensor([tokens]))
            next_token = torch.multinomial(torch.softmax(logits[0, -1], dim=-1), 1)
            tokens.append(next_token.item())
            
            if next_token.item() == tokenizer.eos_token_id:
                break
    
    return tokenizer.decode(tokens)
```

### Sequence Classification
```python
# BERT-style classification
class TransformerClassifier(nn.Module):
    def __init__(self, transformer, num_classes):
        super().__init__()
        self.transformer = transformer
        self.classifier = nn.Linear(transformer.d_model, num_classes)
    
    def forward(self, input_ids, attention_mask=None):
        outputs = self.transformer(input_ids, attention_mask)
        # Use [CLS] token for classification
        cls_output = outputs[:, 0, :]
        return self.classifier(cls_output)
```

### Machine Translation
```python
# Encoder-Decoder translation
class TransformerTranslator(nn.Module):
    def __init__(self, src_vocab, tgt_vocab, d_model, num_heads, num_layers):
        super().__init__()
        self.encoder = TransformerEncoder(src_vocab, d_model, num_heads, num_layers)
        self.decoder = TransformerDecoder(tgt_vocab, d_model, num_heads, num_layers)
    
    def forward(self, src, tgt):
        encoder_output = self.encoder(src)
        decoder_output = self.decoder(tgt, encoder_output)
        return decoder_output
```

## Limitações e Desafios

### Computational Complexity
- Complexidade quadrática O(n²) em memória e tempo
- Limitação de comprimento de sequência
- Necessidade de hardware especializado

### Data Requirements
- Necessita grandes quantidades de dados
- Sensitive a qualidade dos dados
- Viés presente nos dados de treinamento

### Interpretability
- Dificuldade em interpretar decisões
- Attention não necessariamente indica causalidade
- Comportamento emergente difícil de prever
