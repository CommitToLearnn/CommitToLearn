# Classificador Naive Bayes

## O que é Naive Bayes?

Naive Bayes é uma família de algoritmos de classificação baseados no Teorema de Bayes, que assume independência (naive) entre as características dos dados. Apesar da suposição "ingênua", é surpreendentemente eficaz em muitas aplicações práticas, especialmente em classificação de texto e spam filtering.

## Fundamentos Matemáticos

### Teorema de Bayes
```
P(A|B) = P(B|A) * P(A) / P(B)
```

### Aplicado à Classificação
```
P(classe|características) = P(características|classe) * P(classe) / P(características)
```

### Fórmula Naive Bayes
Para classificação com múltiplas características independentes:
```
P(C|x₁,x₂,...,xₙ) = P(C) * ∏ᵢ P(xᵢ|C) / P(x₁,x₂,...,xₙ)
```

Onde:
- C = classe
- x₁,x₂,...,xₙ = características
- P(C) = probabilidade a priori da classe
- P(xᵢ|C) = probabilidade da característica dado a classe

## Tipos de Naive Bayes

### Gaussian Naive Bayes
Para características contínuas que seguem distribuição normal.

```python
import numpy as np
from scipy.stats import norm
from collections import defaultdict

class GaussianNaiveBayes:
    def __init__(self):
        self.classes = []
        self.class_priors = {}
        self.feature_params = {}  # {class: {feature: (mean, std)}}
    
    def fit(self, X, y):
        """Treina o modelo com dados de entrada"""
        self.classes = np.unique(y)
        n_samples = len(y)
        
        # Calcular probabilidades a priori
        for c in self.classes:
            self.class_priors[c] = np.sum(y == c) / n_samples
        
        # Calcular parâmetros (média e desvio padrão) para cada característica
        self.feature_params = {}
        for c in self.classes:
            class_data = X[y == c]
            self.feature_params[c] = {}
            
            for feature_idx in range(X.shape[1]):
                feature_values = class_data[:, feature_idx]
                mean = np.mean(feature_values)
                std = np.std(feature_values)
                self.feature_params[c][feature_idx] = (mean, std)
    
    def predict_proba(self, X):
        """Calcula probabilidades para cada classe"""
        probabilities = []
        
        for sample in X:
            sample_probs = {}
            
            for c in self.classes:
                # Probabilidade a priori
                prob = self.class_priors[c]
                
                # Multiplicar pelas probabilidades das características
                for feature_idx, feature_value in enumerate(sample):
                    mean, std = self.feature_params[c][feature_idx]
                    
                    # Probabilidade usando distribuição normal
                    feature_prob = norm.pdf(feature_value, mean, std)
                    prob *= feature_prob
                
                sample_probs[c] = prob
            
            # Normalizar probabilidades
            total_prob = sum(sample_probs.values())
            if total_prob > 0:
                for c in sample_probs:
                    sample_probs[c] /= total_prob
            
            probabilities.append(sample_probs)
        
        return probabilities
    
    def predict(self, X):
        """Prediz classes para novos dados"""
        probabilities = self.predict_proba(X)
        predictions = []
        
        for prob_dict in probabilities:
            predicted_class = max(prob_dict, key=prob_dict.get)
            predictions.append(predicted_class)
        
        return np.array(predictions)

# Exemplo de uso
if __name__ == "__main__":
    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split
    
    # Carregar dados
    iris = load_iris()
    X_train, X_test, y_train, y_test = train_test_split(
        iris.data, iris.target, test_size=0.3, random_state=42
    )
    
    # Treinar modelo
    nb = GaussianNaiveBayes()
    nb.fit(X_train, y_train)
    
    # Fazer predições
    predictions = nb.predict(X_test)
    accuracy = np.mean(predictions == y_test)
    print(f"Acurácia: {accuracy:.2f}")
```

### Multinomial Naive Bayes
Para dados de contagem (ex: frequência de palavras).

