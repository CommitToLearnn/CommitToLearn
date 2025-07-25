# Cache Redis

Redis (Remote Dictionary Server) é um armazenamento de estrutura de dados em memória, usado como banco de dados, cache e message broker.

## Conceitos Fundamentais

### O que é Redis
Redis é um **banco de dados NoSQL em memória** que oferece:
- Estruturas de dados avançadas
- Persistência opcional
- Replicação master-slave
- Clustering automático
- Pub/Sub messaging

### Características Principais
- **Performance**: Operações em memória (sub-milissegundo)
- **Versatilidade**: Múltiplas estruturas de dados
- **Persistência**: Snapshots e append-only logs
- **Escalabilidade**: Clustering e sharding
- **Atomicidade**: Operações atômicas

## Estruturas de Dados

### 1. Strings
```bash
# Operações básicas
SET chave "valor"
GET chave
INCR contador
DECR contador
EXPIRE chave 3600  # TTL em segundos

# Operações avançadas
MSET chave1 "valor1" chave2 "valor2"
MGET chave1 chave2
SETEX chave 60 "valor"  # SET com TTL
```

```python
import redis

# Conexão
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Strings
r.set('user:1001:name', 'João Silva')
r.set('user:1001:email', 'joao@email.com')
r.expire('user:1001:name', 3600)  # TTL 1 hora

# Cache de sessão
r.setex('session:abc123', 1800, 'user_id:1001')  # 30 min

# Contadores
r.incr('page_views')
r.incrby('downloads', 10)
```

### 2. Hashes
```bash
# Hash operations
HSET user:1001 name "João" email "joao@email.com" age 30
HGET user:1001 name
HGETALL user:1001
HDEL user:1001 age
HINCRBY user:1001 login_count 1
```

```python
# Hash para objetos
user_data = {
    'name': 'João Silva',
    'email': 'joao@email.com',
    'age': 30,
    'last_login': '2025-07-25T10:30:00Z'
}

r.hset('user:1001', mapping=user_data)
r.hget('user:1001', 'name')
r.hgetall('user:1001')

# Cache de configurações
config = {
    'max_connections': 100,
    'timeout': 30,
    'debug_mode': 'false'
}
r.hset('app:config', mapping=config)
```

### 3. Lists
```bash
# Lista como fila (FIFO)
LPUSH queue:tasks "task1"
LPUSH queue:tasks "task2"
RPOP queue:tasks  # Remove do final

# Lista como pilha (LIFO)
LPUSH stack:operations "op1"
LPOP stack:operations  # Remove do início

# Lista limitada
LPUSH recent:posts "post123"
LTRIM recent:posts 0 99  # Mantém apenas 100 itens
```

```python
# Queue de tarefas
r.lpush('queue:email', 'send_email_user123')
r.lpush('queue:email', 'send_email_user456')

# Worker processando queue
while True:
    task = r.brpop('queue:email', timeout=5)  # Blocking pop
    if task:
        queue_name, task_data = task
        process_email_task(task_data)

# Lista de posts recentes
r.lpush('recent:posts', f'post:{post_id}')
r.ltrim('recent:posts', 0, 9)  # Mantém últimos 10
```

### 4. Sets
```bash
# Sets únicos
SADD tags:python "web" "backend" "api"
SADD tags:javascript "web" "frontend" "react"
SINTER tags:python tags:javascript  # Interseção: "web"
SUNION tags:python tags:javascript  # União
SDIFF tags:python tags:javascript   # Diferença

# Membership testing
SISMEMBER tags:python "web"  # 1 (true)
```

```python
# Tags de produtos
r.sadd('product:123:tags', 'eletrônicos', 'smartphone', 'android')
r.sadd('product:124:tags', 'eletrônicos', 'tablet', 'android')

# Buscar produtos com tags similares
common_tags = r.sinter('product:123:tags', 'product:124:tags')
# Resultado: {'eletrônicos', 'android'}

# Sistema de seguidos
r.sadd('user:1001:following', '1002', '1003', '1004')
r.sadd('user:1002:followers', '1001', '1005')

# Verificar se segue
is_following = r.sismember('user:1001:following', '1002')
```

