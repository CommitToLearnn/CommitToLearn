# Idempotency Key

O **Idempotency Key** é um mecanismo que permite tornar operações não idempotentes (como POST) em operações idempotentes através de identificadores únicos.

## Conceito Fundamental

### Definição
Uma **chave de idempotência** é um identificador único fornecido pelo cliente que permite ao servidor detectar e prevenir o processamento duplicado de operações.

```http
POST /payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440001
Content-Type: application/json

{
  "amount": 100.00,
  "currency": "USD",
  "recipient": "user123"
}
```

### Funcionamento
1. Cliente envia requisição com chave única
2. Servidor verifica se já processou essa chave
3. Se sim: retorna resultado armazenado
4. Se não: processa e armazena resultado

## Implementação Básica

### Estrutura do Header
```http
Idempotency-Key: <unique-identifier>
```

### Geração de Chaves
```python
import uuid
import hashlib

# UUID v4 (recomendado)
idempotency_key = str(uuid.uuid4())
# Exemplo: "550e8400-e29b-41d4-a716-446655440001"

# Hash baseado em conteúdo
def generate_content_hash(data):
    content = json.dumps(data, sort_keys=True)
    return hashlib.sha256(content.encode()).hexdigest()

# Timestamp + random
import time
import random

def generate_time_based_key():
    timestamp = int(time.time() * 1000)  # milliseconds
    random_part = random.randint(1000, 9999)
    return f"{timestamp}-{random_part}"
```

### Implementação no Servidor
```python
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import json

app = Flask(__name__)

# Armazenamento em memória (usar Redis/DB em produção)
idempotency_store = {}

class IdempotencyManager:
    def __init__(self, ttl_hours=24):
        self.ttl_hours = ttl_hours
    
    def get_stored_response(self, key):
        """Recupera resposta armazenada para a chave"""
        if key in idempotency_store:
            entry = idempotency_store[key]
            
            # Verificar TTL
            if datetime.utcnow() > entry['expires_at']:
                del idempotency_store[key]
                return None
            
            return entry
        return None
    
    def store_response(self, key, response_data, status_code):
        """Armazena resposta para futura referência"""
        idempotency_store[key] = {
            'response': response_data,
            'status_code': status_code,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(hours=self.ttl_hours)
        }

idempotency_manager = IdempotencyManager()

@app.route('/payments', methods=['POST'])
def create_payment():
    idempotency_key = request.headers.get('Idempotency-Key')
    
    if not idempotency_key:
        return {'error': 'Idempotency-Key header is required'}, 400
    
    # Verificar se já foi processado
    stored = idempotency_manager.get_stored_response(idempotency_key)
    if stored:
        return jsonify(stored['response']), stored['status_code']
    
    # Processar nova requisição
    data = request.get_json()
    
    try:
        # Validar dados
        if not data.get('amount') or data['amount'] <= 0:
            raise ValueError("Invalid amount")
        
        # Processar pagamento
        payment = {
            'id': str(uuid.uuid4()),
            'amount': data['amount'],
            'currency': data.get('currency', 'USD'),
            'recipient': data['recipient'],
            'status': 'completed',
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Simular processamento
        process_payment(payment)
        
        # Armazenar para idempotência
        idempotency_manager.store_response(idempotency_key, payment, 201)
        
        return jsonify(payment), 201
        
    except Exception as e:
        error_response = {'error': str(e)}
        idempotency_manager.store_response(idempotency_key, error_response, 400)
        return jsonify(error_response), 400
```

## Implementação com Redis

### Configuração Redis
```python
import redis
import json
from datetime import timedelta

redis_client = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True
)

class RedisIdempotencyManager:
    def __init__(self, redis_client, ttl_hours=24):
        self.redis = redis_client
        self.ttl_seconds = ttl_hours * 3600
    
    def _make_key(self, idempotency_key):
        return f"idempotency:{idempotency_key}"
    
    def get_stored_response(self, idempotency_key):
        """Recupera resposta do Redis"""
        key = self._make_key(idempotency_key)
        stored_data = self.redis.get(key)
        
        if stored_data:
            return json.loads(stored_data)
        return None
    
    def store_response(self, idempotency_key, response_data, status_code):
        """Armazena resposta no Redis com TTL"""
        key = self._make_key(idempotency_key)
        data = {
            'response': response_data,
            'status_code': status_code,
            'created_at': datetime.utcnow().isoformat()
        }
        
        self.redis.setex(
            key,
            self.ttl_seconds,
            json.dumps(data)
        )
    
    def is_processing(self, idempotency_key):
        """Verifica se requisição está sendo processada"""
        lock_key = f"lock:{self._make_key(idempotency_key)}"
        return self.redis.exists(lock_key)
    
    def set_processing_lock(self, idempotency_key, timeout=300):
        """Define lock de processamento"""
        lock_key = f"lock:{self._make_key(idempotency_key)}"
        return self.redis.setex(lock_key, timeout, "processing")
    
    def release_processing_lock(self, idempotency_key):
        """Remove lock de processamento"""
        lock_key = f"lock:{self._make_key(idempotency_key)}"
        self.redis.delete(lock_key)

# Uso com lock de processamento
@app.route('/payments', methods=['POST'])
def create_payment_with_lock():
    idempotency_key = request.headers.get('Idempotency-Key')
    
    if not idempotency_key:
        return {'error': 'Idempotency-Key header is required'}, 400
    
    manager = RedisIdempotencyManager(redis_client)
    
    # Verificar se já foi processado
    stored = manager.get_stored_response(idempotency_key)
    if stored:
        return jsonify(stored['response']), stored['status_code']
    
    # Verificar se está sendo processado
    if manager.is_processing(idempotency_key):
        return {'error': 'Request is being processed'}, 409
    
    # Definir lock de processamento
    manager.set_processing_lock(idempotency_key)
    
    try:
        # Processar requisição
        data = request.get_json()
        payment = process_payment_logic(data)
        
        # Armazenar resultado
        manager.store_response(idempotency_key, payment, 201)
        
        return jsonify(payment), 201
        
    except Exception as e:
        error_response = {'error': str(e)}
        manager.store_response(idempotency_key, error_response, 400)
        return jsonify(error_response), 400
        
    finally:
        # Sempre remover lock
        manager.release_processing_lock(idempotency_key)
```

