# Multi-Process Docker: Otimizando Builds com Processos Paralelos

Executar múltiplos processos durante o build do Docker pode acelerar significativamente a criação de imagens, especialmente para aplicações complexas com múltiplas etapas de build.

## Por que Usar Múltiplos Processos?

### Problemas do Build Sequencial
```dockerfile
# ❌ Build sequencial lento
FROM node:18-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci                    # 30s

COPY . .
RUN npm run build            # 60s
RUN npm run test             # 45s
RUN npm run lint             # 15s
# Total: ~150s sequencial
```

### Vantagens do Build Paralelo
```dockerfile
# ✅ Build paralelo otimizado
FROM node:18-slim as base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Processos paralelos
FROM base as builder
COPY . .
RUN npm run build            # 60s

FROM base as tester
COPY . .
RUN npm run test             # 45s

FROM base as linter
COPY . .
RUN npm run lint             # 15s

# Final stage - aproveitando cache paralelo
FROM base
COPY --from=builder /app/dist ./dist
# Total: ~60s (maior processo)
```

## Estratégias de Paralelização

### Multi-Stage Builds Paralelos

```dockerfile
FROM node:18-slim as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Branch 1: Build da aplicação
FROM dependencies as app-builder
COPY src/ ./src/
COPY webpack.config.js ./
RUN npm run build:app &
RUN npm run build:worker &
wait

# Branch 2: Build dos testes
FROM dependencies as test-builder  
COPY src/ ./src/
COPY tests/ ./tests/
RUN npm run test:unit &
RUN npm run test:integration &
wait

# Branch 3: Assets estáticos
FROM dependencies as asset-builder
COPY assets/ ./assets/
RUN npm run optimize:images &
RUN npm run compile:sass &
RUN npm run minify:js &
wait

# Combine results
FROM nginx:alpine
COPY --from=app-builder /app/dist/app ./app/
COPY --from=app-builder /app/dist/worker ./worker/
COPY --from=asset-builder /app/dist/assets ./assets/
```

### Background Processes no Build

```dockerfile
FROM ubuntu:22.04

# Instalar dependências em paralelo
RUN apt-get update && \
    # Processo 1: Linguagens de programação
    (apt-get install -y python3 python3-pip &) && \
    # Processo 2: Ferramentas de build
    (apt-get install -y build-essential git &) && \
    # Processo 3: Dependências do sistema
    (apt-get install -y curl wget nginx &) && \
    # Aguardar todos os processos
    wait && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar e processar arquivos em paralelo
COPY package.json requirements.txt ./
RUN (npm install &) && \
    (pip install -r requirements.txt &) && \
    wait
```

### Builds Condicionais com Make

```dockerfile
FROM node:18-slim
WORKDIR /app

# Instalar make para coordenação
RUN apt-get update && apt-get install -y make

COPY Makefile package*.json ./
COPY . .

# Makefile com targets paralelos
RUN make -j$(nproc) build-parallel

# Makefile content:
# .PHONY: build-parallel frontend backend tests
# 
# build-parallel: frontend backend tests
# 
# frontend:
# 	npm run build:frontend
# 
# backend:
# 	npm run build:backend
# 
# tests:
# 	npm run test
```

## Aplicações Práticas

### Frontend Complexo
```dockerfile
FROM node:18-slim as base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build em paralelo de diferentes targets
FROM base as frontend-builder
COPY src/ ./src/
COPY public/ ./public/
# Webpack build paralelo
RUN npm run build:main &
RUN npm run build:admin &
RUN npm run build:mobile &
wait

FROM base as asset-optimizer
COPY assets/ ./assets/
# Otimização paralela de assets
RUN npm run optimize:images &
RUN npm run optimize:fonts &
RUN npm run generate:sprites &
wait

FROM base as test-runner
COPY src/ ./src/
COPY tests/ ./tests/
# Testes paralelos
RUN npm run test:unit &
RUN npm run test:e2e &
RUN npm run test:visual &
wait

# Combinar resultados
FROM nginx:alpine
COPY --from=frontend-builder /app/dist/main ./main/
COPY --from=frontend-builder /app/dist/admin ./admin/
COPY --from=frontend-builder /app/dist/mobile ./mobile/
COPY --from=asset-optimizer /app/dist/assets ./assets/
```