### 5. Sorted Sets (ZSets)
```bash
# Ranking com scores
ZADD leaderboard 100 "user1" 85 "user2" 92 "user3"
ZRANGE leaderboard 0 -1 WITHSCORES  # Todos com scores
ZREVRANGE leaderboard 0 2 WITHSCORES  # Top 3
ZRANK leaderboard "user2"  # Posição do user2
ZINCRBY leaderboard 5 "user2"  # Incrementa score
```

```python
# Leaderboard de jogos
scores = {
    'player1': 1500,
    'player2': 1350,
    'player3': 1750,
    'player4': 1200
}

for player, score in scores.items():
    r.zadd('game:leaderboard', {player: score})

# Top 10 players
top_players = r.zrevrange('game:leaderboard', 0, 9, withscores=True)

# Ranking temporal (timestamp como score)
import time
r.zadd('recent:activities', {
    f'user:1001:login': time.time(),
    f'user:1002:purchase': time.time() - 3600,
    f'user:1003:comment': time.time() - 1800
})

# Atividades das últimas 2 horas
two_hours_ago = time.time() - 7200
recent = r.zrangebyscore('recent:activities', two_hours_ago, '+inf')
```

## Padrões de Cache

### 1. Cache-Aside (Lazy Loading)
```python
def get_user(user_id):
    # Tentar cache primeiro
    cached_user = r.get(f'user:{user_id}')
    if cached_user:
        return json.loads(cached_user)
    
    # Se não existe, buscar no DB
    user = database.get_user(user_id)
    if user:
        # Armazenar no cache
        r.setex(f'user:{user_id}', 3600, json.dumps(user))
    
    return user

def update_user(user_id, data):
    # Atualizar no database
    database.update_user(user_id, data)
    
    # Invalidar cache
    r.delete(f'user:{user_id}')
    
    # Ou atualizar cache
    updated_user = database.get_user(user_id)
    r.setex(f'user:{user_id}', 3600, json.dumps(updated_user))
```

### 2. Write-Through
```python
def save_user(user_data):
    # Salvar no database primeiro
    user_id = database.save_user(user_data)
    
    # Atualizar cache imediatamente
    r.setex(f'user:{user_id}', 3600, json.dumps(user_data))
    
    return user_id
```

### 3. Write-Behind (Write-Back)
```python
def update_user_async(user_id, data):
    # Atualizar cache imediatamente
    r.hset(f'user:{user_id}', mapping=data)
    
    # Marcar para sync posterior
    r.sadd('dirty:users', user_id)
    
    # Worker separado faz sync com DB
    schedule_db_sync.delay(user_id)

# Worker background
def sync_to_database():
    while True:
        dirty_users = r.spop('dirty:users', 10)  # Processar lote
        for user_id in dirty_users:
            user_data = r.hgetall(f'user:{user_id}')
            database.update_user(user_id, user_data)
```

## Cache de Aplicações Web

### Flask com Redis
```python
from flask import Flask, request, jsonify
import redis
import json
import hashlib

app = Flask(__name__)
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

def cache_key(*args):
    """Gera chave de cache baseada nos argumentos"""
    key_string = ':'.join(str(arg) for arg in args)
    return hashlib.md5(key_string.encode()).hexdigest()

def cached_response(timeout=3600):
    """Decorator para cache de respostas"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            # Gerar chave baseada na função e argumentos
            key = cache_key(f.__name__, request.url, request.get_json())
            
            # Tentar buscar no cache
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            
            # Executar função original
            result = f(*args, **kwargs)
            
            # Armazenar no cache
            redis_client.setex(key, timeout, json.dumps(result))
            
            return result
        return wrapper
    return decorator

@app.route('/api/products')
@cached_response(timeout=1800)  # 30 minutos
def get_products():
    category = request.args.get('category')
    products = database.get_products(category=category)
    return {'products': products}

@app.route('/api/user/<int:user_id>')
@cached_response(timeout=3600)  # 1 hora
def get_user_profile(user_id):
    profile = database.get_user_profile(user_id)
    return profile
```