```python
import numpy as np
from collections import defaultdict, Counter

class MultinomialNaiveBayes:
    def __init__(self, alpha=1.0):
        self.alpha = alpha  # Parâmetro de suavização (Laplace smoothing)
        self.classes = []
        self.class_priors = {}
        self.feature_probs = {}
    
    def fit(self, X, y):
        """Treina modelo multinomial"""
        self.classes = np.unique(y)
        n_samples = len(y)
        
        # Probabilidades a priori
        for c in self.classes:
            self.class_priors[c] = np.sum(y == c) / n_samples
        
        # Calcular probabilidades das características
        self.feature_probs = {}
        
        for c in self.classes:
            class_indices = y == c
            class_data = X[class_indices]
            
            # Somar todas as contagens de características para a classe
            feature_sums = np.sum(class_data, axis=0)
            total_features = np.sum(feature_sums)
            n_features = X.shape[1]
            
            # Aplicar suavização de Laplace
            self.feature_probs[c] = (feature_sums + self.alpha) / \
                                  (total_features + self.alpha * n_features)
    
    def predict_log_proba(self, X):
        """Calcula log-probabilidades (para estabilidade numérica)"""
        log_probabilities = []
        
        for sample in X:
            sample_log_probs = {}
            
            for c in self.classes:
                # Log da probabilidade a priori
                log_prob = np.log(self.class_priors[c])
                
                # Somar logs das probabilidades das características
                for feature_idx, count in enumerate(sample):
                    if count > 0:  # Apenas características presentes
                        feature_prob = self.feature_probs[c][feature_idx]
                        log_prob += count * np.log(feature_prob)
                
                sample_log_probs[c] = log_prob
            
            log_probabilities.append(sample_log_probs)
        
        return log_probabilities
    
    def predict(self, X):
        """Prediz classes"""
        log_probabilities = self.predict_log_proba(X)
        predictions = []
        
        for log_prob_dict in log_probabilities:
            predicted_class = max(log_prob_dict, key=log_prob_dict.get)
            predictions.append(predicted_class)
        
        return np.array(predictions)

# Exemplo: Classificação de texto
class TextClassifier:
    def __init__(self):
        self.vectorizer = {}
        self.nb_classifier = MultinomialNaiveBayes()
        self.vocabulary = set()
    
    def _vectorize_text(self, texts):
        """Converte texto em vetor de contagens de palavras"""
        if not self.vocabulary:
            # Construir vocabulário durante treino
            for text in texts:
                words = text.lower().split()
                self.vocabulary.update(words)
            
            self.vocabulary = sorted(list(self.vocabulary))
        
        # Converter textos em vetores
        vectors = []
        for text in texts:
            word_counts = Counter(text.lower().split())
            vector = [word_counts.get(word, 0) for word in self.vocabulary]
            vectors.append(vector)
        
        return np.array(vectors)
    
    def train(self, texts, labels):
        """Treina classificador de texto"""
        X = self._vectorize_text(texts)
        self.nb_classifier.fit(X, np.array(labels))
    
    def predict(self, texts):
        """Classifica novos textos"""
        X = self._vectorize_text(texts)
        return self.nb_classifier.predict(X)

# Exemplo de uso
texts = [
    "produto excelente recomendo comprar",
    "muito ruim não comprem",
    "adorei a qualidade ótimo produto",
    "péssimo atendimento produto defeituoso",
    "entrega rápida produto chegou perfeito"
]
labels = ["positivo", "negativo", "positivo", "negativo", "positivo"]

classifier = TextClassifier()
classifier.train(texts, labels)

new_texts = ["produto muito bom", "ruim demais"]
predictions = classifier.predict(new_texts)
print("Predições:", predictions)
```

### Bernoulli Naive Bayes
Para características binárias (presente/ausente).

```python
class BernoulliNaiveBayes:
    def __init__(self, alpha=1.0):
        self.alpha = alpha
        self.classes = []
        self.class_priors = {}
        self.feature_probs = {}
    
    def fit(self, X, y):
        """Treina modelo Bernoulli"""
        self.classes = np.unique(y)
        n_samples = len(y)
        
        # Probabilidades a priori
        for c in self.classes:
            self.class_priors[c] = np.sum(y == c) / n_samples
        
        # Probabilidades das características
        self.feature_probs = {}
        
        for c in self.classes:
            class_indices = y == c
            class_data = X[class_indices]
            n_class_samples = np.sum(class_indices)
            
            # P(xi = 1 | classe)
            feature_counts = np.sum(class_data, axis=0)
            self.feature_probs[c] = (feature_counts + self.alpha) / \
                                  (n_class_samples + 2 * self.alpha)
    
    def predict_log_proba(self, X):
        """Calcula log-probabilidades"""
        log_probabilities = []
        
        for sample in X:
            sample_log_probs = {}
            
            for c in self.classes:
                log_prob = np.log(self.class_priors[c])
                
                for feature_idx, feature_value in enumerate(sample):
                    prob_feature_given_class = self.feature_probs[c][feature_idx]
                    
                    if feature_value == 1:
                        log_prob += np.log(prob_feature_given_class)
                    else:
                        log_prob += np.log(1 - prob_feature_given_class)
                
                sample_log_probs[c] = log_prob
            
            log_probabilities.append(sample_log_probs)
        
        return log_probabilities
    
    def predict(self, X):
        """Prediz classes"""
        log_probabilities = self.predict_log_proba(X)
        predictions = []
        
        for log_prob_dict in log_probabilities:
            predicted_class = max(log_prob_dict, key=log_prob_dict.get)
            predictions.append(predicted_class)
        
        return np.array(predictions)
```

