# K-Vizinhos Mais Próximos (KNN) em Machine Learning

O **K-Nearest Neighbors (KNN)** é um dos algoritmos de machine learning mais fundamentais e intuitivos. Diferente de outros algoritmos que constroem modelos complexos durante o treinamento, o KNN é um algoritmo "preguiçoso" que simplesmente armazena os dados e faz predições baseadas na similaridade.

## Por que KNN é Machine Learning?

### Aprendizado Supervisionado
- **Aprende com exemplos rotulados** durante a fase de treinamento
- **Generaliza para novos dados** não vistos anteriormente
- **Melhora com mais dados** de qualidade

### Capacidade de Generalização
- **Identifica padrões** nos dados de treinamento
- **Aplica conhecimento** para classificar/prever novos casos
- **Adapta-se** a diferentes tipos de problemas

## KNN vs Outros Algoritmos de ML

| Característica | KNN | Árvore de Decisão | SVM | Redes Neurais |
|---|---|---|---|---|
| **Tipo** | Instance-based | Model-based | Model-based | Model-based |
| **Treinamento** | Instantâneo | Médio | Lento | Muito lento |
| **Predição** | Lento | Rápido | Rápido | Rápido |
| **Interpretabilidade** | Alta | Alta | Baixa | Muito baixa |
| **Memória** | Alta | Baixa | Média | Média |

## Aplicações em Machine Learning

### **Sistemas de Recomendação**
```python
# Recomendar filmes baseado em usuários similares
def recomendar_filmes(usuario_id, k=5):
    # Encontrar K usuários mais similares
    usuarios_similares = knn.kneighbors([perfil_usuario], n_neighbors=k)
    
    # Recomendar filmes que esses usuários gostaram
    filmes_recomendados = []
    for usuario_similar in usuarios_similares:
        filmes_recomendados.extend(filmes_curtidos[usuario_similar])
    
    return filmes_recomendados
```

### **Detecção de Anomalias**
```python
# Detectar transações fraudulentas
def detectar_fraude(transacao, k=10):
    # Encontrar K transações mais similares
    vizinhos = knn.kneighbors([transacao], n_neighbors=k)
    
    # Se a distância média for muito alta, pode ser anomalia
    distancia_media = np.mean(vizinhos.distances)
    
    return distancia_media > threshold_anomalia
```

### **Classificação de Imagens**
```python
# Classificar dígitos manuscritos
from sklearn.datasets import load_digits
from sklearn.neighbors import KNeighborsClassifier

digits = load_digits()
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(digits.data, digits.target)

# Predizer novo dígito
novo_digito = digits.data[0].reshape(1, -1)
predicao = knn.predict(novo_digito)
```

### **Processamento de Linguagem Natural**
```python
# Classificação de sentimentos em textos
from sklearn.feature_extraction.text import TfidfVectorizer

# Vetorizar textos
vectorizer = TfidfVectorizer(max_features=1000)
X_vectorized = vectorizer.fit_transform(textos)

# Treinar KNN
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_vectorized, sentimentos)
```

## KNN na Pipeline de Machine Learning

### **Pré-processamento Crítico**
```python
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Pipeline completa para KNN
pipeline_knn = Pipeline([
    ('scaler', StandardScaler()),  # ESSENCIAL para KNN
    ('knn', KNeighborsClassifier(n_neighbors=5))
])

pipeline_knn.fit(X_train, y_train)
```

### **Validação e Tuning**
```python
from sklearn.model_selection import GridSearchCV

# Busca pelos melhores hiperparâmetros
param_grid = {
    'n_neighbors': [3, 5, 7, 9, 11],
    'weights': ['uniform', 'distance'],
    'metric': ['euclidean', 'manhattan']
}

grid_search = GridSearchCV(
    KNeighborsClassifier(),
    param_grid,
    cv=5,
    scoring='accuracy'
)

grid_search.fit(X_train, y_train)
print(f"Melhores parâmetros: {grid_search.best_params_}")
```

## Vantagens do KNN em ML

### **Simplicidade**
- Fácil de entender e implementar
- Não requer conhecimento de matemática avançada
- Ótimo para prototipagem rápida

### **Flexibilidade**
- Funciona com dados numéricos e categóricos
- Pode ser usado para classificação e regressão
- Adapta-se a qualquer distribuição de dados

### **Interpretabilidade**
- Decisões são explicáveis
- Pode-se ver exatamente quais exemplos influenciaram a predição
- Útil em domínios onde explicabilidade é crucial

## Limitações em Contextos de ML

### **Escalabilidade**
```python
# Problema: O(n) para cada predição
import time

start_time = time.time()
predictions = knn.predict(X_test)  # Lento para datasets grandes
end_time = time.time()

print(f"Tempo de predição: {end_time - start_time:.2f} segundos")
```