### Session Store
```python
from flask import session
import uuid

class RedisSessionInterface:
    def __init__(self, redis_client, prefix='session:'):
        self.redis = redis_client
        self.prefix = prefix
    
    def create_session(self, user_id, data, ttl=3600):
        session_id = str(uuid.uuid4())
        session_data = {
            'user_id': user_id,
            'created_at': time.time(),
            **data
        }
        
        key = f"{self.prefix}{session_id}"
        self.redis.setex(key, ttl, json.dumps(session_data))
        
        return session_id
    
    def get_session(self, session_id):
        key = f"{self.prefix}{session_id}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def delete_session(self, session_id):
        key = f"{self.prefix}{session_id}"
        self.redis.delete(key)
    
    def refresh_session(self, session_id, ttl=3600):
        key = f"{self.prefix}{session_id}"
        self.redis.expire(key, ttl)

# Uso
session_manager = RedisSessionInterface(redis_client)

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    
    if authenticate(username, password):
        user = get_user_by_username(username)
        session_id = session_manager.create_session(
            user['id'], 
            {'username': username, 'role': user['role']}
        )
        return {'session_token': session_id}
    
    return {'error': 'Invalid credentials'}, 401
```

## Rate Limiting

### Sliding Window Rate Limiter
```python
import time

class SlidingWindowRateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def is_allowed(self, key, limit, window_seconds):
        """
        Verifica se requisição é permitida
        key: identificador único (user_id, IP, etc.)
        limit: número máximo de requests
        window_seconds: janela de tempo em segundos
        """
        now = time.time()
        pipeline = self.redis.pipeline()
        
        # Remove requests antigas
        pipeline.zremrangebyscore(key, 0, now - window_seconds)
        
        # Conta requests atuais
        pipeline.zcard(key)
        
        # Adiciona request atual
        pipeline.zadd(key, {str(now): now})
        
        # Define TTL
        pipeline.expire(key, window_seconds)
        
        results = pipeline.execute()
        current_requests = results[1]
        
        return current_requests < limit

# Uso com Flask
@app.before_request
def rate_limit():
    if request.endpoint == 'api.upload':  # Endpoint sensível
        client_ip = request.remote_addr
        limiter = SlidingWindowRateLimiter(redis_client)
        
        # 10 requests per minute
        if not limiter.is_allowed(f'rate_limit:{client_ip}', 10, 60):
            return jsonify({'error': 'Rate limit exceeded'}), 429
```

### Token Bucket Rate Limiter
```python
class TokenBucketRateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def consume_token(self, key, capacity, refill_rate, tokens_requested=1):
        """
        Token bucket algorithm
        capacity: tamanho máximo do bucket
        refill_rate: tokens por segundo
        tokens_requested: tokens necessários para a operação
        """
        lua_script = """
        local key = KEYS[1]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local tokens_requested = tonumber(ARGV[3])
        local now = tonumber(ARGV[4])
        
        local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
        local tokens = tonumber(bucket[1]) or capacity
        local last_refill = tonumber(bucket[2]) or now
        
        -- Calcular tokens para adicionar
        local time_passed = now - last_refill
        local tokens_to_add = time_passed * refill_rate
        tokens = math.min(capacity, tokens + tokens_to_add)
        
        -- Verificar se há tokens suficientes
        if tokens >= tokens_requested then
            tokens = tokens - tokens_requested
            redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
            redis.call('EXPIRE', key, 3600)
            return 1  -- Permitido
        else
            redis.call('HMSET', key, 'tokens', tokens, 'last_refill', now)
            redis.call('EXPIRE', key, 3600)
            return 0  -- Negado
        end
        """
        
        now = time.time()
        result = self.redis.eval(
            lua_script, 1, key, capacity, refill_rate, tokens_requested, now
        )
        
        return bool(result)

# Rate limiting por API key
limiter = TokenBucketRateLimiter(redis_client)

@app.before_request
def api_rate_limit():
    api_key = request.headers.get('X-API-Key')
    if api_key:
        # 1000 requests per hour (capacity=1000, refill=1000/3600)
        if not limiter.consume_token(f'api_limit:{api_key}', 1000, 0.278):
            return jsonify({'error': 'API rate limit exceeded'}), 429
```