## Aplicações Práticas

### Filtro de Spam
```python
import re
from collections import Counter

class SpamFilter:
    def __init__(self):
        self.nb_classifier = MultinomialNaiveBayes(alpha=1.0)
        self.vocabulary = set()
        self.spam_words = set()
        self.ham_words = set()
    
    def preprocess_email(self, email_text):
        """Pré-processa email para extração de características"""
        # Converter para minúsculas
        text = email_text.lower()
        
        # Remover caracteres especiais e números
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenizar
        words = text.split()
        
        # Filtrar palavras muito curtas
        words = [word for word in words if len(word) > 2]
        
        return words
    
    def extract_features(self, emails):
        """Extrai características dos emails"""
        if not self.vocabulary:
            # Construir vocabulário
            all_words = []
            for email in emails:
                words = self.preprocess_email(email)
                all_words.extend(words)
            
            # Usar apenas palavras mais frequentes
            word_freq = Counter(all_words)
            self.vocabulary = {word for word, freq in word_freq.most_common(1000)}
        
        # Criar vetores de características
        feature_vectors = []
        for email in emails:
            words = self.preprocess_email(email)
            word_counts = Counter(words)
            
            # Vetor de contagens para vocabulário
            features = [word_counts.get(word, 0) for word in sorted(self.vocabulary)]
            feature_vectors.append(features)
        
        return np.array(feature_vectors)
    
    def train(self, emails, labels):
        """Treina filtro de spam"""
        X = self.extract_features(emails)
        y = np.array(labels)
        
        self.nb_classifier.fit(X, y)
        
        # Analisar palavras características
        for i, email in enumerate(emails):
            words = set(self.preprocess_email(email))
            if labels[i] == 'spam':
                self.spam_words.update(words)
            else:
                self.ham_words.update(words)
    
    def classify_email(self, email):
        """Classifica email como spam ou ham"""
        X = self.extract_features([email])
        prediction = self.nb_classifier.predict(X)[0]
        
        # Calcular confiança
        log_probs = self.nb_classifier.predict_log_proba(X)[0]
        confidence = abs(log_probs['spam'] - log_probs['ham'])
        
        return prediction, confidence
    
    def get_spam_indicators(self, email, top_n=10):
        """Identifica palavras que indicam spam"""
        words = self.preprocess_email(email)
        word_set = set(words)
        
        spam_indicators = word_set.intersection(self.spam_words)
        ham_indicators = word_set.intersection(self.ham_words)
        
        return {
            'spam_words': list(spam_indicators)[:top_n],
            'ham_words': list(ham_indicators)[:top_n]
        }

# Exemplo de uso
spam_emails = [
    "CONGRATULATIONS! You won $1000000! Click here now!",
    "FREE VIAGRA! Buy now with 50% discount!",
    "Urgent: Your account will be closed! Update now!"
]

ham_emails = [
    "Hi John, let's meet for coffee tomorrow at 3pm",
    "The quarterly report is attached. Please review.",
    "Happy birthday! Hope you have a great day!"
]

emails = spam_emails + ham_emails
labels = ['spam'] * len(spam_emails) + ['ham'] * len(ham_emails)

# Treinar filtro
spam_filter = SpamFilter()
spam_filter.train(emails, labels)

# Testar novo email
test_email = "WIN BIG MONEY NOW! Click here for instant cash!"
prediction, confidence = spam_filter.classify_email(test_email)
indicators = spam_filter.get_spam_indicators(test_email)

print(f"Classificação: {prediction}")
print(f"Confiança: {confidence:.2f}")
print(f"Indicadores: {indicators}")
```

