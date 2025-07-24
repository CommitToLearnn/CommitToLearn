# Loss Functions e Proximidade Semântica

A relação entre loss functions, proximidade de vetores em espaços de alta dimensão e singularidade semântica é fundamental para entender como modelos aprendem representações significativas.

## Conceito Básico
- **Loss Functions**: Métricas que guiam o aprendizado do modelo
- **Proximidade Semântica**: Tokens similares têm vetores próximos no espaço embedding
- **Singularidade Semântica**: Diferentes significados são separados no espaço vetorial
- **Ruído vs Contexto**: Mais contexto pode introduzir ruído, afetando precisão

## Proximidade Vetorial e Semântica

### Espaços de Embedding
```python
import torch
import torch.nn.functional as F
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def analyze_semantic_space(embeddings, tokens, semantically_similar_pairs):
    """
    Analisa como proximidade vetorial reflete singularidade semântica
    """
    analysis = {}
    
    # 1. Distâncias entre tokens semanticamente similares
    similar_distances = []
    for token1, token2 in semantically_similar_pairs:
        if token1 in tokens and token2 in tokens:
            idx1, idx2 = tokens.index(token1), tokens.index(token2)
            
            # Distância coseno
            cosine_dist = 1 - F.cosine_similarity(
                embeddings[idx1].unsqueeze(0), 
                embeddings[idx2].unsqueeze(0)
            ).item()
            
            # Distância euclidiana
            euclidean_dist = torch.norm(embeddings[idx1] - embeddings[idx2]).item()
            
            similar_distances.append({
                'pair': (token1, token2),
                'cosine_distance': cosine_dist,
                'euclidean_distance': euclidean_dist
            })
    
    # 2. Baseline: distâncias aleatórias
    random_distances = []
    for _ in range(len(similar_distances)):
        idx1, idx2 = np.random.choice(len(tokens), 2, replace=False)
        cosine_dist = 1 - F.cosine_similarity(
            embeddings[idx1].unsqueeze(0), 
            embeddings[idx2].unsqueeze(0)
        ).item()
        random_distances.append(cosine_dist)
    
    # 3. Análise de separabilidade semântica
    analysis['semantic_coherence'] = {
        'mean_similar_distance': np.mean([d['cosine_distance'] for d in similar_distances]),
        'mean_random_distance': np.mean(random_distances),
        'separation_ratio': np.mean(random_distances) / np.mean([d['cosine_distance'] for d in similar_distances]),
        'semantic_clustering_quality': compute_semantic_clustering_quality(embeddings, tokens)
    }
    
    return analysis

def compute_semantic_clustering_quality(embeddings, tokens):
    """
    Avalia qualidade do clustering semântico
    """
    # Silhouette score aproximado para clusters semânticos
    distances = torch.cdist(embeddings, embeddings, p=2)
    
    # Intra-cluster distances (tokens similares)
    # Inter-cluster distances (tokens diferentes)
    
    # Simplified metric: variance in distances
    distance_variance = torch.var(distances).item()
    
    # Lower variance = better clustering
    clustering_quality = 1 / (1 + distance_variance)
    
    return clustering_quality
```

### Dimensionalidade e Proximidade
```python
def analyze_dimensionality_effects(embeddings, target_dims=[50, 100, 200, 500]):
    """
    Analisa como dimensionalidade afeta proximidade semântica
    """
    original_dim = embeddings.shape[1]
    results = {}
    
    for dim in target_dims:
        if dim <= original_dim:
            # Reduzir dimensionalidade via PCA
            from sklearn.decomposition import PCA
            
            pca = PCA(n_components=dim)
            reduced_embeddings = pca.fit_transform(embeddings.numpy())
            reduced_embeddings = torch.tensor(reduced_embeddings)
            
            # Calcular matriz de similaridade
            similarity_matrix = F.cosine_similarity(
                reduced_embeddings.unsqueeze(1), 
                reduced_embeddings.unsqueeze(0), 
                dim=2
            )
            
            results[dim] = {
                'mean_similarity': similarity_matrix.mean().item(),
                'similarity_variance': similarity_matrix.var().item(),
                'explained_variance_ratio': pca.explained_variance_ratio_.sum(),
                'distance_preservation': compute_distance_preservation(
                    embeddings, reduced_embeddings
                )
            }
    
    return results

def compute_distance_preservation(original_embeddings, reduced_embeddings):
    """
    Mede quão bem distâncias são preservadas na redução
    """
    # Distâncias no espaço original
    original_distances = torch.cdist(original_embeddings, original_embeddings, p=2)
    
    # Distâncias no espaço reduzido
    reduced_distances = torch.cdist(reduced_embeddings, reduced_embeddings, p=2)
    
    # Correlação entre distâncias
    correlation = torch.corrcoef(torch.stack([
        original_distances.flatten(),
        reduced_distances.flatten()
    ]))[0, 1]
    
    return correlation.item()
```