## Cache Distribuído

### Configuração de Cluster
```python
from rediscluster import RedisCluster

# Configuração de cluster
startup_nodes = [
    {"host": "redis-node1", "port": "7000"},
    {"host": "redis-node2", "port": "7000"},
    {"host": "redis-node3", "port": "7000"}
]

cluster = RedisCluster(
    startup_nodes=startup_nodes,
    decode_responses=True,
    skip_full_coverage_check=True
)

# Cache distribuído com failover
class DistributedCache:
    def __init__(self, cluster_nodes):
        self.cluster = RedisCluster(startup_nodes=cluster_nodes)
    
    def get_with_fallback(self, key, fallback_func):
        try:
            cached = self.cluster.get(key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            print(f"Cache error: {e}")
        
        # Fallback para fonte original
        data = fallback_func()
        
        # Tentar armazenar no cache
        try:
            self.cluster.setex(key, 3600, json.dumps(data))
        except Exception as e:
            print(f"Cache write error: {e}")
        
        return data
```

## Otimizações e Performance

### Connection Pooling
```python
import redis.connection

# Pool de conexões
pool = redis.ConnectionPool(
    host='localhost',
    port=6379,
    max_connections=20,
    retry_on_timeout=True,
    socket_keepalive=True,
    socket_keepalive_options={}
)

redis_client = redis.Redis(connection_pool=pool)

# Pool para cluster
cluster_pool = {
    'max_connections': 20,
    'retry_on_timeout': True,
    'socket_keepalive': True
}

cluster = RedisCluster(
    startup_nodes=startup_nodes,
    connection_pool_class_kwargs=cluster_pool
)
```

### Pipeline para Batch Operations
```python
def bulk_cache_operations():
    pipe = redis_client.pipeline()
    
    # Múltiplas operações em batch
    users = get_users_from_db(limit=1000)
    
    for user in users:
        key = f"user:{user['id']}"
        pipe.setex(key, 3600, json.dumps(user))
        pipe.sadd('active_users', user['id'])
    
    # Executar todas de uma vez
    pipe.execute()

# Cache warming
def warm_cache():
    print("Warming cache...")
    
    # Popular cache com dados frequentes
    popular_products = database.get_popular_products(limit=100)
    recent_posts = database.get_recent_posts(limit=50)
    
    pipe = redis_client.pipeline()
    
    for product in popular_products:
        pipe.setex(f"product:{product['id']}", 7200, json.dumps(product))
    
    for post in recent_posts:
        pipe.setex(f"post:{post['id']}", 3600, json.dumps(post))
    
    pipe.execute()
    print(f"Cache warmed with {len(popular_products)} products and {len(recent_posts)} posts")
```

## Monitoramento e Debugging

### Métricas de Cache
```python
from prometheus_client import Counter, Histogram, Gauge

# Métricas
cache_hits = Counter('redis_cache_hits_total', 'Cache hits')
cache_misses = Counter('redis_cache_misses_total', 'Cache misses')
cache_latency = Histogram('redis_operation_duration_seconds', 'Redis operation latency')
active_connections = Gauge('redis_active_connections', 'Active Redis connections')

class MonitoredRedisClient:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def get(self, key):
        with cache_latency.time():
            result = self.redis.get(key)
            
            if result:
                cache_hits.inc()
            else:
                cache_misses.inc()
            
            return result
    
    def get_stats(self):
        info = self.redis.info()
        return {
            'connected_clients': info['connected_clients'],
            'used_memory': info['used_memory'],
            'used_memory_human': info['used_memory_human'],
            'keyspace_hits': info['keyspace_hits'],
            'keyspace_misses': info['keyspace_misses'],
            'hit_rate': info['keyspace_hits'] / (info['keyspace_hits'] + info['keyspace_misses']) * 100
        }

# Health check endpoint
@app.route('/health/redis')
def redis_health():
    try:
        redis_client.ping()
        stats = MonitoredRedisClient(redis_client).get_stats()
        return {'status': 'healthy', 'stats': stats}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 503
```

