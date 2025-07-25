# Idempotência REST

A idempotência é um conceito fundamental no design de APIs REST que garante que operações múltiplas com o mesmo input produzam o mesmo resultado.

## Conceito de Idempotência

### Definição
Uma operação é **idempotente** quando pode ser executada múltiplas vezes sem causar efeitos colaterais diferentes do resultado da primeira execução.

```
f(f(x)) = f(x)
```

### Importância
- **Confiabilidade**: Permite retry automático em falhas de rede
- **Segurança**: Evita operações duplicadas acidentais
- **Consistência**: Mantém o estado do sistema previsível
- **Resiliência**: Facilita recuperação de erros

## Métodos HTTP e Idempotência

### Métodos Idempotentes

#### GET - Leitura Segura
```http
GET /users/123
```
- **Sempre idempotente**: Não modifica estado
- Múltiplas chamadas retornam o mesmo resultado
- Sem efeitos colaterais no servidor

#### PUT - Substituição Completa
```http
PUT /users/123
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "age": 30
}
```
- **Idempotente**: Substituição completa do recurso
- Resultado final sempre o mesmo
- Estado determinístico

#### DELETE - Remoção
```http
DELETE /users/123
```
- **Idempotente**: Resource deletado ou já inexistente
- Primeira chamada: 200 OK
- Chamadas subsequentes: 404 Not Found ou 204 No Content

#### HEAD e OPTIONS
```http
HEAD /users/123
OPTIONS /users
```
- **Sempre idempotentes**: Apenas metadados
- Não modificam estado do servidor

### Métodos NÃO Idempotentes

#### POST - Criação
```http
POST /users
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@email.com"
}
```
- **Não idempotente**: Cada chamada cria novo recurso
- Múltiplas execuções = múltiplos recursos
- Requer tratamento especial para evitar duplicatas

#### PATCH - Modificação Parcial
```http
PATCH /users/123
Content-Type: application/json

{
  "age": 31
}
```
- **Pode ser idempotente**: Depende da implementação
- Operações matemáticas (+1) não são idempotentes
- Operações de substituição (set) são idempotentes

## Implementando Idempotência

### PUT Idempotente
```python
# Flask exemplo
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    
    # Sempre substitui completamente
    user = {
        'id': user_id,
        'name': data['name'],
        'email': data['email'],
        'age': data['age'],
        'updated_at': datetime.utcnow()
    }
    
    # Salva ou atualiza
    db.users.replace_one({'id': user_id}, user, upsert=True)
    
    return jsonify(user), 200
```

### DELETE Idempotente
```python
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = db.users.delete_one({'id': user_id})
    
    if result.deleted_count == 0:
        # Recurso já não existe - ainda é sucesso idempotente
        return '', 404
    
    return '', 204
```

### PATCH Idempotente vs Não Idempotente
```python
# ❌ NÃO Idempotente - incremento
@app.route('/users/<int:user_id>/increment-age', methods=['PATCH'])
def increment_age(user_id):
    db.users.update_one(
        {'id': user_id}, 
        {'$inc': {'age': 1}}  # Cada chamada incrementa +1
    )
    return '', 204

# ✅ Idempotente - definição absoluta
@app.route('/users/<int:user_id>', methods=['PATCH'])
def update_user_age(user_id):
    data = request.get_json()
    db.users.update_one(
        {'id': user_id}, 
        {'$set': {'age': data['age']}}  # Sempre define o mesmo valor
    )
    return '', 204
```

## Casos Especiais e Desafios

### POST com Idempotência
```python
# Usando idempotency key para POST
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    idempotency_key = request.headers.get('Idempotency-Key')
    
    if idempotency_key:
        # Verifica se já foi processado
        existing = db.operations.find_one({'key': idempotency_key})
        if existing:
            return jsonify(existing['result']), existing['status_code']
    
    # Cria novo usuário
    user_id = generate_id()
    user = {
        'id': user_id,
        'name': data['name'],
        'email': data['email'],
        'created_at': datetime.utcnow()
    }
    
    db.users.insert_one(user)
    
    # Salva operação para idempotência
    if idempotency_key:
        db.operations.insert_one({
            'key': idempotency_key,
            'result': user,
            'status_code': 201,
            'created_at': datetime.utcnow()
        })
    
    return jsonify(user), 201
```