### Backend com Microserviços
```dockerfile
FROM golang:1.21-alpine as base
WORKDIR /app

# Build múltiplos serviços em paralelo
FROM base as user-service
COPY go.mod go.sum ./
RUN go mod download
COPY cmd/user-service/ ./cmd/user-service/
COPY internal/ ./internal/
RUN CGO_ENABLED=0 go build -o user-service ./cmd/user-service &

FROM base as order-service  
COPY go.mod go.sum ./
RUN go mod download
COPY cmd/order-service/ ./cmd/order-service/
COPY internal/ ./internal/
RUN CGO_ENABLED=0 go build -o order-service ./cmd/order-service &

FROM base as payment-service
COPY go.mod go.sum ./
RUN go mod download  
COPY cmd/payment-service/ ./cmd/payment-service/
COPY internal/ ./internal/
RUN CGO_ENABLED=0 go build -o payment-service ./cmd/payment-service &

# Runtime com múltiplos binários
FROM alpine:3.18
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=user-service /app/user-service ./
COPY --from=order-service /app/order-service ./
COPY --from=payment-service /app/payment-service ./

# Supervisor para gerenciar múltiplos processos
COPY supervisor.conf /etc/supervisor/conf.d/
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]
```

## Coordenação com Scripts

### Script de Build Paralelo
```dockerfile
FROM node:18-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY build-parallel.sh ./
RUN chmod +x build-parallel.sh && ./build-parallel.sh
```

```bash
#!/bin/bash
# build-parallel.sh

set -e

echo "Starting parallel build processes..."

# Array para armazenar PIDs dos processos
pids=()

# Função para cleanup em caso de erro
cleanup() {
    echo "Cleaning up processes..."
    for pid in "${pids[@]}"; do
        kill $pid 2>/dev/null || true
    done
    exit 1
}

trap cleanup SIGINT SIGTERM

# Processo 1: Build frontend
echo "Starting frontend build..."
npm run build:frontend &
pids+=($!)

# Processo 2: Build backend
echo "Starting backend build..."
npm run build:backend &
pids+=($!)

# Processo 3: Run tests
echo "Starting tests..."
npm run test &
pids+=($!)

# Processo 4: Lint code
echo "Starting linting..."
npm run lint &
pids+=($!)

# Aguardar todos os processos
echo "Waiting for all processes to complete..."
for pid in "${pids[@]}"; do
    if ! wait $pid; then
        echo "Process $pid failed"
        cleanup
    fi
done

echo "All builds completed successfully!"
```

### Coordenação com GNU Parallel
```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y parallel

WORKDIR /app
COPY . .

# Lista de comandos para executar em paralelo
RUN echo "npm run build:frontend" > commands.txt && \
    echo "npm run build:backend" >> commands.txt && \
    echo "npm run test" >> commands.txt && \
    echo "npm run lint" >> commands.txt

# Executar em paralelo com controle de jobs
RUN parallel -j 4 < commands.txt
```

## Otimizações de Performance

### Cache Inteligente
```dockerfile
FROM node:18-slim as base
WORKDIR /app

# Cache de dependências (raramente muda)
COPY package*.json ./
RUN npm ci

# Cache de builds paralelos
FROM base as cached-frontend
COPY src/frontend/ ./src/frontend/
RUN npm run build:frontend

FROM base as cached-backend  
COPY src/backend/ ./src/backend/
RUN npm run build:backend

# Build final aproveitando caches
FROM base
COPY --from=cached-frontend /app/dist/frontend ./dist/frontend/
COPY --from=cached-backend /app/dist/backend ./dist/backend/
```