### **Maldição da Dimensionalidade**
```python
# Demonstração da degradação com muitas dimensões
from sklearn.datasets import make_classification

# Performance com poucas dimensões
X_low, y = make_classification(n_features=5, n_informative=5)
score_low = cross_val_score(knn, X_low, y, cv=5).mean()

# Performance com muitas dimensões
X_high, y = make_classification(n_features=100, n_informative=5)
score_high = cross_val_score(knn, X_high, y, cv=5).mean()

print(f"Score (5 features): {score_low:.3f}")
print(f"Score (100 features): {score_high:.3f}")
```

### **Sensibilidade a Dados Desbalanceados**
```python
from imblearn.over_sampling import SMOTE

# Lidar com dados desbalanceados
smote = SMOTE(random_state=42)
X_balanced, y_balanced = smote.fit_resample(X_train, y_train)

knn.fit(X_balanced, y_balanced)
```

## Otimizações para ML em Produção

### **Estruturas de Dados Eficientes**
```python
from sklearn.neighbors import NearestNeighbors
from sklearn.neighbors import BallTree, KDTree

# Para baixas dimensões (< 20)
kd_tree = KDTree(X_train)

# Para altas dimensões
ball_tree = BallTree(X_train)

# Para datasets muito grandes
from sklearn.neighbors import LSHForest  # Approximate
```

### **Redução de Dimensionalidade**
```python
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest

# Reduzir dimensões antes do KNN
pca = PCA(n_components=50)
X_reduced = pca.fit_transform(X_train)

knn.fit(X_reduced, y_train)
```

### **Sampling Inteligente**
```python
from imblearn.under_sampling import EditedNearestNeighbours

# Remover amostras redundantes ou ruidosas
enn = EditedNearestNeighbours()
X_cleaned, y_cleaned = enn.fit_resample(X_train, y_train)
```

## Comparação com Deep Learning

| Aspecto | KNN | Deep Learning |
|---|---|---|
| **Dados necessários** | Poucos | Muitos |
| **Tempo de treinamento** | Instantâneo | Longo |
| **Interpretabilidade** | Alta | Baixa |
| **Feature engineering** | Necessária | Automática |
| **Overfitting** | Controlável por K | Complexo |

## KNN em Ensemble Methods

```python
from sklearn.ensemble import VotingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

# Combinar KNN com outros algoritmos
ensemble = VotingClassifier([
    ('knn', KNeighborsClassifier(n_neighbors=5)),
    ('tree', DecisionTreeClassifier()),
    ('svm', SVC(probability=True))
], voting='soft')

ensemble.fit(X_train, y_train)
```

## Quando Usar KNN em ML

### ✅ **Use KNN quando:**
- Dataset pequeno/médio (< 100k amostras)
- Poucas dimensões (< 50 features)
- Precisar de interpretabilidade
- Dados localmente estruturados
- Prototipagem rápida

### ❌ **Evite KNN quando:**
- Dataset muito grande
- Muitas dimensões
- Dados muito ruidosos
- Precisar de predições em tempo real
- Dados esparsos

## Implementação Completa para ML

```python
class KNNClassifierML:
    def __init__(self, k=5, weight_func='uniform'):
        self.k = k
        self.weight_func = weight_func
        self.is_fitted = False
    
    def fit(self, X, y):
        """Treinar o modelo (apenas armazenar dados)"""
        self.X_train = np.array(X)
        self.y_train = np.array(y)
        self.classes = np.unique(y)
        self.is_fitted = True
        return self
    
    def predict_proba(self, X):
        """Retornar probabilidades de classe"""
        if not self.is_fitted:
            raise ValueError("Modelo não foi treinado")
        
        probabilities = []
        for x in X:
            # Encontrar K vizinhos
            distances = np.sqrt(np.sum((self.X_train - x)**2, axis=1))
            k_indices = np.argsort(distances)[:self.k]
            
            # Calcular pesos
            if self.weight_func == 'distance':
                weights = 1 / (distances[k_indices] + 1e-8)
            else:
                weights = np.ones(self.k)
            
            # Calcular probabilidades
            class_probs = np.zeros(len(self.classes))
            for i, class_label in enumerate(self.classes):
                mask = self.y_train[k_indices] == class_label
                class_probs[i] = np.sum(weights[mask])
            
            # Normalizar
            class_probs /= np.sum(class_probs)
            probabilities.append(class_probs)
        
        return np.array(probabilities)
    
    def predict(self, X):
        """Fazer predições"""
        probas = self.predict_proba(X)
        return self.classes[np.argmax(probas, axis=1)]
```

## Conclusão

O KNN é um algoritmo fundamental em machine learning que oferece:

- **Simplicidade** para começar
- **Interpretabilidade** para explicar decisões
- **Flexibilidade** para diferentes problemas
- **Base teórica** para entender conceitos de ML

Embora tenha limitações de escala, continua sendo uma ferramenta valiosa no toolkit de qualquer cientista de dados, especialmente para:
- **Baseline models**
- **Sistemas de recomendação**
- **Detecção de anomalias**
- **Problemas com poucos dados**

🔗 **Para detalhes técnicos completos:** [K-Vizinhos (Algoritmos)](../algoritmos/k-vizinhos.md)

🔗 **Para conceitos de overfitting/underfitting:** [Overfitting e Underfitting](overfitting-underfitting.md)