## Loss Functions para Representações Semânticas

### 1. Contrastive Loss
```python
class ContrastiveLoss(torch.nn.Module):
    """
    Aproxima tokens similares e afasta tokens diferentes
    Fundamental para aprender proximidade semântica
    """
    def __init__(self, margin=1.0, temperature=0.1):
        super().__init__()
        self.margin = margin
        self.temperature = temperature
    
    def forward(self, embeddings, labels):
        """
        embeddings: [batch_size, embedding_dim]
        labels: [batch_size] - rótulos para determinar similaridade
        """
        batch_size = embeddings.shape[0]
        
        # Normalizar embeddings
        embeddings = F.normalize(embeddings, p=2, dim=1)
        
        # Matriz de similaridade
        similarity_matrix = torch.matmul(embeddings, embeddings.T) / self.temperature
        
        # Máscara para pares positivos (mesmo rótulo)
        labels = labels.unsqueeze(1)
        positive_mask = (labels == labels.T).float()
        
        # Máscara para pares negativos
        negative_mask = 1 - positive_mask
        
        # Loss contrastiva
        positive_loss = -torch.log(
            torch.sum(torch.exp(similarity_matrix) * positive_mask, dim=1) + 1e-8
        )
        
        negative_loss = torch.log(
            torch.sum(torch.exp(similarity_matrix) * negative_mask, dim=1) + 1e-8
        )
        
        loss = torch.mean(positive_loss + negative_loss)
        
        return loss, {
            'positive_similarity': torch.mean(similarity_matrix * positive_mask),
            'negative_similarity': torch.mean(similarity_matrix * negative_mask)
        }
```

### 2. Triplet Loss
```python
class TripletLoss(torch.nn.Module):
    """
    Usa triplas (anchor, positive, negative) para aprender proximidade
    """
    def __init__(self, margin=0.3):
        super().__init__()
        self.margin = margin
    
    def forward(self, anchor, positive, negative):
        """
        anchor, positive, negative: [batch_size, embedding_dim]
        """
        # Distâncias
        pos_distance = F.pairwise_distance(anchor, positive, p=2)
        neg_distance = F.pairwise_distance(anchor, negative, p=2)
        
        # Triplet loss: pos_dist + margin < neg_dist
        loss = F.relu(pos_distance - neg_distance + self.margin)
        
        return loss.mean(), {
            'positive_distance': pos_distance.mean().item(),
            'negative_distance': neg_distance.mean().item(),
            'margin_violations': (loss > 0).float().mean().item()
        }

def mine_hard_triplets(embeddings, labels, margin=0.3):
    """
    Encontra triplas difíceis para treinamento mais eficiente
    """
    hard_triplets = []
    
    for i, anchor_label in enumerate(labels):
        anchor_emb = embeddings[i]
        
        # Positivos: mesma classe, maior distância
        positive_indices = torch.where(labels == anchor_label)[0]
        positive_distances = torch.norm(embeddings[positive_indices] - anchor_emb, dim=1)
        hard_positive_idx = positive_indices[torch.argmax(positive_distances)]
        
        # Negativos: classe diferente, menor distância
        negative_indices = torch.where(labels != anchor_label)[0]
        negative_distances = torch.norm(embeddings[negative_indices] - anchor_emb, dim=1)
        hard_negative_idx = negative_indices[torch.argmin(negative_distances)]
        
        hard_triplets.append((i, hard_positive_idx.item(), hard_negative_idx.item()))
    
    return hard_triplets
```

### 3. InfoNCE Loss
```python
class InfoNCELoss(torch.nn.Module):
    """
    Mutual Information estimation via contrastive learning
    Usado em modelos como SimCLR, CLIP
    """
    def __init__(self, temperature=0.07):
        super().__init__()
        self.temperature = temperature
    
    def forward(self, features, labels=None):
        """
        features: [2*batch_size, embedding_dim] (augmented pairs)
        """
        batch_size = features.shape[0] // 2
        
        # Normalizar features
        features = F.normalize(features, p=2, dim=1)
        
        # Matriz de similaridade
        similarity_matrix = torch.matmul(features, features.T) / self.temperature
        
        # Máscara para pares positivos (augmentações do mesmo exemplo)
        positive_mask = torch.zeros_like(similarity_matrix)
        for i in range(batch_size):
            positive_mask[i, i + batch_size] = 1
            positive_mask[i + batch_size, i] = 1
        
        # InfoNCE loss
        exp_sim = torch.exp(similarity_matrix)
        exp_sim = exp_sim * (1 - torch.eye(exp_sim.shape[0], device=exp_sim.device))
        
        positive_sim = torch.sum(exp_sim * positive_mask, dim=1)
        total_sim = torch.sum(exp_sim, dim=1)
        
        loss = -torch.log(positive_sim / (total_sim + 1e-8))
        
        return loss.mean(), {
            'positive_logits': torch.mean(similarity_matrix * positive_mask),
            'negative_logits': torch.mean(similarity_matrix * (1 - positive_mask))
        }
```

