# Assimétricos em Deep Learning

Estruturas assimétricas em deep learning referem-se a arquiteturas, mecanismos de atenção ou loss functions que tratam diferentes direções, posições ou elementos de forma não uniforme.

## Conceito Básico
- **Assimetria**: Tratamento não-uniforme de elementos em diferentes posições ou direções
- **Quebra de Simetria**: Permite especialização e hierarquias
- **Vantagens**: Maior expressividade e capacidade de modelar relações direcionais
- **Aplicações**: Attention causal, arquiteturas encoder-decoder, loss functions especializadas

## Tipos de Assimetria

### Attention Assimétrica
```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class AsymmetricAttention(nn.Module):
    """
    Atenção assimétrica onde queries e keys têm tratamento diferente
    """
    def __init__(self, d_model, d_query, d_key):
        super().__init__()
        self.d_model = d_model
        self.d_query = d_query
        self.d_key = d_key
        
        # Projeções assimétricas
        self.W_q = nn.Linear(d_model, d_query)
        self.W_k = nn.Linear(d_model, d_key)
        self.W_v = nn.Linear(d_model, d_model)
        
        # Diferentes normalizações
        self.query_norm = nn.LayerNorm(d_query)
        self.key_norm = nn.LayerNorm(d_key)
        
        # Temperatura assimétrica
        self.temperature_q = nn.Parameter(torch.ones(1))
        self.temperature_k = nn.Parameter(torch.ones(1))
    
    def forward(self, x_q, x_k, x_v, mask=None):
        """
        x_q: queries [batch, seq_len_q, d_model]
        x_k: keys [batch, seq_len_k, d_model]  
        x_v: values [batch, seq_len_v, d_model]
        """
        # Projeções assimétricas
        Q = self.query_norm(self.W_q(x_q))  # [batch, seq_len_q, d_query]
        K = self.key_norm(self.W_k(x_k))    # [batch, seq_len_k, d_key]
        V = self.W_v(x_v)                   # [batch, seq_len_v, d_model]
        
        # Temperaturas diferentes para queries e keys
        Q = Q / self.temperature_q
        K = K / self.temperature_k
        
        # Attention scores (dimensões podem ser diferentes)
        # Usar adaptação dimensional se necessário
        if self.d_query != self.d_key:
            # Projeção para espaço comum
            adaptation = nn.Linear(self.d_key, self.d_query)
            K = adaptation(K)
        
        scores = torch.matmul(Q, K.transpose(-2, -1))
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -float('inf'))
        
        attention_weights = F.softmax(scores, dim=-1)
        output = torch.matmul(attention_weights, V)
        
        return output, attention_weights

# Exemplo de uso: Cross-attention assimétrica
def asymmetric_cross_attention(decoder_hidden, encoder_output):
    """
    Decoder queries são diferentes de encoder keys/values
    """
    asym_attention = AsymmetricAttention(
        d_model=512, 
        d_query=256,  # Queries menores
        d_key=512     # Keys mantêm dimensão original
    )
    
    output, weights = asym_attention(
        x_q=decoder_hidden,
        x_k=encoder_output,
        x_v=encoder_output
    )
    
    return output, weights
```

### Arquiteturas Encoder-Decoder Assimétricas
```python
class AsymmetricEncoderDecoder(nn.Module):
    """
    Encoder e Decoder com arquiteturas diferentes
    """
    def __init__(self, vocab_size, d_model_enc=512, d_model_dec=256):
        super().__init__()
        
        # Encoder: maior capacidade
        self.encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(
                d_model=d_model_enc, 
                nhead=8, 
                dim_feedforward=2048
            ),
            num_layers=12
        )
        
        # Decoder: menor capacidade
        self.decoder = nn.TransformerDecoder(
            nn.TransformerDecoderLayer(
                d_model=d_model_dec,
                nhead=4,
                dim_feedforward=1024
            ),
            num_layers=6
        )
        
        # Adaptação dimensional entre encoder e decoder
        self.encoder_to_decoder = nn.Linear(d_model_enc, d_model_dec)
        
        self.embedding_enc = nn.Embedding(vocab_size, d_model_enc)
        self.embedding_dec = nn.Embedding(vocab_size, d_model_dec)
        self.output_projection = nn.Linear(d_model_dec, vocab_size)
    
    def forward(self, src, tgt):
        # Encoder processing
        src_emb = self.embedding_enc(src)
        encoder_output = self.encoder(src_emb)
        
        # Adaptação dimensional
        adapted_encoder = self.encoder_to_decoder(encoder_output)
        
        # Decoder processing
        tgt_emb = self.embedding_dec(tgt)
        decoder_output = self.decoder(tgt_emb, adapted_encoder)
        
        return self.output_projection(decoder_output)
```