## Implementação com Banco de Dados

### Schema da Tabela
```sql
CREATE TABLE idempotency_keys (
    id VARCHAR(255) PRIMARY KEY,
    response_body TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_expires_at (expires_at)
);
```

### Implementação SQLAlchemy
```python
from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

Base = declarative_base()

class IdempotencyKey(Base):
    __tablename__ = 'idempotency_keys'
    
    id = Column(String(255), primary_key=True)
    response_body = Column(Text, nullable=False)
    status_code = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

class DatabaseIdempotencyManager:
    def __init__(self, session, ttl_hours=24):
        self.session = session
        self.ttl_hours = ttl_hours
    
    def get_stored_response(self, idempotency_key):
        """Recupera resposta do banco"""
        # Limpar chaves expiradas
        self.cleanup_expired()
        
        record = self.session.query(IdempotencyKey).filter_by(
            id=idempotency_key
        ).first()
        
        if record:
            return {
                'response': json.loads(record.response_body),
                'status_code': record.status_code
            }
        return None
    
    def store_response(self, idempotency_key, response_data, status_code):
        """Armazena resposta no banco"""
        expires_at = datetime.utcnow() + timedelta(hours=self.ttl_hours)
        
        record = IdempotencyKey(
            id=idempotency_key,
            response_body=json.dumps(response_data),
            status_code=status_code,
            expires_at=expires_at
        )
        
        self.session.merge(record)  # Upsert
        self.session.commit()
    
    def cleanup_expired(self):
        """Remove chaves expiradas"""
        self.session.query(IdempotencyKey).filter(
            IdempotencyKey.expires_at < datetime.utcnow()
        ).delete()
        self.session.commit()
```

## Padrões de Uso

### Client-Side (JavaScript)
```javascript
class IdempotentApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    generateIdempotencyKey() {
        return crypto.randomUUID();
    }
    
    async makeIdempotentRequest(endpoint, method, data, retries = 3) {
        const idempotencyKey = this.generateIdempotencyKey();
        
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Idempotency-Key': idempotencyKey
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    return await response.json();
                }
                
                if (response.status === 409) {
                    // Request being processed, wait and retry
                    await this.delay(1000 * (attempt + 1));
                    continue;
                }
                
                throw new Error(`Request failed: ${response.status}`);
                
            } catch (error) {
                if (attempt === retries - 1) throw error;
                await this.delay(1000 * (attempt + 1));
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Uso
const client = new IdempotentApiClient('https://api.example.com');

const payment = await client.makeIdempotentRequest('/payments', 'POST', {
    amount: 100.00,
    currency: 'USD',
    recipient: 'user123'
});
```

### Client-Side (Python)
```python
import requests
import uuid
import time

class IdempotentClient:
    def __init__(self, base_url, max_retries=3):
        self.base_url = base_url
        self.max_retries = max_retries
    
    def make_request(self, endpoint, method='POST', data=None):
        idempotency_key = str(uuid.uuid4())
        url = f"{self.base_url}{endpoint}"
        
        headers = {
            'Content-Type': 'application/json',
            'Idempotency-Key': idempotency_key
        }
        
        for attempt in range(self.max_retries):
            try:
                response = requests.request(
                    method=method,
                    url=url,
                    json=data,
                    headers=headers,
                    timeout=30
                )
                
                if response.status_code == 409:
                    # Being processed, wait and retry
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.RequestException as e:
                if attempt == self.max_retries - 1:
                    raise e
                time.sleep(2 ** attempt)

# Uso
client = IdempotentClient('https://api.example.com')
result = client.make_request('/payments', data={
    'amount': 100.00,
    'currency': 'USD',
    'recipient': 'user123'
})
```

