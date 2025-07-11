# Overfitting e Underfitting

Dois dos problemas mais fundamentais em machine learning são o **overfitting** (sobreajuste) e o **underfitting** (subajuste). Entender esses conceitos é crucial para desenvolver modelos que generalizem bem para dados não vistos.

## O que é Overfitting?

**Overfitting** ocorre quando um modelo aprende os dados de treinamento de forma muito específica, incluindo o ruído e as peculiaridades dos dados, resultando em:

- **Alta performance no conjunto de treinamento**
- **Baixa performance no conjunto de teste**
- **Baixa capacidade de generalização**

### Analogia
É como um estudante que decora todas as respostas de um simulado específico, mas não entende os conceitos. Ele vai muito bem naquele simulado, mas falha em questões diferentes.

### Sinais de Overfitting
- Grande diferença entre acurácia de treino e teste
- Modelo muito complexo para o tamanho dos dados
- Performance degrada com novos dados

## O que é Underfitting?

**Underfitting** ocorre quando um modelo é muito simples para capturar os padrões subjacentes dos dados, resultando em:

- **Baixa performance no conjunto de treinamento**
- **Baixa performance no conjunto de teste**
- **Modelo muito simplista**

### Analogia
É como um estudante que não estudou o suficiente e não entende nem os conceitos básicos. Ele vai mal tanto no simulado quanto na prova real.

### Sinais de Underfitting
- Performance ruim tanto em treino quanto em teste
- Modelo muito simples
- Incapaz de capturar padrões óbvios nos dados

## Visualizando os Conceitos

```
Performance
     ↑
     |     Overfitting
     |        /\
     |       /  \
     |  Bom /    \
     | Fit /      \
     |    /        \
Underfitting      \
     |              \
     |________________\→ Complexidade do Modelo
```

## Causas Comuns

### Overfitting
- **Modelo muito complexo** (muitos parâmetros)
- **Poucos dados de treinamento**
- **Treinamento por muito tempo**
- **Ausência de regularização**
- **Features irrelevantes ou ruidosas**

### Underfitting
- **Modelo muito simples**
- **Features insuficientes ou inadequadas**
- **Treinamento insuficiente**
- **Regularização excessiva**

## Estratégias para Combater

### Combatendo Overfitting

#### Mais Dados
```python
# Aumentar o conjunto de treinamento
# Data augmentation para imagens
from keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True
)
```

#### Regularização
```python
# L1 e L2 Regularization
from sklearn.linear_model import Ridge, Lasso

# L2 (Ridge)
model = Ridge(alpha=1.0)

# L1 (Lasso)
model = Lasso(alpha=1.0)
```

#### Dropout (Redes Neurais)
```python
from keras.layers import Dropout

model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))  # Remove 50% dos neurônios aleatoriamente
```

#### Early Stopping
```python
from keras.callbacks import EarlyStopping

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)
```

#### Validação Cruzada
```python
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5)
print(f"Acurácia média: {scores.mean():.2f} (+/- {scores.std() * 2:.2f})")
```

### Combatendo Underfitting

#### Aumentar Complexidade do Modelo
```python
# Adicionar mais camadas/neurônios
model.add(Dense(256, activation='relu'))  # Mais neurônios
model.add(Dense(128, activation='relu'))  # Mais camadas
```

#### Feature Engineering
```python
# Criar novas features
df['feature_interaction'] = df['feature1'] * df['feature2']
df['feature_polynomial'] = df['feature1'] ** 2
```

#### Reduzir Regularização
```python
# Diminuir alpha na regularização
model = Ridge(alpha=0.1)  # Menos regularização
```

#### Treinar por Mais Tempo
```python
# Mais épocas de treinamento
model.fit(X_train, y_train, epochs=200)  # Mais épocas
```

## Exemplo Prático: Polinômios

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

