# Tokens em Deep Learning

Tokens são as unidades básicas de processamento em modelos de linguagem e sistemas de processamento de texto, representando pedaços discretos de informação.

## Conceito Básico
- Unidade fundamental de processamento de texto
- Representação numérica de palavras, subpalavras ou caracteres
- Base para embeddings e processamento neural
- Granularidade variável dependendo da estratégia de tokenização

## Tipos de Tokenização

### Word-level Tokenization
```python
# Tokenização por palavras
texto = "O gato subiu no telhado"
tokens = texto.split()
# ['O', 'gato', 'subiu', 'no', 'telhado']

# Problemas:
# - Vocabulário muito grande
# - Palavras fora do vocabulário (OOV)
# - Não captura morfologia
```

### Character-level Tokenization
```python
# Tokenização por caracteres
texto = "hello"
tokens = list(texto)
# ['h', 'e', 'l', 'l', 'o']

# Vantagens:
# - Vocabulário pequeno
# - Sem problema de OOV
# - Captura morfologia

# Desvantagens:
# - Sequências muito longas
# - Perde semântica de palavras
```

### Subword Tokenization
```python
# BPE (Byte Pair Encoding)
# SentencePiece
# WordPiece

# Exemplo com transformers
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
tokens = tokenizer.tokenize("tokenization")
# ['token', '##ization']

# Balança vocabulário e granularidade
```

## Algoritmos de Tokenização

### BPE (Byte Pair Encoding)
```python
# Processo iterativo
# 1. Começa com caracteres
# 2. Encontra par mais frequente
# 3. Merge em novo token
# 4. Repete até vocabulário desejado

# Exemplo de treinamento BPE
corpus = ["low", "lower", "newest", "widest"]
# Iteração 1: 'e' + 's' = 'es' (mais frequente)
# Iteração 2: 'es' + 't' = 'est'
# Continue...
```

### WordPiece (BERT)
```python
# Similar ao BPE mas usa likelihood
# Maximiza probabilidade dos dados de treino

# Exemplo
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
text = "unwanted"
tokens = tokenizer.tokenize(text)
# ['un', '##want', '##ed']
# ## indica continuação de palavra
```

### SentencePiece (T5, mT5)
```python
# Trata texto como sequência de caracteres Unicode
# Não assume espaços como separadores
# Melhor para idiomas sem espaços (chinês, japonês)

import sentencepiece as spm
sp = spm.SentencePieceProcessor()
sp.load('model.model')
tokens = sp.encode_as_pieces("This is a test")
# ['▁This', '▁is', '▁a', '▁test']
# ▁ representa espaço original
```

## Embeddings de Tokens

### Token-to-Vector Mapping
```python
# Cada token é mapeado para vetor denso
# Tamanho típico: 512, 768, 1024 dimensões

import torch
import torch.nn as nn

vocab_size = 30000
embedding_dim = 768
token_embedding = nn.Embedding(vocab_size, embedding_dim)

# Token ID para embedding
token_id = torch.tensor([1, 2, 3])  # IDs dos tokens
embeddings = token_embedding(token_id)
# Shape: [3, 768]
```

### Positional Embeddings
```python
# Tokens precisam de informação posicional
# Transformer não tem noção inerente de ordem

# Sinusoidal (Transformer original)
def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, d_model, 2) * 
                        -(math.log(10000.0) / d_model))
    pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos * div_term)
    pe[:, 1::2] = torch.cos(pos * div_term)
    return pe

# Learned Positional (BERT)
pos_embedding = nn.Embedding(max_seq_len, embedding_dim)
```

## Tokens Especiais

### Tokens de Controle
```python
# [CLS] - Classification token (BERT)
# [SEP] - Separator token
# [PAD] - Padding token
# [UNK] - Unknown token
# [MASK] - Masked token

# Exemplo BERT
text = "[CLS] Hello world [SEP] How are you? [SEP]"
tokens = tokenizer.tokenize(text)

# GPT style
# <|endoftext|> - End of text
# <|startoftext|> - Start of text
```