## Melhores Práticas

### 1. Validação de Chaves
```python
import re

def validate_idempotency_key(key):
    """Valida formato da chave de idempotência"""
    if not key:
        return False, "Idempotency key is required"
    
    if len(key) < 10 or len(key) > 255:
        return False, "Idempotency key must be between 10-255 characters"
    
    # UUID format
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    if re.match(uuid_pattern, key, re.IGNORECASE):
        return True, None
    
    # Alphanumeric with hyphens
    if re.match(r'^[a-zA-Z0-9\-_]+$', key):
        return True, None
    
    return False, "Invalid idempotency key format"

@app.before_request
def validate_idempotency():
    if request.method == 'POST' and request.endpoint in ['create_payment', 'create_order']:
        key = request.headers.get('Idempotency-Key')
        is_valid, error = validate_idempotency_key(key)
        
        if not is_valid:
            return jsonify({'error': error}), 400
```

### 2. TTL Apropriado
```python
# Configuração baseada no tipo de operação
TTL_CONFIG = {
    'payments': 24 * 60 * 60,      # 24 horas
    'orders': 6 * 60 * 60,         # 6 horas
    'notifications': 60 * 60,       # 1 hora
    'reports': 7 * 24 * 60 * 60    # 7 dias
}

def get_ttl_for_operation(operation_type):
    return TTL_CONFIG.get(operation_type, 24 * 60 * 60)
```

### 3. Monitoramento
```python
from prometheus_client import Counter, Histogram

idempotency_metrics = {
    'hits': Counter('idempotency_cache_hits_total', 'Cache hits'),
    'misses': Counter('idempotency_cache_misses_total', 'Cache misses'),
    'errors': Counter('idempotency_errors_total', 'Idempotency errors'),
    'processing_time': Histogram('idempotency_processing_seconds', 'Processing time')
}

def track_idempotency_hit():
    idempotency_metrics['hits'].inc()

def track_idempotency_miss():
    idempotency_metrics['misses'].inc()
```

### 4. Segurança
```python
import hashlib
import hmac

class SecureIdempotencyManager:
    def __init__(self, secret_key):
        self.secret_key = secret_key
    
    def sign_key(self, idempotency_key, user_id):
        """Cria assinatura para prevenir ataques"""
        message = f"{idempotency_key}:{user_id}"
        signature = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        return f"{idempotency_key}.{signature}"
    
    def verify_key(self, signed_key, user_id):
        """Verifica assinatura da chave"""
        try:
            key, signature = signed_key.rsplit('.', 1)
            expected_signature = self.sign_key(key, user_id)
            return hmac.compare_digest(signed_key, expected_signature)
        except ValueError:
            return False
```

## Casos de Uso Avançados

### Webhook Idempotente
```python
@app.route('/webhooks/payment-status', methods=['POST'])
def payment_webhook():
    # Webhook providers geralmente enviam idempotency key
    idempotency_key = request.headers.get('Webhook-Id') or request.headers.get('Idempotency-Key')
    
    if not idempotency_key:
        # Gerar baseado no conteúdo se não fornecido
        content = request.get_data()
        idempotency_key = hashlib.sha256(content).hexdigest()
    
    # Verificar se já processamos este webhook
    stored = idempotency_manager.get_stored_response(idempotency_key)
    if stored:
        return '', 200  # Webhook já processado
    
    # Processar webhook
    data = request.get_json()
    process_payment_status_update(data)
    
    # Marcar como processado
    idempotency_manager.store_response(idempotency_key, {'status': 'processed'}, 200)
    
    return '', 200
```

### Batch Operations
```python
@app.route('/batch/payments', methods=['POST'])
def batch_payments():
    idempotency_key = request.headers.get('Idempotency-Key')
    data = request.get_json()
    
    # Verificar resultado de batch anterior
    stored = idempotency_manager.get_stored_response(idempotency_key)
    if stored:
        return jsonify(stored['response']), stored['status_code']
    
    results = []
    
    for i, payment_data in enumerate(data['payments']):
        # Gerar sub-chave para cada item
        sub_key = f"{idempotency_key}:item:{i}"
        
        # Verificar se item já foi processado
        item_stored = idempotency_manager.get_stored_response(sub_key)
        if item_stored:
            results.append(item_stored['response'])
        else:
            # Processar item
            try:
                payment = process_payment(payment_data)
                results.append(payment)
                idempotency_manager.store_response(sub_key, payment, 201)
            except Exception as e:
                error = {'error': str(e), 'item_index': i}
                results.append(error)
                idempotency_manager.store_response(sub_key, error, 400)
    
    # Armazenar resultado do batch
    batch_result = {'results': results, 'total': len(results)}
    idempotency_manager.store_response(idempotency_key, batch_result, 200)
    
    return jsonify(batch_result), 200
```

O **Idempotency Key** é fundamental para construir APIs robustas que podem lidar com falhas de rede, timeouts e requisições duplicadas de forma elegante e segura.