### Análise de Sentimento
```python
class SentimentAnalyzer:
    def __init__(self):
        self.classifier = MultinomialNaiveBayes()
        self.vocabulary = {}
        self.sentiment_lexicon = {
            'positive': ['bom', 'ótimo', 'excelente', 'maravilhoso', 'perfeito'],
            'negative': ['ruim', 'péssimo', 'terrível', 'horrível', 'defeituoso']
        }
    
    def extract_features(self, texts):
        """Extrai características para análise de sentimento"""
        if not self.vocabulary:
            # Construir vocabulário
            all_words = []
            for text in texts:
                words = self.preprocess_text(text)
                all_words.extend(words)
            
            word_freq = Counter(all_words)
            self.vocabulary = {word: i for i, (word, _) in 
                             enumerate(word_freq.most_common(2000))}
        
        # Criar vetores de características
        feature_vectors = []
        for text in texts:
            words = self.preprocess_text(text)
            word_counts = Counter(words)
            
            # Características baseadas em contagem
            features = [word_counts.get(word, 0) for word in self.vocabulary]
            
            # Adicionar características de sentimento
            pos_count = sum(1 for word in words if word in self.sentiment_lexicon['positive'])
            neg_count = sum(1 for word in words if word in self.sentiment_lexicon['negative'])
            
            features.extend([pos_count, neg_count])
            feature_vectors.append(features)
        
        return np.array(feature_vectors)
    
    def preprocess_text(self, text):
        """Pré-processa texto para análise"""
        # Converter para minúsculas
        text = text.lower()
        
        # Remover pontuação
        text = re.sub(r'[^\w\s]', '', text)
        
        # Tokenizar
        words = text.split()
        
        # Filtrar palavras vazias (stopwords)
        stopwords = {'o', 'a', 'de', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'suas', 'nem', 'nossa', 'muito', 'bem', 'pode', 'eles', 'estas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele'}
        
        words = [word for word in words if word not in stopwords and len(word) > 2]
        
        return words
    
    def train(self, texts, sentiments):
        """Treina analisador de sentimento"""
        X = self.extract_features(texts)
        y = np.array(sentiments)
        
        self.classifier.fit(X, y)
    
    def predict_sentiment(self, text):
        """Prediz sentimento do texto"""
        X = self.extract_features([text])
        prediction = self.classifier.predict(X)[0]
        
        # Calcular probabilidades
        log_probs = self.classifier.predict_log_proba(X)[0]
        probs = {class_: np.exp(log_prob) for class_, log_prob in log_probs.items()}
        
        # Normalizar
        total_prob = sum(probs.values())
        probs = {class_: prob/total_prob for class_, prob in probs.items()}
        
        return prediction, probs

# Exemplo de treinamento
positive_texts = [
    "Este produto é excelente, recomendo muito!",
    "Adorei a qualidade, superou minhas expectativas",
    "Muito bom, vale a pena comprar"
]

negative_texts = [
    "Produto terrível, não funciona direito",
    "Muito ruim, não recomendo para ninguém",
    "Péssima qualidade, dinheiro jogado fora"
]

neutral_texts = [
    "O produto chegou no prazo",
    "Funciona conforme descrito",
    "Produto normal, sem grandes novidades"
]

all_texts = positive_texts + negative_texts + neutral_texts
sentiments = (['positivo'] * len(positive_texts) + 
             ['negativo'] * len(negative_texts) + 
             ['neutro'] * len(neutral_texts))

# Treinar modelo
analyzer = SentimentAnalyzer()
analyzer.train(all_texts, sentiments)

# Testar
test_text = "Este produto é muito bom, gostei bastante!"
sentiment, probabilities = analyzer.predict_sentiment(test_text)
print(f"Sentimento: {sentiment}")
print(f"Probabilidades: {probabilities}")
```

## Vantagens e Desvantagens

### Vantagens
- **Simplicidade**: Fácil de implementar e entender
- **Eficiência**: Treino e predição rápidos
- **Poucos Dados**: Funciona bem com datasets pequenos
- **Baseline**: Excelente como modelo baseline
- **Interpretabilidade**: Resultados facilmente interpretáveis
- **Multiclasse**: Suporta classificação multiclasse naturalmente