### Attention Masks
```python
# Máscara para ignorar tokens de padding
sequence = ["Hello", "world", "[PAD]", "[PAD]"]
attention_mask = [1, 1, 0, 0]  # 1=attend, 0=ignore

# Previne atenção para tokens irrelevantes
attention_scores = attention_scores.masked_fill(
    attention_mask == 0, -float('inf')
)
```

## Processamento de Tokens

### Batching e Padding
```python
# Sequências de tamanhos diferentes precisam de padding
sequences = [
    [1, 2, 3],           # "hello world"
    [1, 2, 3, 4, 5, 6],  # "hello beautiful world today"
    [1, 2]               # "hello"
]

# Padding para mesmo tamanho
max_len = 6
padded = [
    [1, 2, 3, 0, 0, 0],  # 0 = [PAD]
    [1, 2, 3, 4, 5, 6],
    [1, 2, 0, 0, 0, 0]
]
```

### Truncation
```python
# Sequências muito longas são truncadas
max_length = 512  # Limite do BERT

# Estratégias de truncação
# - Truncate da direita (mais comum)
# - Truncate da esquerda
# - Truncate do meio
```

## Vocabulário e OOV

### Construção de Vocabulário
```python
# Coleta estatísticas do corpus
# Define tamanho do vocabulário (10k, 30k, 50k)
# Inclui tokens especiais
# Ordena por frequência

vocab = {
    "[PAD]": 0,
    "[UNK]": 1,
    "[CLS]": 2,
    "[SEP]": 3,
    "the": 4,
    "a": 5,
    # ... tokens mais frequentes
}
```

### Handling OOV
```python
# Palavras não vistas no treino
# Estratégias:
# 1. Mapear para [UNK]
# 2. Subword tokenization (BPE, WordPiece)
# 3. Character fallback

def tokenize_with_oov(text, vocab):
    tokens = []
    for word in text.split():
        if word in vocab:
            tokens.append(vocab[word])
        else:
            tokens.append(vocab["[UNK]"])
    return tokens
```

## Token Sharing e Similarity

### Proximidade Semântica
```python
# Tokens similares têm embeddings próximos
# Distância coseno mede similaridade

def cosine_similarity(a, b):
    return torch.dot(a, b) / (torch.norm(a) * torch.norm(b))

# Embeddings de tokens relacionados
king_emb = token_embedding(vocab["king"])
queen_emb = token_embedding(vocab["queen"])
man_emb = token_embedding(vocab["man"])
woman_emb = token_embedding(vocab["woman"])

# king - man + woman ≈ queen
result = king_emb - man_emb + woman_emb
similarity = cosine_similarity(result, queen_emb)
```

### Token Clustering
```python
# Tokens semanticamente similares formam clusters
# Visualização com t-SNE ou PCA

from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

# Reduzir dimensionalidade para visualização
embeddings_2d = TSNE(n_components=2).fit_transform(
    token_embeddings.detach().numpy()
)

plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1])
# Tokens similares aparecem próximos
```

## Otimização de Tokens

### Token Efficiency
```python
# Escolha de vocabulário afeta performance
# Trade-off entre:
# - Tamanho do vocabulário
# - Comprimento das sequências
# - Expressividade semântica

# Métricas de eficiência
compression_ratio = len(original_text) / len(tokens)
vocab_coverage = known_tokens / total_tokens
```

### Dynamic Tokenization
```python
# Alguns modelos ajustam tokenização
# Baseado no contexto ou domínio
# Adaptive vocabularies
# Domain-specific tokens

# Exemplo: tokens específicos para código
code_tokens = ["def", "class", "import", "return", "if", "else"]
# Tokens específicos para medicina
medical_tokens = ["diagnosis", "patient", "treatment", "symptom"]
```

## Impacto na Performance

### Token Granularity vs Performance
- **Granularidade fina** (caracteres): Sequências longas, mais computação
- **Granularidade grossa** (palavras): Vocabulário grande, problemas de OOV
- **Subwords**: Balanceamento ótimo para a maioria dos casos

### Memory and Computation
```python
# Custo computacional O(n²) para self-attention
# onde n = número de tokens
sequence_length = len(tokens)
attention_complexity = sequence_length ** 2

# Estratégias de otimização:
# - Sparse attention
# - Local attention windows
# - Token pruning
```