### Attention Causal (Unidirecional)
```python
class CausalAsymmetricAttention(nn.Module):
    """
    Atenção causal com assimetria temporal
    """
    def __init__(self, d_model, window_size=None):
        super().__init__()
        self.d_model = d_model
        self.window_size = window_size
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        
        # Bias posicional assimétrico
        self.positional_bias = nn.Parameter(torch.randn(1000, 1000))
    
    def forward(self, x):
        seq_len = x.shape[1]
        
        Q = self.W_q(x)
        K = self.W_k(x)
        V = self.W_v(x)
        
        # Scores base
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_model ** 0.5)
        
        # Adicionar bias posicional assimétrico
        pos_bias = self.positional_bias[:seq_len, :seq_len]
        scores = scores + pos_bias
        
        # Máscara causal
        causal_mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
        scores = scores.masked_fill(causal_mask.bool(), -float('inf'))
        
        # Janela de atenção assimétrica (se especificada)
        if self.window_size:
            window_mask = torch.zeros(seq_len, seq_len)
            for i in range(seq_len):
                start = max(0, i - self.window_size)
                window_mask[i, :start] = 1
            
            scores = scores.masked_fill(window_mask.bool(), -float('inf'))
        
        attention_weights = F.softmax(scores, dim=-1)
        output = torch.matmul(attention_weights, V)
        
        return output, attention_weights
```

## Loss Functions Assimétricas

### Focal Loss (Assimétrica por Classe)
```python
class AsymmetricFocalLoss(nn.Module):
    """
    Focal Loss com tratamento assimétrico para classes positivas e negativas
    """
    def __init__(self, alpha_pos=0.25, alpha_neg=0.75, gamma_pos=2.0, gamma_neg=1.0):
        super().__init__()
        self.alpha_pos = alpha_pos
        self.alpha_neg = alpha_neg
        self.gamma_pos = gamma_pos
        self.gamma_neg = gamma_neg
    
    def forward(self, predictions, targets):
        """
        predictions: [batch_size, num_classes]
        targets: [batch_size]
        """
        ce_loss = F.cross_entropy(predictions, targets, reduction='none')
        p_t = torch.exp(-ce_loss)
        
        # Tratamento assimétrico baseado na classe
        alpha_t = torch.where(targets == 1, self.alpha_pos, self.alpha_neg)
        gamma_t = torch.where(targets == 1, self.gamma_pos, self.gamma_neg)
        
        focal_loss = alpha_t * (1 - p_t) ** gamma_t * ce_loss
        
        return focal_loss.mean()

class AsymmetricBCELoss(nn.Module):
    """
    Binary Cross Entropy com penalizações assimétricas
    """
    def __init__(self, pos_weight=2.0, neg_weight=1.0, focus_pos=2.0, focus_neg=1.0):
        super().__init__()
        self.pos_weight = pos_weight
        self.neg_weight = neg_weight
        self.focus_pos = focus_pos
        self.focus_neg = focus_neg
    
    def forward(self, predictions, targets):
        """
        Diferentes penalizações para positivos e negativos
        """
        # Probabilidades
        probs = torch.sigmoid(predictions)
        
        # Loss positiva (quando target = 1)
        pos_loss = -self.pos_weight * (1 - probs) ** self.focus_pos * torch.log(probs + 1e-8)
        
        # Loss negativa (quando target = 0)  
        neg_loss = -self.neg_weight * probs ** self.focus_neg * torch.log(1 - probs + 1e-8)
        
        # Combinar baseado nos targets
        loss = targets * pos_loss + (1 - targets) * neg_loss
        
        return loss.mean()
```