### Operações Não Determinísticas
```python
# ❌ Problemático - timestamp sempre diferente
def bad_update():
    return {
        'updated_at': datetime.utcnow(),  # Sempre diferente!
        'random_id': uuid.uuid4()        # Sempre diferente!
    }

# ✅ Idempotente - dados determinísticos
def good_update(fixed_timestamp=None):
    return {
        'updated_at': fixed_timestamp or datetime.utcnow(),
        'version': calculate_version_hash(data)  # Determinístico
    }
```

## Testando Idempotência

### Teste de PUT
```python
import requests

def test_put_idempotency():
    url = "http://api.example.com/users/123"
    data = {"name": "João", "email": "joao@email.com", "age": 30}
    
    # Primeira requisição
    response1 = requests.put(url, json=data)
    
    # Segunda requisição idêntica
    response2 = requests.put(url, json=data)
    
    # Devem ter o mesmo resultado
    assert response1.status_code == response2.status_code
    assert response1.json() == response2.json()
    
    # Estado final deve ser igual
    get_response = requests.get(url)
    assert get_response.json()['name'] == "João"
```

### Teste de DELETE
```python
def test_delete_idempotency():
    url = "http://api.example.com/users/123"
    
    # Primeira deleção
    response1 = requests.delete(url)
    assert response1.status_code == 204
    
    # Segunda deleção (recurso já não existe)
    response2 = requests.delete(url)
    assert response2.status_code in [404, 204]  # Ambos são válidos
    
    # Verificar que recurso não existe
    get_response = requests.get(url)
    assert get_response.status_code == 404
```

## Melhores Práticas

### 1. Design de URLs RESTful
```python
# ✅ Idempotente - PUT com ID específico
PUT /users/123

# ❌ Não idempotente - POST sem ID
POST /users

# ✅ Alternativa - PUT com ID determinístico
PUT /users/email:joao@email.com
```

### 2. Validação de Estado
```python
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    
    # Validar se estado permite a operação
    current_user = db.users.find_one({'id': user_id})
    
    if current_user and current_user.get('status') == 'deleted':
        return {'error': 'Cannot update deleted user'}, 409
    
    # Proceder com atualização idempotente
    # ...
```

### 3. Documentação Clara
```yaml
# OpenAPI specification
/users/{userId}:
  put:
    summary: Update user (idempotent)
    description: |
      Completely replaces the user resource. 
      Multiple identical requests will have the same effect.
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: integer
    responses:
      200:
        description: User updated successfully
      201:
        description: User created (if didn't exist)
```

## Monitoramento e Debugging

### Logs para Idempotência
```python
import logging

def log_idempotent_operation(method, resource, request_id):
    logging.info(
        f"Idempotent {method} on {resource}",
        extra={
            'request_id': request_id,
            'method': method,
            'resource': resource,
            'timestamp': datetime.utcnow().isoformat()
        }
    )

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
    log_idempotent_operation('PUT', f'/users/{user_id}', request_id)
    
    # Implementação...
```

### Métricas de Idempotência
```python
from prometheus_client import Counter, Histogram

idempotent_requests = Counter(
    'api_idempotent_requests_total',
    'Total idempotent requests',
    ['method', 'endpoint', 'status']
)

@app.after_request
def track_idempotency(response):
    if request.method in ['GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']:
        idempotent_requests.labels(
            method=request.method,
            endpoint=request.endpoint,
            status=response.status_code
        ).inc()
    
    return response
```

## Cenários Avançados

### Idempotência com Side Effects
```python
# Operações com efeitos colaterais controlados
@app.route('/users/<int:user_id>/send-welcome-email', methods=['PUT'])
def send_welcome_email(user_id):
    user = db.users.find_one({'id': user_id})
    
    if not user:
        return {'error': 'User not found'}, 404
    
    # Verificar se email já foi enviado (idempotência)
    if user.get('welcome_email_sent'):
        return {'message': 'Welcome email already sent'}, 200
    
    # Enviar email
    send_email(user['email'], 'welcome_template')
    
    # Marcar como enviado
    db.users.update_one(
        {'id': user_id},
        {'$set': {'welcome_email_sent': True, 'email_sent_at': datetime.utcnow()}}
    )
    
    return {'message': 'Welcome email sent'}, 200
```

### Batch Operations
```python
@app.route('/users/batch', methods=['PUT'])
def batch_update_users():
    data = request.get_json()
    users = data['users']
    
    results = []
    for user_data in users:
        # Cada operação individual é idempotente
        result = update_single_user(user_data['id'], user_data)
        results.append(result)
    
    # Operação batch também é idempotente
    return {'results': results}, 200
```

A idempotência é essencial para construir APIs REST confiáveis e resilientes, garantindo que operações possam ser repetidas sem causar inconsistências no sistema.