## Contexto vs Ruído na Loss

### Context Window Effects
```python
def analyze_context_noise_tradeoff(model, sentences, context_windows=[5, 10, 20, 50]):
    """
    Analisa como tamanho do contexto afeta precisão vs ruído
    """
    results = {}
    
    for window_size in context_windows:
        window_results = {
            'predictions': [],
            'losses': [],
            'attention_entropy': [],
            'semantic_coherence': []
        }
        
        for sentence in sentences:
            tokens = sentence.split()
            
            for center_idx in range(len(tokens)):
                # Definir janela de contexto
                start_idx = max(0, center_idx - window_size // 2)
                end_idx = min(len(tokens), center_idx + window_size // 2 + 1)
                
                context_tokens = tokens[start_idx:end_idx]
                
                # Processar com modelo
                with torch.no_grad():
                    outputs = model(context_tokens)
                    loss = compute_masked_lm_loss(outputs, tokens[center_idx])
                    
                    # Métricas de qualidade
                    attention_weights = outputs.attentions[-1].mean(dim=1)  # Média das cabeças
                    entropy = compute_attention_entropy(attention_weights)
                    
                    window_results['losses'].append(loss.item())
                    window_results['attention_entropy'].append(entropy)
        
        results[window_size] = {
            'mean_loss': np.mean(window_results['losses']),
            'loss_variance': np.var(window_results['losses']),
            'mean_attention_entropy': np.mean(window_results['attention_entropy']),
            'noise_ratio': estimate_noise_ratio(window_results)
        }
    
    return results

def estimate_noise_ratio(window_results):
    """
    Estima proporção de ruído baseado na variância da loss
    """
    loss_variance = np.var(window_results['losses'])
    attention_entropy = np.mean(window_results['attention_entropy'])
    
    # Ruído estimado: alta variância + alta entropia = mais ruído
    noise_ratio = (loss_variance * attention_entropy) / (1 + np.mean(window_results['losses']))
    
    return noise_ratio
```

### Optimal Context Length
```python
def find_optimal_context_length(model, validation_data, max_length=512):
    """
    Encontra comprimento ótimo de contexto balanceando precisão e ruído
    """
    context_lengths = [16, 32, 64, 128, 256, 512]
    performance_metrics = {}
    
    for length in context_lengths:
        if length <= max_length:
            # Avaliar modelo com contexto limitado
            metrics = evaluate_with_context_limit(model, validation_data, length)
            
            performance_metrics[length] = {
                'accuracy': metrics['accuracy'],
                'loss': metrics['loss'],
                'inference_time': metrics['inference_time'],
                'memory_usage': metrics['memory_usage'],
                'noise_estimate': metrics['noise_estimate']
            }
    
    # Encontrar ponto ótimo: trade-off entre accuracy e noise
    optimal_length = find_pareto_optimal_length(performance_metrics)
    
    return optimal_length, performance_metrics

def find_pareto_optimal_length(metrics):
    """
    Encontra ponto Pareto-ótimo no trade-off accuracy vs noise
    """
    scores = {}
    
    for length, metric in metrics.items():
        # Score combinado: alta accuracy, baixo noise, eficiência
        accuracy_score = metric['accuracy']
        noise_penalty = 1 / (1 + metric['noise_estimate'])
        efficiency_score = 1 / (1 + metric['inference_time'])
        
        combined_score = accuracy_score * noise_penalty * efficiency_score
        scores[length] = combined_score
    
    optimal_length = max(scores.keys(), key=lambda k: scores[k])
    return optimal_length
```

## Regularização para Proximidade Semântica