### Asymmetric Ranking Loss
```python
class AsymmetricRankingLoss(nn.Module):
    """
    Loss de ranking com margens assimétricas
    """
    def __init__(self, margin_pos=0.5, margin_neg=0.3, scale_pos=2.0, scale_neg=1.0):
        super().__init__()
        self.margin_pos = margin_pos
        self.margin_neg = margin_neg
        self.scale_pos = scale_pos
        self.scale_neg = scale_neg
    
    def forward(self, anchor, positive, negative):
        """
        Diferentes margens para diferentes tipos de comparação
        """
        # Distâncias
        pos_dist = F.pairwise_distance(anchor, positive, p=2)
        neg_dist = F.pairwise_distance(anchor, negative, p=2)
        
        # Loss assimétrica
        pos_loss = self.scale_pos * F.relu(pos_dist - self.margin_pos)
        neg_loss = self.scale_neg * F.relu(self.margin_neg - neg_dist)
        
        total_loss = pos_loss + neg_loss
        
        return total_loss.mean(), {
            'positive_violations': (pos_loss > 0).float().mean().item(),
            'negative_violations': (neg_loss > 0).float().mean().item()
        }
```

## Regularização Assimétrica

### Directional Regularization
```python
class DirectionalRegularizer:
    """
    Regularização que trata diferentes direções de forma assimétrica
    """
    def __init__(self, lambda_forward=0.1, lambda_backward=0.05):
        self.lambda_forward = lambda_forward
        self.lambda_backward = lambda_backward
    
    def compute_directional_loss(self, hidden_states):
        """
        hidden_states: [batch, seq_len, hidden_dim]
        """
        # Diferenças forward (t+1 - t)
        forward_diffs = hidden_states[:, 1:, :] - hidden_states[:, :-1, :]
        forward_reg = torch.mean(torch.norm(forward_diffs, p=2, dim=-1))
        
        # Diferenças backward (t - t-1) - mesmo cálculo, interpretação diferente
        backward_diffs = hidden_states[:, 1:, :] - hidden_states[:, :-1, :]
        backward_reg = torch.mean(torch.norm(backward_diffs, p=1, dim=-1))  # L1 vs L2
        
        total_reg = (self.lambda_forward * forward_reg + 
                    self.lambda_backward * backward_reg)
        
        return total_reg

class AsymmetricDropout(nn.Module):
    """
    Dropout com probabilidades diferentes para diferentes dimensões
    """
    def __init__(self, p_first_half=0.1, p_second_half=0.3):
        super().__init__()
        self.p_first_half = p_first_half
        self.p_second_half = p_second_half
    
    def forward(self, x):
        if not self.training:
            return x
        
        # Dividir tensor pela metade
        mid_point = x.shape[-1] // 2
        
        # Dropout assimétrico
        first_half = F.dropout(x[..., :mid_point], p=self.p_first_half, training=True)
        second_half = F.dropout(x[..., mid_point:], p=self.p_second_half, training=True)
        
        return torch.cat([first_half, second_half], dim=-1)
```

## Otimizadores Assimétricos

### Asymmetric Learning Rates
```python
class AsymmetricOptimizer:
    """
    Learning rates diferentes para diferentes partes do modelo
    """
    def __init__(self, model, lr_encoder=1e-4, lr_decoder=1e-3, lr_head=1e-2):
        self.optimizers = {}
        
        # Encoder: learning rate baixo (já pré-treinado)
        encoder_params = [p for n, p in model.named_parameters() if 'encoder' in n]
        self.optimizers['encoder'] = torch.optim.Adam(encoder_params, lr=lr_encoder)
        
        # Decoder: learning rate médio
        decoder_params = [p for n, p in model.named_parameters() if 'decoder' in n]
        self.optimizers['decoder'] = torch.optim.Adam(decoder_params, lr=lr_decoder)
        
        # Head: learning rate alto (novo componente)
        head_params = [p for n, p in model.named_parameters() if 'head' in n or 'classifier' in n]
        self.optimizers['head'] = torch.optim.Adam(head_params, lr=lr_head)
    
    def step(self):
        for optimizer in self.optimizers.values():
            optimizer.step()
    
    def zero_grad(self):
        for optimizer in self.optimizers.values():
            optimizer.zero_grad()

class AsymmetricScheduler:
    """
    Schedules diferentes para diferentes componentes
    """
    def __init__(self, asymmetric_optimizer):
        self.schedulers = {}
        
        # Scheduler conservador para encoder
        self.schedulers['encoder'] = torch.optim.lr_scheduler.CosineAnnealingLR(
            asymmetric_optimizer.optimizers['encoder'], T_max=1000
        )
        
        # Scheduler agressivo para head
        self.schedulers['head'] = torch.optim.lr_scheduler.StepLR(
            asymmetric_optimizer.optimizers['head'], step_size=100, gamma=0.5
        )
    
    def step(self):
        for scheduler in self.schedulers.values():
            scheduler.step()
```

