# Docker com Banco de Dados: Conectando Aplicações e Persistindo Dados

Integrar aplicações Docker com bancos de dados é fundamental para aplicações reais. Este guia cobre desde conexões simples até arquiteturas complexas com múltiplos serviços.

## Conceitos Fundamentais

### Comunicação entre Containers
```yaml
# docker-compose.yml básico
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Container Discovery
Containers no mesmo network podem se comunicar usando o **nome do serviço** como hostname:
- `app` conecta em `db:5432`
- `db` é resolvido automaticamente pelo Docker
- Não precisa conhecer IPs internos

## Padrões de Conexão

### Aplicação + PostgreSQL

#### Dockerfile da Aplicação
```dockerfile
FROM node:18-slim
WORKDIR /app

# Instalar cliente PostgreSQL (opcional, para debugging)
RUN apt-get update && apt-get install -y postgresql-client

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Health check para aguardar DB
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

EXPOSE 3000

# Aguardar DB antes de iniciar
CMD ["./wait-for-it.sh", "db:5432", "--", "node", "server.js"]
```

#### Aplicação Node.js
```javascript
// server.js
const express = require('express');
const { Pool } = require('pg');

const app = express();

// Configuração do banco via environment
const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'myapp',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware de conexão
app.use(async (req, res, next) => {
  try {
    const client = await pool.connect();
    req.db = client;
    res.on('finish', () => client.release());
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Rotas
app.get('/users', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Docker Compose Completo
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - DB_NAME=myapp
      - DB_USER=user
      - DB_PASSWORD=password
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"  # Para desenvolvimento
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    restart: unless-stopped
    networks:
      - app-network

  # Admin interface (opcional)
  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "8080:80"
    depends_on:
      - db
    networks:
      - app-network

volumes:
  postgres_data:
    driver: local

networks:
  app-network:
    driver: bridge
```

### Aplicação + MongoDB

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/myapp
    depends_on:
      - mongo
    networks:
      - app-network

  mongo:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: myapp
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    ports:
      - "27017:27017"
    networks:
      - app-network

  # MongoDB admin interface
  mongo-express:
    image: mongo-express
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      ME_CONFIG_MONGODB_URL: mongodb://admin:password@mongo:27017/
    ports:
      - "8081:8081"
    depends_on:
      - mongo
    networks:
      - app-network

volumes:
  mongo_data:

networks:
  app-network:
```

### Aplicação + MySQL

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@mysql:3306/myapp
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: myapp
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - app-network

  # phpMyAdmin (opcional)
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      PMA_USER: user
      PMA_PASSWORD: password
    ports:
      - "8082:80"
    depends_on:
      - mysql
    networks:
      - app-network

volumes:
  mysql_data:

networks:
  app-network:
```

## Estratégias de Inicialização

### Wait Scripts
```bash
#!/bin/bash
# wait-for-it.sh - Script para aguardar serviços

WAITFORIT_cmdname=${0##*/}

echoerr() { if [[ $WAITFORIT_QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage() {
    cat << USAGE >&2
Usage:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for() {
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        echoerr "$WAITFORIT_cmdname: waiting $WAITFORIT_TIMEOUT seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
    else
        echoerr "$WAITFORIT_cmdname: waiting for $WAITFORIT_HOST:$WAITFORIT_PORT without a timeout"
    fi
    WAITFORIT_start_ts=$(date +%s)
    while :
    do
        if [[ $WAITFORIT_ISBUSY -eq 1 ]]; then
            nc -z $WAITFORIT_HOST $WAITFORIT_PORT
            WAITFORIT_result=$?
        else
            (echo > /dev/tcp/$WAITFORIT_HOST/$WAITFORIT_PORT) >/dev/null 2>&1
            WAITFORIT_result=$?
        fi
        if [[ $WAITFORIT_result -eq 0 ]]; then
            WAITFORIT_end_ts=$(date +%s)
            echoerr "$WAITFORIT_cmdname: $WAITFORIT_HOST:$WAITFORIT_PORT is available after $((WAITFORIT_end_ts - WAITFORIT_start_ts)) seconds"
            break
        fi
        sleep 1
    done
    return $WAITFORIT_result
}

# Implementar parsing de argumentos...
# Usar: ./wait-for-it.sh db:5432 -- node server.js
```

### Health Checks Inteligentes
```javascript
// health-check.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'myapp',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
});

async function waitForDatabase(maxRetries = 30, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connected successfully');
      return true;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1}/${maxRetries} failed:`, error.message);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Could not connect to database after maximum retries');
}

module.exports = { waitForDatabase };
```

### Docker Compose Dependencies
```yaml
version: '3.8'

services:
  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
```

## Persistência de Dados

### Named Volumes (Recomendado)
```yaml
# docker-compose.yml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7
    volumes:
      - redis_data:/data
```

```bash
# Gerenciar volumes
docker volume ls
docker volume inspect postgres_data
docker volume create --driver local custom_volume

# Backup de volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore de volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

### Bind Mounts (Desenvolvimento)
```yaml
services:
  db:
    image: postgres:15
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./sql/migrations:/migrations
```

### Tmpfs Mounts (Dados Temporários)
```yaml
services:
  redis:
    image: redis:7
    tmpfs:
      - /data  # Dados apenas em memória
    
  app:
    build: .
    tmpfs:
      - /tmp
      - /var/cache
```

## Configurações de Segurança

### Secrets Management
```yaml
# docker-compose.yml com secrets
version: '3.8'

services:
  app:
    build: .
    secrets:
      - db_password
      - api_key
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - API_KEY_FILE=/run/secrets/api_key

  db:
    image: postgres:15
    secrets:
      - db_password
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    file: ./secrets/api_key.txt
```

### Network Isolation
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    networks:
      - frontend-network
    ports:
      - "80:80"

  backend:
    build: ./backend
    networks:
      - frontend-network
      - backend-network
    # Não expõe portas diretamente

  database:
    image: postgres:15
    networks:
      - backend-network
    # Isolado do frontend

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true  # Sem acesso externo
```

### User Security
```dockerfile
# Dockerfile com usuário não-root
FROM postgres:15

# Criar usuário personalizado
RUN groupadd -r myapp && useradd -r -g myapp myapp

# Configurar permissões
RUN chown -R myapp:myapp /var/lib/postgresql/data

USER myapp
```

## Arquiteturas Complexas

### Microserviços com Banco Compartilhado
```yaml
version: '3.8'

services:
  # API Gateway
  gateway:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
    depends_on:
      - user-service
      - order-service
    networks:
      - public

  # Microserviços
  user-service:
    build: ./services/user
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/users
    networks:
      - public
      - database

  order-service:
    build: ./services/order
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/orders
    networks:
      - public
      - database

  # Banco compartilhado
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-databases.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - database

volumes:
  postgres_data:

networks:
  public:
    driver: bridge
  database:
    driver: bridge
    internal: true
```

### Database per Service
```yaml
version: '3.8'

services:
  user-service:
    build: ./services/user
    environment:
      - DATABASE_URL=postgresql://user:password@user-db:5432/users
    depends_on:
      - user-db

  user-db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: users
    volumes:
      - user_data:/var/lib/postgresql/data

  order-service:
    build: ./services/order
    environment:
      - DATABASE_URL=postgresql://user:password@order-db:5432/orders
    depends_on:
      - order-db

  order-db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: orders
    volumes:
      - order_data:/var/lib/postgresql/data

volumes:
  user_data:
  order_data:
```

### Read/Write Split
```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - DB_WRITE_URL=postgresql://user:password@db-master:5432/myapp
      - DB_READ_URL=postgresql://user:password@db-replica:5432/myapp
    depends_on:
      - db-master
      - db-replica

  db-master:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: replicator_password
    volumes:
      - master_data:/var/lib/postgresql/data
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf

  db-replica:
    image: postgres:15
    environment:
      PGUSER: user
      POSTGRES_PASSWORD: password
      POSTGRES_MASTER_SERVICE: db-master
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: replicator_password
    volumes:
      - replica_data:/var/lib/postgresql/data
    command: |
      bash -c "
      until pg_basebackup --pgdata=/var/lib/postgresql/data --host=db-master --username=replicator --verbose --progress --wal-method=stream --write-recovery-conf
      do
        echo 'Waiting for master to be ready...'
        sleep 1s
      done
      echo 'Backup done, starting replica...'
      postgres
      "
    depends_on:
      - db-master

volumes:
  master_data:
  replica_data:
```

## Monitoramento e Logs

### Centralized Logging
```yaml
version: '3.8'

services:
  app:
    build: .
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    depends_on:
      - db

  db:
    image: postgres:15
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # ELK Stack para logs
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elastic_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elastic_data:
```

### Monitoring Stack
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    labels:
      - "prometheus.scrape=true"
      - "prometheus.port=3000"

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password

  # Monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

  # Database monitoring
  postgres-exporter:
    image: prometheuscommunity/postgres-exporter
    environment:
      DATA_SOURCE_NAME: "postgresql://user:password@db:5432/myapp?sslmode=disable"
    depends_on:
      - db

volumes:
  grafana_data:
```

## Melhores Práticas

### Configuração
```yaml
# ✅ Use environment variables
# ✅ Implemente health checks
# ✅ Configure restart policies
# ✅ Use named volumes para persistência
# ✅ Separe networks por responsabilidade
```

### Segurança
```yaml
# ✅ Não exponha portas desnecessariamente
# ✅ Use secrets para senhas
# ✅ Execute com usuários não-root
# ✅ Mantenha imagens atualizadas
# ✅ Use networks internas para comunicação interna
```

### Performance
```yaml
# ✅ Configure connection pools
# ✅ Use read replicas quando apropriado
# ✅ Implemente cache quando necessário
# ✅ Monitore métricas de banco
# ✅ Configure limits de recursos
```

A integração bem-feita entre Docker e bancos de dados é fundamental para aplicações robustas e escaláveis em produção.
