# Self Attention

Self Attention é o mecanismo central dos Transformers que permite a cada token "olhar" para todos os outros tokens na sequência e calcular sua importância relativa.

## Conceito Básico
- Cada token pode "atender" a qualquer outro token na sequência
- Captura dependências de longo alcance
- Paralelizável (não sequencial como RNNs)
- Base dos modelos Transformer

## Matemática da Self Attention

### Fórmula Fundamental
```python
# Attention(Q, K, V) = softmax(QK^T / √d_k)V

# Onde:
# Q = Queries (o que estamos procurando)
# K = Keys (onde procurar)
# V = Values (o que extrair)
# d_k = dimensão das keys (para normalização)
```

### Implementação Passo a Passo
```python
import torch
import torch.nn as nn
import math

def self_attention(x, d_model):
    """
    x: [batch_size, seq_len, d_model]
    """
    batch_size, seq_len, d_model = x.shape
    
    # 1. Criar matrizes Q, K, V
    W_q = nn.Linear(d_model, d_model, bias=False)
    W_k = nn.Linear(d_model, d_model, bias=False)
    W_v = nn.Linear(d_model, d_model, bias=False)
    
    Q = W_q(x)  # [batch, seq_len, d_model]
    K = W_k(x)  # [batch, seq_len, d_model]
    V = W_v(x)  # [batch, seq_len, d_model]
    
    # 2. Calcular scores de atenção
    scores = torch.matmul(Q, K.transpose(-2, -1))  # [batch, seq_len, seq_len]
    
    # 3. Escalar por √d_k
    scores = scores / math.sqrt(d_model)
    
    # 4. Aplicar softmax
    attention_weights = torch.softmax(scores, dim=-1)
    
    # 5. Aplicar pesos aos valores
    output = torch.matmul(attention_weights, V)  # [batch, seq_len, d_model]
    
    return output, attention_weights
```

## Intuição do Self Attention

### Como Funciona
```python
# Exemplo conceitual com frase: "O gato subiu no telhado"
sequence = ["O", "gato", "subiu", "no", "telhado"]

# Para cada palavra (query), calculamos:
# - Quão relacionada está com cada palavra (key)
# - O que extrair de cada relacionamento (value)

# Quando processamos "gato":
# Query("gato") ∙ Key("O") = baixa relevância
# Query("gato") ∙ Key("gato") = alta relevância  
# Query("gato") ∙ Key("subiu") = média relevância
# Query("gato") ∙ Key("no") = baixa relevância
# Query("gato") ∙ Key("telhado") = baixa relevância
```

### Matriz de Atenção
```python
# Matriz simétrica seq_len x seq_len
# attention_matrix[i][j] = quanta atenção token i dá ao token j

# Exemplo visual:
#           O    gato  subiu   no  telhado
# O      [0.1   0.2   0.1   0.3    0.3  ]
# gato   [0.1   0.6   0.2   0.05   0.05 ]
# subiu  [0.05  0.3   0.4   0.1    0.15 ]
# no     [0.2   0.1   0.2   0.3    0.2  ]
# telhado[0.1   0.05  0.15  0.2    0.5  ]
```

## Multi-Head Attention

### Conceito
```python
# Múltiplas "cabeças" de atenção em paralelo
# Cada cabeça captura diferentes tipos de relacionamentos
# Cabeça 1: pode focar em sintaxe
# Cabeça 2: pode focar em semântica
# Cabeça 3: pode focar em co-referência

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def forward(self, x):
        batch_size, seq_len, d_model = x.shape
        
        # 1. Transformações lineares e reshape para múltiplas cabeças
        Q = self.W_q(x).view(batch_size, seq_len, self.num_heads, self.d_k)
        K = self.W_k(x).view(batch_size, seq_len, self.num_heads, self.d_k)
        V = self.W_v(x).view(batch_size, seq_len, self.num_heads, self.d_k)
        
        # 2. Transpose para [batch, num_heads, seq_len, d_k]
        Q = Q.transpose(1, 2)
        K = K.transpose(1, 2)
        V = V.transpose(1, 2)
        
        # 3. Scaled dot-product attention para cada cabeça
        attention_output = self.scaled_dot_product_attention(Q, K, V)
        
        # 4. Concatenar cabeças
        attention_output = attention_output.transpose(1, 2).contiguous()
        attention_output = attention_output.view(batch_size, seq_len, d_model)
        
        # 5. Projeção final
        output = self.W_o(attention_output)
        return output
```

## Tipos de Atenção

### 1. Self Attention (Padrão)
```python
# Todos os tokens podem atender a todos os tokens
# Usado em layers encoder

# Causal Self Attention (GPT)
# Token só pode atender a tokens anteriores
mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
scores = scores.masked_fill(mask == 1, -float('inf'))
```