### Debugging Tools
```python
def debug_cache_keys(pattern='*'):
    """Lista chaves que correspondem ao padrão"""
    keys = redis_client.keys(pattern)
    
    for key in keys[:10]:  # Primeiras 10
        key_type = redis_client.type(key)
        ttl = redis_client.ttl(key)
        
        print(f"Key: {key}")
        print(f"Type: {key_type}")
        print(f"TTL: {ttl}")
        
        if key_type == 'string':
            value = redis_client.get(key)
            print(f"Value: {value[:100]}...")  # Primeiros 100 chars
        elif key_type == 'hash':
            fields = redis_client.hlen(key)
            print(f"Hash fields: {fields}")
        elif key_type == 'list':
            length = redis_client.llen(key)
            print(f"List length: {length}")
        elif key_type == 'set':
            size = redis_client.scard(key)
            print(f"Set size: {size}")
        elif key_type == 'zset':
            size = redis_client.zcard(key)
            print(f"ZSet size: {size}")
        
        print("-" * 50)

def cache_memory_analysis():
    """Analisa uso de memória por padrão de chave"""
    info = redis_client.info('memory')
    
    patterns = ['user:*', 'session:*', 'product:*', 'cache:*']
    
    for pattern in patterns:
        keys = redis_client.keys(pattern)
        total_memory = 0
        
        for key in keys:
            # Comando MEMORY USAGE (Redis 4.0+)
            try:
                memory = redis_client.memory_usage(key)
                total_memory += memory
            except:
                # Fallback para estimativa
                total_memory += len(str(redis_client.dump(key)))
        
        print(f"Pattern '{pattern}': {len(keys)} keys, ~{total_memory/1024/1024:.2f} MB")

# Limpeza automática
def cleanup_expired_keys():
    """Remove chaves com padrões antigos"""
    patterns_to_clean = [
        'temp:*',
        'session:*',
        'cache:old:*'
    ]
    
    for pattern in patterns_to_clean:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
            print(f"Cleaned {len(keys)} keys matching '{pattern}'")
```

## Melhores Práticas

### 1. Naming Conventions
```python
# ✅ Bom - Hierárquico e descritivo
user_cache_key = f"app:v1:user:{user_id}:profile"
session_key = f"app:v1:session:{session_id}"
rate_limit_key = f"app:v1:rate_limit:api:{api_key}"

# ❌ Ruim - Sem estrutura
user_key = f"user{user_id}"
session_key = f"sess_{session_id}"
```

### 2. TTL Management
```python
# TTLs baseados no uso
TTL_CONFIG = {
    'user_profile': 3600,      # 1 hora - dados que mudam pouco
    'session': 1800,           # 30 min - dados de sessão
    'api_response': 300,       # 5 min - dados dinâmicos
    'static_content': 86400,   # 24 horas - conteúdo estático
    'rate_limit': 60           # 1 min - rate limiting
}

def set_with_appropriate_ttl(key, value, key_type):
    ttl = TTL_CONFIG.get(key_type, 3600)  # Default 1 hora
    redis_client.setex(key, ttl, value)
```

### 3. Error Handling
```python
class CacheManager:
    def __init__(self, redis_client, fallback_func=None):
        self.redis = redis_client
        self.fallback_func = fallback_func
    
    def get_or_compute(self, key, compute_func, ttl=3600):
        try:
            # Tentar cache primeiro
            cached = self.redis.get(key)
            if cached:
                return json.loads(cached)
        except redis.RedisError as e:
            print(f"Redis error: {e}")
            # Continuar sem cache
        
        # Computar valor
        value = compute_func()
        
        try:
            # Tentar armazenar no cache
            self.redis.setex(key, ttl, json.dumps(value))
        except redis.RedisError as e:
            print(f"Redis write error: {e}")
            # Não falhar se não conseguir cachear
        
        return value
```

Redis é uma ferramenta poderosa para cache, session storage, rate limiting e muito mais. A chave é entender os padrões corretos para cada caso de uso e monitorar performance adequadamente.