### Resource Management
```dockerfile
FROM node:18-slim
WORKDIR /app

# Controlar uso de CPU e memória
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV UV_THREADPOOL_SIZE=8

COPY package*.json ./
RUN npm ci

COPY . .

# Build com limitação de recursos
RUN npm run build:frontend -- --max-workers=2 &
RUN npm run build:backend -- --max-workers=2 &
wait
```

## Monitoramento de Builds

### Logging Paralelo
```dockerfile
FROM node:18-slim
WORKDIR /app

COPY . .
COPY parallel-build.sh ./
RUN chmod +x parallel-build.sh && ./parallel-build.sh
```

```bash
#!/bin/bash
# parallel-build.sh com logging

mkdir -p logs

# Função para executar com log
run_with_log() {
    local name=$1
    local command=$2
    local logfile="logs/${name}.log"
    
    echo "Starting $name..." | tee -a "$logfile"
    start_time=$(date +%s)
    
    if eval "$command" >> "$logfile" 2>&1; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "$name completed in ${duration}s" | tee -a "$logfile"
        return 0
    else
        echo "$name failed!" | tee -a "$logfile"
        return 1
    fi
}

# Executar em paralelo com logs
run_with_log "frontend" "npm run build:frontend" &
pid1=$!

run_with_log "backend" "npm run build:backend" &
pid2=$!

run_with_log "tests" "npm run test" &
pid3=$!

# Aguardar e verificar resultados
wait $pid1 && echo "Frontend: ✅" || echo "Frontend: ❌"
wait $pid2 && echo "Backend: ✅" || echo "Backend: ❌"  
wait $pid3 && echo "Tests: ✅" || echo "Tests: ❌"

# Mostrar resumo dos logs
echo "Build Summary:"
cat logs/*.log | grep "completed in\|failed"
```

## Troubleshooting

### Problemas Comuns
```dockerfile
# ❌ Problema: Dependências compartilhadas conflitantes
FROM node:18-slim
COPY . .
RUN npm run build:frontend &  # Modifica node_modules
RUN npm run build:backend &   # Conflito!
wait

# ✅ Solução: Separar contextos
FROM node:18-slim as base
COPY package*.json ./
RUN npm ci

FROM base as frontend
COPY src/frontend ./src/frontend/
RUN npm run build:frontend

FROM base as backend
COPY src/backend ./src/backend/
RUN npm run build:backend
```

### Memory Management
```dockerfile
# Controlar uso de memória em builds paralelos
FROM node:18-slim
WORKDIR /app

# Limitar memory por processo
ENV NODE_OPTIONS="--max_old_space_size=2048"

COPY . .

# Executar com limitação de recursos
RUN (NODE_OPTIONS="--max_old_space_size=1024" npm run build:frontend &) && \
    (NODE_OPTIONS="--max_old_space_size=1024" npm run build:backend &) && \
    wait
```

### Debugging de Processos Paralelos
```bash
#!/bin/bash
# debug-parallel.sh

set -x  # Enable debug mode

# Mostrar recursos antes do build
echo "Available CPUs: $(nproc)"
echo "Available Memory: $(free -h)"

# Monitorar processos durante build
(
    while true; do
        ps aux | grep -E "(npm|node)" | grep -v grep
        sleep 5
    done
) &
monitor_pid=$!

# Executar builds
npm run build:all

# Parar monitoring
kill $monitor_pid 2>/dev/null || true
```

## Melhores Práticas

### Design para Paralelismo
```dockerfile
# ✅ Separar responsabilidades
# ✅ Minimizar dependências compartilhadas
# ✅ Usar multi-stage builds
# ✅ Cache de layers eficiente
```

### Gerenciamento de Recursos
```dockerfile
# ✅ Limitar número de processos paralelos
# ✅ Monitorar uso de CPU/memória
# ✅ Cleanup adequado de processos
```

### Error Handling
```dockerfile
# ✅ Tratar falhas de processos individuais
# ✅ Logs detalhados para debugging
# ✅ Rollback em caso de erro
```

O uso inteligente de múltiplos processos pode reduzir drasticamente o tempo de build, mas requer planejamento cuidadoso para evitar problemas de concorrência e uso excessivo de recursos.