### 2. Cross Attention
```python
# Queries de uma sequência, Keys/Values de outra
# Usado em decoder para atender ao encoder

def cross_attention(decoder_hidden, encoder_outputs):
    Q = W_q(decoder_hidden)      # [batch, decoder_len, d_model]
    K = W_k(encoder_outputs)     # [batch, encoder_len, d_model]
    V = W_v(encoder_outputs)     # [batch, encoder_len, d_model]
    
    # Atenção cruzada entre sequências
    scores = torch.matmul(Q, K.transpose(-2, -1))
    attention_weights = torch.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, V)
    return output
```

### 3. Masked Self Attention
```python
# Impede que tokens vejam tokens futuros
# Usado em modelos de linguagem (GPT)

def create_causal_mask(seq_len):
    mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
    return mask.bool()

# Aplicar máscara
mask = create_causal_mask(seq_len)
scores = scores.masked_fill(mask, -float('inf'))
```

## Problemas e Limitações

### 1. Complexidade Quadrática
```python
# O(n²) em memória e computação
# Problemático para sequências longas

# Para sequência de 1000 tokens:
# Matriz de atenção: 1000 x 1000 = 1M elementos
# Para sequência de 10000 tokens:
# Matriz de atenção: 10000 x 10000 = 100M elementos
```

### 2. Falta de Noção Posicional
```python
# Self attention é permutation invariant
# Precisa de positional encodings

# Sem posição: "gato subiu" == "subiu gato"
# Com posição: consegue distinguir ordem
```

## Otimizações do Self Attention

### 1. Sparse Attention
```python
# Nem todos os tokens precisam atender a todos
# Patterns específicos de atenção

# Local Attention: apenas janela local
# Strided Attention: padrão esparso regular
# Random Attention: conexões aleatórias
```

### 2. Linear Attention
```python
# Aproximações que reduzem complexidade para O(n)
# Kernelized attention
# Performer, Linear Transformer

def linear_attention(Q, K, V):
    # Aplicar kernel trick
    Q_prime = phi(Q)  # Função de feature map
    K_prime = phi(K)
    
    # O(n) ao invés de O(n²)
    KV = torch.matmul(K_prime.transpose(-2, -1), V)
    output = torch.matmul(Q_prime, KV)
    return output
```

### 3. Flash Attention
```python
# Otimização de memória sem mudar matemática
# Computa atenção em blocos (tiling)
# Reduz transferências de memória

# Pseudocódigo conceitual
for block_i in range(num_blocks):
    for block_j in range(num_blocks):
        # Carrega apenas bloco necessário
        Q_block = load_block(Q, block_i)
        K_block = load_block(K, block_j)
        V_block = load_block(V, block_j)
        
        # Computa atenção local
        attention_block = compute_attention(Q_block, K_block, V_block)
```

## Interpretabilidade

### Visualização de Attention
```python
# Attention weights mostram relacionamentos
# Útil para debugging e interpretação

def plot_attention(attention_weights, tokens):
    import matplotlib.pyplot as plt
    import seaborn as sns
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(attention_weights, 
                xticklabels=tokens, 
                yticklabels=tokens,
                cmap='Blues')
    plt.title('Attention Weights')
    plt.show()

# Padrões comuns observados:
# - Attention to punctuation
# - Subject-verb relationships  
# - Co-reference resolution
# - Syntactic dependencies
```

### Attention Rollout
```python
# Propagar atenção através de layers
# Ver fluxo de informação end-to-end

def attention_rollout(attention_matrices):
    # attention_matrices: lista de matrizes por layer
    rollout = attention_matrices[0]
    
    for layer_attention in attention_matrices[1:]:
        rollout = torch.matmul(layer_attention, rollout)
    
    return rollout
```

## Aplicações Específicas

### 1. Language Modeling
```python
# GPT-style: causal self attention
# Predição do próximo token

# Máscara triangular superior
causal_mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
```

### 2. Sentence Classification
```python
# BERT-style: bidirectional self attention
# Token [CLS] acumula informação da sequência

# Representação final = embedding do [CLS]
cls_representation = output[:, 0, :]  # Primeiro token
```

### 3. Machine Translation
```python
# Encoder-Decoder com cross attention
# Decoder atende ao encoder e próprio contexto

class TransformerDecoder(nn.Module):
    def forward(self, tgt, encoder_output):
        # Self attention (com máscara causal)
        tgt = self.self_attention(tgt, causal_mask=True)
        
        # Cross attention com encoder
        tgt = self.cross_attention(tgt, encoder_output)
        
        return tgt
```