## Aplicações Práticas

### Machine Translation
```python
class AsymmetricTranslationModel(nn.Module):
    """
    Modelo de tradução com assimetrias específicas
    """
    def __init__(self, src_vocab, tgt_vocab):
        super().__init__()
        
        # Source language: encoder mais robusto
        self.src_encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=512, nhead=8),
            num_layers=12
        )
        
        # Target language: decoder mais eficiente
        self.tgt_decoder = nn.TransformerDecoder(
            nn.TransformerDecoderLayer(d_model=256, nhead=4),
            num_layers=6
        )
        
        # Attention assimétrica entre idiomas
        self.cross_attention = AsymmetricAttention(
            d_model=512, d_query=256, d_key=512
        )
    
    def forward(self, src, tgt):
        # Encode source com alta capacidade
        src_encoded = self.src_encoder(src)
        
        # Decode target com cross-attention assimétrica
        tgt_decoded = self.tgt_decoder(tgt, src_encoded)
        
        return tgt_decoded

### Question Answering
class AsymmetricQAModel(nn.Module):
    """
    QA com tratamento assimétrico de pergunta e contexto
    """
    def __init__(self, d_model=768):
        super().__init__()
        
        # Question encoder: focado em intenção
        self.question_encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=d_model, nhead=12),
            num_layers=4
        )
        
        # Context encoder: focado em informação factual
        self.context_encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=d_model, nhead=8),
            num_layers=8
        )
        
        # Asymmetric cross-attention
        self.qa_attention = AsymmetricAttention(
            d_model=d_model, d_query=d_model//2, d_key=d_model
        )
```

## Vantagens e Limitações

### Vantagens
```python
asymmetric_advantages = {
    'expressiveness': 'Maior capacidade de modelar relações complexas',
    'specialization': 'Permite especialização de componentes',
    'efficiency': 'Pode ser mais eficiente que soluções simétricas',
    'biological_plausibility': 'Mais próximo de sistemas biológicos',
    'task_specific': 'Adaptável a características específicas da tarefa'
}
```

### Limitações
```python
asymmetric_limitations = {
    'complexity': 'Maior complexidade de implementação',
    'tuning': 'Mais hiperparâmetros para ajustar',
    'interpretability': 'Pode ser mais difícil de interpretar',
    'overfitting': 'Risco de overfitting com mais parâmetros',
    'debugging': 'Debugging mais complexo'
}
```

### Trade-offs
```python
def analyze_asymmetric_tradeoffs(symmetric_model, asymmetric_model, task_data):
    """
    Analisa trade-offs entre modelos simétricos e assimétricos
    """
    results = {}
    
    # Performance
    results['symmetric_acc'] = evaluate_model(symmetric_model, task_data)
    results['asymmetric_acc'] = evaluate_model(asymmetric_model, task_data)
    
    # Complexidade
    results['symmetric_params'] = count_parameters(symmetric_model)
    results['asymmetric_params'] = count_parameters(asymmetric_model)
    
    # Tempo de treinamento
    results['symmetric_time'] = measure_training_time(symmetric_model, task_data)
    results['asymmetric_time'] = measure_training_time(asymmetric_model, task_data)
    
    # Eficiência
    results['efficiency_gain'] = (
        (results['asymmetric_acc'] - results['symmetric_acc']) /
        (results['asymmetric_params'] - results['symmetric_params'])
    )
    
    return results
```
