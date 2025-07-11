# K-Vizinhos Mais Próximos (K-Nearest Neighbors - KNN)

O algoritmo K-Nearest Neighbors (KNN) é um dos algoritmos de aprendizado de máquina mais simples e intuitivos. Ele classifica novos pontos de dados baseado na "vizinhança" - ou seja, nos K pontos mais próximos no conjunto de treinamento.

## Como Funciona?

- **Escolha o valor de K** (número de vizinhos)
- **Calcule a distância** entre o novo ponto e todos os pontos do conjunto de treinamento
- **Encontre os K vizinhos mais próximos**
- **Para classificação:** Vote pela classe mais comum entre os K vizinhos
- **Para regressão:** Calcule a média dos valores dos K vizinhos

## Características Principais

- **Algoritmo "preguiçoso" (Lazy):** Não constrói um modelo durante o treinamento
- **Não-paramétrico:** Não faz suposições sobre a distribuição dos dados
- **Baseado em instâncias:** Armazena todo o conjunto de treinamento
- **Sensível à escala:** Distâncias podem ser dominadas por features com valores maiores

## Métricas de Distância

### Distância Euclidiana (mais comum)
```
d = √[(x₁-x₂)² + (y₁-y₂)²]
```

### Distância de Manhattan
```
d = |x₁-x₂| + |y₁-y₂|
```

### Distância de Minkowski
```
d = (Σ|xᵢ-yᵢ|ᵖ)^(1/p)
```

## Exemplo Prático: Classificação de Filmes

Imagine que queremos classificar se um filme é "Comédia" ou "Drama" baseado em duas características:
- Duração (minutos)
- Classificação etária

**Dados de treinamento:**
```
Filme A: (90 min, 12 anos) → Comédia
Filme B: (150 min, 16 anos) → Drama  
Filme C: (95 min, 10 anos) → Comédia
Filme D: (140 min, 18 anos) → Drama
Filme E: (85 min, 14 anos) → Comédia
```

**Novo filme:** (100 min, 12 anos) → ?

**Com K=3:**
- Calcular distâncias para todos os filmes
- Encontrar os 3 mais próximos
- Votar pela classe majoritária

## Escolhendo o Valor de K

### K muito pequeno (K=1):
- **Vantagem:** Sensível a padrões locais
- **Desvantagem:** Sensível a ruído e outliers

### K muito grande:
- **Vantagem:** Mais estável, menos sensível a ruído
- **Desvantagem:** Pode ignorar padrões locais

### Regras práticas:
- **K ímpar** para evitar empates em classificação binária
- **K = √n** onde n é o número de amostras de treinamento
- **Validação cruzada** para encontrar o K ótimo

## Implementação Simples (Python)

```python
import numpy as np
from collections import Counter

class KNN:
    def __init__(self, k=3):
        self.k = k
    
    def fit(self, X, y):
        self.X_train = X
        self.y_train = y
    
    def euclidean_distance(self, x1, x2):
        return np.sqrt(np.sum((x1 - x2)**2))
    
    def predict(self, X):
        predictions = []
        for x in X:
            # Calcular distâncias
            distances = [self.euclidean_distance(x, x_train) 
                        for x_train in self.X_train]
            
            # Encontrar K vizinhos mais próximos
            k_indices = np.argsort(distances)[:self.k]
            k_nearest_labels = [self.y_train[i] for i in k_indices]
            
            # Votar pela classe mais comum
            most_common = Counter(k_nearest_labels).most_common(1)
            predictions.append(most_common[0][0])
        
        return predictions
```

## Vantagens

- **Simplicidade:** Fácil de entender e implementar
- **Não faz suposições:** Funciona com dados não-lineares
- **Versatilidade:** Serve para classificação e regressão
- **Adaptabilidade:** Pode se adaptar facilmente a novos dados

## Desvantagens

- **Computacionalmente caro:** O(n) para cada predição
- **Sensível à escala:** Features com escalas diferentes podem dominar
- **Sensível à dimensionalidade:** Performance degrada em altas dimensões (maldição da dimensionalidade)
- **Memória:** Precisa armazenar todo o conjunto de treinamento

## Melhorias e Variações

### KNN Ponderado
- Dar mais peso aos vizinhos mais próximos
- Peso = 1/distância

### Normalização de Features
```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_normalized = scaler.fit_transform(X)
```

### Estruturas de Dados Eficientes
- **KD-Tree:** Para baixas dimensões
- **Ball Tree:** Para altas dimensões
- **LSH (Locality Sensitive Hashing):** Para datasets muito grandes

## Casos de Uso

- **Sistemas de recomendação:** "Usuários similares a você também compraram..."
- **Reconhecimento de padrões:** Classificação de imagens
- **Análise de sentimentos:** Classificação de textos
- **Detecção de anomalias:** Identificar pontos muito distantes dos vizinhos
- **Preenchimento de valores faltantes:** Usar média dos K vizinhos

## Quando NÃO usar KNN

- **Datasets muito grandes:** Performance inadequada
- **Muitas dimensões:** Maldição da dimensionalidade
- **Dados esparsos:** Distâncias se tornam menos significativas
- **Tempo real crítico:** Predições são lentas