### Semantic Regularization
```python
class SemanticRegularizer:
    def __init__(self, semantic_graph, lambda_reg=0.1):
        """
        semantic_graph: dicionário de relações semânticas
        {token1: [lista de tokens similares], ...}
        """
        self.semantic_graph = semantic_graph
        self.lambda_reg = lambda_reg
    
    def compute_regularization_loss(self, embeddings, tokens):
        """
        Regulariza embeddings para respeitar relações semânticas conhecidas
        """
        reg_loss = 0
        count = 0
        
        for i, token in enumerate(tokens):
            if token in self.semantic_graph:
                token_emb = embeddings[i]
                
                # Calcular distância para tokens semanticamente relacionados
                for related_token in self.semantic_graph[token]:
                    if related_token in tokens:
                        j = tokens.index(related_token)
                        related_emb = embeddings[j]
                        
                        # Penalizar distância entre tokens relacionados
                        distance = torch.norm(token_emb - related_emb, p=2)
                        reg_loss += distance
                        count += 1
        
        if count > 0:
            reg_loss = reg_loss / count
        
        return self.lambda_reg * reg_loss

class OrthogonalityRegularizer:
    def __init__(self, lambda_orth=0.01):
        self.lambda_orth = lambda_orth
    
    def compute_orthogonality_loss(self, embeddings):
        """
        Promove ortogonalidade entre embeddings de diferentes tokens
        Ajuda na separabilidade semântica
        """
        # Normalizar embeddings
        norm_embeddings = F.normalize(embeddings, p=2, dim=1)
        
        # Matriz de similaridade
        similarity_matrix = torch.matmul(norm_embeddings, norm_embeddings.T)
        
        # Penalizar similaridades altas (exceto diagonal)
        eye = torch.eye(similarity_matrix.shape[0], device=similarity_matrix.device)
        off_diagonal = similarity_matrix * (1 - eye)
        
        # L2 penalty nas similaridades off-diagonal
        orthogonality_loss = torch.mean(off_diagonal ** 2)
        
        return self.lambda_orth * orthogonality_loss
```

### Adaptive Loss Weighting
```python
class AdaptiveLossWeighting:
    def __init__(self):
        self.loss_history = []
        self.weights = {'semantic': 1.0, 'task': 1.0, 'regularization': 0.1}
    
    def update_weights(self, semantic_loss, task_loss, reg_loss, step):
        """
        Ajusta pesos das losses baseado no progresso do treinamento
        """
        current_losses = {
            'semantic': semantic_loss.item(),
            'task': task_loss.item(),
            'regularization': reg_loss.item()
        }
        
        self.loss_history.append(current_losses)
        
        if len(self.loss_history) > 100:  # Janela de histórico
            # Calcular tendências
            recent_losses = self.loss_history[-50:]
            early_losses = self.loss_history[-100:-50]
            
            for loss_type in ['semantic', 'task', 'regularization']:
                recent_avg = np.mean([l[loss_type] for l in recent_losses])
                early_avg = np.mean([l[loss_type] for l in early_losses])
                
                # Se loss não está melhorando, aumentar peso
                if recent_avg >= early_avg:
                    self.weights[loss_type] *= 1.1
                else:
                    self.weights[loss_type] *= 0.99
                
                # Limitar weights
                self.weights[loss_type] = np.clip(self.weights[loss_type], 0.01, 10.0)
        
        return self.weights
    
    def compute_weighted_loss(self, semantic_loss, task_loss, reg_loss):
        """
        Combina losses com pesos adaptativos
        """
        total_loss = (self.weights['semantic'] * semantic_loss +
                     self.weights['task'] * task_loss +
                     self.weights['regularization'] * reg_loss)
        
        return total_loss
```

## Avaliação da Qualidade Semântica

### Intrinsic Evaluation
```python
def evaluate_semantic_quality(embeddings, tokens, benchmark_tasks):
    """
    Avalia qualidade semântica usando tarefas de benchmark
    """
    results = {}
    
    # 1. Word Similarity Tasks
    if 'similarity' in benchmark_tasks:
        similarity_corr = evaluate_word_similarity(embeddings, tokens)
        results['word_similarity'] = similarity_corr
    
    # 2. Analogy Tasks
    if 'analogy' in benchmark_tasks:
        analogy_acc = evaluate_analogies(embeddings, tokens)
        results['analogy_accuracy'] = analogy_acc
    
    # 3. Clustering Quality
    if 'clustering' in benchmark_tasks:
        clustering_score = evaluate_semantic_clustering(embeddings, tokens)
        results['clustering_quality'] = clustering_score
    
    # 4. Nearest Neighbors Quality
    if 'neighbors' in benchmark_tasks:
        neighbor_quality = evaluate_nearest_neighbors(embeddings, tokens)
        results['neighbor_quality'] = neighbor_quality
    
    return results

def evaluate_word_similarity(embeddings, tokens, similarity_dataset):
    """
    Correlação com julgamentos humanos de similaridade
    """
    model_similarities = []
    human_similarities = []
    
    for word1, word2, human_score in similarity_dataset:
        if word1 in tokens and word2 in tokens:
            idx1, idx2 = tokens.index(word1), tokens.index(word2)
            
            # Similaridade coseno
            model_sim = F.cosine_similarity(
                embeddings[idx1].unsqueeze(0),
                embeddings[idx2].unsqueeze(0)
            ).item()
            
            model_similarities.append(model_sim)
            human_similarities.append(human_score)
    
    # Correlação de Spearman
    from scipy.stats import spearmanr
    correlation, p_value = spearmanr(model_similarities, human_similarities)
    
    return {'correlation': correlation, 'p_value': p_value}
```