# Dados sintéticos
np.random.seed(42)
X = np.linspace(0, 1, 100).reshape(-1, 1)
y = 2 * X.ravel() + np.sin(2 * np.pi * X.ravel()) + np.random.normal(0, 0.1, 100)

# Diferentes graus de polinômio
degrees = [1, 4, 15]
colors = ['red', 'green', 'blue']
labels = ['Underfitting (grau 1)', 'Bom ajuste (grau 4)', 'Overfitting (grau 15)']

plt.figure(figsize=(15, 5))

for i, degree in enumerate(degrees):
    plt.subplot(1, 3, i+1)
    
    # Criar modelo polinomial
    poly_model = Pipeline([
        ('poly', PolynomialFeatures(degree=degree)),
        ('linear', LinearRegression())
    ])
    
    # Treinar modelo
    poly_model.fit(X, y)
    
    # Predições
    X_plot = np.linspace(0, 1, 300).reshape(-1, 1)
    y_pred = poly_model.predict(X_plot)
    
    # Plot
    plt.scatter(X, y, alpha=0.6, color='black', s=20)
    plt.plot(X_plot, y_pred, color=colors[i], linewidth=2)
    plt.title(labels[i])
    plt.xlabel('X')
    plt.ylabel('y')

plt.tight_layout()
plt.show()
```

## Bias-Variance Tradeoff

O overfitting e underfitting estão relacionados ao **bias-variance tradeoff**:

### High Bias (Alto Viés) = Underfitting
- Modelo faz suposições muito simplistas
- Erro sistemático alto
- Baixa flexibilidade

### High Variance (Alta Variância) = Overfitting
- Modelo muito sensível a pequenas mudanças nos dados
- Resultados inconsistentes
- Alta flexibilidade

### Equilíbrio Ideal
```
Erro Total = Bias² + Variância + Ruído Irredutível
```

## Detectando na Prática

### Curvas de Aprendizado
```python
from sklearn.model_selection import learning_curve

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5, 
    train_sizes=np.linspace(0.1, 1.0, 10)
)

plt.plot(train_sizes, np.mean(train_scores, axis=1), label='Treino')
plt.plot(train_sizes, np.mean(val_scores, axis=1), label='Validação')
plt.legend()
plt.xlabel('Tamanho do conjunto de treino')
plt.ylabel('Acurácia')
plt.title('Curva de Aprendizado')
```

### Curvas de Validação
```python
from sklearn.model_selection import validation_curve

param_range = [0.001, 0.01, 0.1, 1.0, 10.0]
train_scores, val_scores = validation_curve(
    model, X, y, param_name='alpha', 
    param_range=param_range, cv=5
)
```

## Algoritmos Susceptíveis

### Propensos ao Overfitting
- **Árvores de Decisão** (sem poda)
- **KNN com K muito baixo** → [K-Vizinhos (Algoritmos)](../algoritmos/k-vizinhos.md)
- **Redes Neurais** (muitos parâmetros)
- **SVM com RBF** (gamma alto)

### Propensos ao Underfitting
- **Regressão Linear** (dados não-lineares)
- **KNN com K muito alto** → [K-Vizinhos (Algoritmos)](../algoritmos/k-vizinhos.md)
- **Modelos muito regularizados**

## Melhores Práticas

- **Sempre dividir os dados** em treino/validação/teste
- **Usar validação cruzada** para avaliação robusta
- **Monitorar métricas** durante o treinamento
- **Começar simples** e aumentar complexidade gradualmente
- **Aplicar regularização** preventivamente
- **Mais dados sempre ajudam** contra overfitting
- **Feature engineering** ajuda contra underfitting

## Conclusão

Encontrar o equilíbrio entre overfitting e underfitting é uma arte que requer:
- **Experiência prática**
- **Experimentação constante**
- **Validação rigorosa**
- **Entendimento dos dados**

Lembre-se: um modelo que generaliza bem é mais valioso que um modelo perfeito nos dados de treino!