### Desvantagens
- **Independência**: Assume independência entre características
- **Dados Categóricos**: Pode ter problemas com dados categóricos correlacionados
- **Distribuição**: Pressupõe distribuições específicas dos dados
- **Zero Frequency**: Problemas com características não vistas no treino

## Técnicas de Melhoria

### Suavização (Smoothing)
```python
class SmoothedNaiveBayes:
    def __init__(self, smoothing_type='laplace', alpha=1.0):
        self.smoothing_type = smoothing_type
        self.alpha = alpha
    
    def laplace_smoothing(self, counts, total, vocab_size):
        """Suavização de Laplace"""
        return (counts + self.alpha) / (total + self.alpha * vocab_size)
    
    def good_turing_smoothing(self, counts, frequencies):
        """Suavização Good-Turing (simplificada)"""
        # Implementação simplificada
        adjusted_counts = []
        for count in counts:
            if count == 0:
                adjusted_counts.append(frequencies.get(1, 1) / len(counts))
            else:
                next_freq = frequencies.get(count + 1, 0)
                if next_freq > 0:
                    adjusted_counts.append(((count + 1) * next_freq) / frequencies[count])
                else:
                    adjusted_counts.append(count)
        return np.array(adjusted_counts)
```

### Seleção de Características
```python
from sklearn.feature_selection import chi2, SelectKBest

class FeatureSelectionNB:
    def __init__(self, k_best=1000):
        self.k_best = k_best
        self.selector = SelectKBest(chi2, k=k_best)
        self.nb_classifier = MultinomialNaiveBayes()
    
    def fit(self, X, y):
        """Treina com seleção de características"""
        # Selecionar melhores características
        X_selected = self.selector.fit_transform(X, y)
        
        # Treinar classificador
        self.nb_classifier.fit(X_selected, y)
    
    def predict(self, X):
        """Prediz com características selecionadas"""
        X_selected = self.selector.transform(X)
        return self.nb_classifier.predict(X_selected)
```

### Ensemble Methods
```python
class NaiveBayesEnsemble:
    def __init__(self, n_models=5):
        self.models = []
        self.n_models = n_models
    
    def fit(self, X, y):
        """Treina ensemble de modelos Naive Bayes"""
        from sklearn.utils import resample
        
        for _ in range(self.n_models):
            # Bootstrap sampling
            X_boot, y_boot = resample(X, y, random_state=np.random.randint(1000))
            
            # Treinar modelo
            model = MultinomialNaiveBayes()
            model.fit(X_boot, y_boot)
            self.models.append(model)
    
    def predict(self, X):
        """Predição por votação majoritária"""
        predictions = []
        
        for model in self.models:
            pred = model.predict(X)
            predictions.append(pred)
        
        # Votação majoritária
        ensemble_pred = []
        for i in range(len(X)):
            votes = [pred[i] for pred in predictions]
            majority_vote = max(set(votes), key=votes.count)
            ensemble_pred.append(majority_vote)
        
        return np.array(ensemble_pred)
```

## Comparação com Outros Algoritmos

| Algoritmo | Precisão | Velocidade | Interpretabilidade | Complexidade |
|-----------|----------|------------|-------------------|--------------|
| Naive Bayes | Média | Alta | Alta | Baixa |
| SVM | Alta | Média | Baixa | Média |
| Random Forest | Alta | Média | Média | Média |
| Neural Networks | Muito Alta | Baixa | Muito Baixa | Alta |
| Logistic Regression | Alta | Alta | Alta | Baixa |

## Métricas de Avaliação

### Implementação de Métricas
```python
def evaluate_classifier(y_true, y_pred, classes):
    """Avalia performance do classificador"""
    from collections import defaultdict
    
    # Matriz de confusão
    confusion_matrix = defaultdict(lambda: defaultdict(int))
    for true, pred in zip(y_true, y_pred):
        confusion_matrix[true][pred] += 1
    
    # Métricas por classe
    metrics = {}
    for class_name in classes:
        tp = confusion_matrix[class_name][class_name]
        fp = sum(confusion_matrix[other][class_name] for other in classes if other != class_name)
        fn = sum(confusion_matrix[class_name][other] for other in classes if other != class_name)
        tn = sum(confusion_matrix[i][j] for i in classes for j in classes 
                if i != class_name and j != class_name)
        
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
        
        metrics[class_name] = {
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'support': tp + fn
        }
    
    # Métricas globais
    accuracy = sum(y_true[i] == y_pred[i] for i in range(len(y_true))) / len(y_true)
    
    return {
        'accuracy': accuracy,
        'per_class': metrics,
        'confusion_matrix': dict(confusion_matrix)
    }
```

## Casos de Uso Ideais

### Classificação de Texto
- **Spam Detection**: Filtros de email
- **Sentiment Analysis**: Análise de reviews e redes sociais
- **Topic Classification**: Categorização de documentos
- **Language Detection**: Identificação de idioma

### Diagnóstico Médico
- **Symptom-based Diagnosis**: Diagnóstico baseado em sintomas
- **Medical Image Classification**: Classificação de imagens médicas simples
- **Drug Discovery**: Classificação de compostos químicos

### Recomendação
- **Content Filtering**: Filtragem de conteúdo
- **User Profiling**: Criação de perfis de usuário
- **Product Categorization**: Categorização de produtos

## Ferramentas e Bibliotecas

### Python
```python
# Scikit-learn
from sklearn.naive_bayes import GaussianNB, MultinomialNB, BernoulliNB

# NLTK para processamento de texto
import nltk
from nltk.corpus import stopwords

# Exemplo com scikit-learn
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Pipeline completo
text_classifier = Pipeline([
    ('vectorizer', CountVectorizer(stop_words='english')),
    ('classifier', MultinomialNB())
])

# Treinar e usar
text_classifier.fit(train_texts, train_labels)
predictions = text_classifier.predict(test_texts)
```

### R
```r
# Biblioteca e1071
library(e1071)

# Treinar modelo
model <- naiveBayes(Species ~ ., data = iris)

# Predições
predictions <- predict(model, test_data)
```

### Java
```java
// Weka
import weka.classifiers.bayes.NaiveBayes;
import weka.core.Instances;

NaiveBayes nb = new NaiveBayes();
nb.buildClassifier(trainingData);
double prediction = nb.classifyInstance(testInstance);
```

## Otimizações de Performance

### Paralelização
```python
import concurrent.futures
import numpy as np

class ParallelNaiveBayes:
    def __init__(self, n_workers=4):
        self.n_workers = n_workers
        self.models = {}
    
    def fit_parallel(self, X, y):
        """Treina modelos em paralelo por classe"""
        classes = np.unique(y)
        
        def train_class_model(class_label):
            # Dados específicos da classe
            class_indices = y == class_label
            class_data = X[class_indices]
            
            # Calcular estatísticas
            means = np.mean(class_data, axis=0)
            stds = np.std(class_data, axis=0)
            prior = np.sum(class_indices) / len(y)
            
            return class_label, (means, stds, prior)
        
        # Treinar em paralelo
        with concurrent.futures.ThreadPoolExecutor(max_workers=self.n_workers) as executor:
            futures = [executor.submit(train_class_model, c) for c in classes]
            
            for future in concurrent.futures.as_completed(futures):
                class_label, params = future.result()
                self.models[class_label] = params
```

### Otimização de Memória
```python
class MemoryEfficientNB:
    def __init__(self, use_sparse=True):
        self.use_sparse = use_sparse
        self.feature_stats = {}
    
    def fit_streaming(self, data_stream):
        """Treina com dados em streaming"""
        class_counts = {}
        feature_sums = {}
        feature_squared_sums = {}
        
        for batch_X, batch_y in data_stream:
            for i, (sample, label) in enumerate(zip(batch_X, batch_y)):
                # Atualizar contadores
                if label not in class_counts:
                    class_counts[label] = 0
                    feature_sums[label] = np.zeros(len(sample))
                    feature_squared_sums[label] = np.zeros(len(sample))
                
                class_counts[label] += 1
                feature_sums[label] += sample
                feature_squared_sums[label] += sample ** 2
        
        # Calcular estatísticas finais
        for label in class_counts:
            n = class_counts[label]
            means = feature_sums[label] / n
            variances = (feature_squared_sums[label] / n) - (means ** 2)
            
            self.feature_stats[label] = {
                'mean': means,
                'var': variances,
                'prior': n / sum(class_counts.values())
            }
```

Essas notas cobrem os aspectos fundamentais e avançados do classificador Naive Bayes, incluindo implementações práticas, otimizações e casos de uso reais. O algoritmo, apesar de sua simplicidade, continua sendo uma ferramenta valiosa em machine learning, especialmente para classificação de texto e como baseline para comparação com métodos mais complexos.
