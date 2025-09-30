# Docker

Docker é uma plataforma de containerização que permite empacotar aplicações e suas dependências em containers leves e portáveis.

## Conceito Básico
- Containerização de aplicações
- Isolamento usando namespaces e cgroups do Linux
- Portabilidade entre ambientes
- Eficiência de recursos comparado a VMs

## Arquitetura do Docker

### Componentes Principais
- **Docker Engine**: Runtime de containers
- **Docker Images**: Templates para containers
- **Docker Containers**: Instâncias em execução
- **Docker Registry**: Repositório de imagens
- **Dockerfile**: Script para criar imagens

### Docker Architecture
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│ Docker Host │───▶│  Registry   │
│  (docker)   │    │   Daemon    │    │ (Docker Hub)│
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                    ┌─────────────┐
                    │ Containers  │
                    │   Images    │
                    └─────────────┘
```

## Comandos Básicos

### Imagens
```bash
# Baixar imagem
docker pull nginx:latest

# Listar imagens
docker images

# Construir imagem
docker build -t minha-app .

# Remover imagem
docker rmi nginx:latest

# Histórico da imagem
docker history nginx
```

### Containers
```bash
# Executar container
docker run -d -p 80:80 nginx

# Listar containers
docker ps -a

# Parar container
docker stop <container_id>

# Iniciar container
docker start <container_id>

# Executar comando no container
docker exec -it <container_id> /bin/bash

# Ver logs
docker logs <container_id>

# Remover container
docker rm <container_id>
```

### Networks
```bash
# Listar redes
docker network ls

# Criar rede
docker network create minha-rede

# Conectar container à rede
docker network connect minha-rede <container>

# Inspecionar rede
docker network inspect minha-rede
```

### Volumes
```bash
# Criar volume
docker volume create meu-volume

# Listar volumes
docker volume ls

# Montar volume
docker run -v meu-volume:/data nginx

# Bind mount
docker run -v /host/path:/container/path nginx

# Inspecionar volume
docker volume inspect meu-volume
```

## Dockerfile

### Estrutura Básica
```dockerfile
# Imagem base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Definir usuário não-root
USER node

# Comando padrão
CMD ["npm", "start"]
```

### Instruções Importantes
```dockerfile
# FROM - Imagem base
FROM ubuntu:20.04

# RUN - Executar comando durante build
RUN apt-get update && apt-get install -y python3

# COPY - Copiar arquivos do host
COPY app.py /opt/

# ADD - Similar ao COPY, mas com recursos extras
ADD https://example.com/file.tar.gz /opt/

# ENV - Variáveis de ambiente
ENV NODE_ENV=production

# ARG - Argumentos de build
ARG BUILD_VERSION=1.0

# LABEL - Metadados
LABEL maintainer="email@example.com"

# VOLUME - Pontos de montagem
VOLUME ["/data"]

# USER - Usuário para execução
USER 1001

# HEALTHCHECK - Verificação de saúde
HEALTHCHECK --interval=30s CMD curl -f http://localhost/ || exit 1
```

## Docker Compose

### docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./app:/app
    networks:
      - app-network

  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

### Comandos Compose
```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Scaling
docker-compose up --scale web=3

# Rebuild
docker-compose build --no-cache
```

## Boas Práticas

### Segurança
```dockerfile
# Usar imagens oficiais
FROM node:18-alpine

# Não executar como root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Minimizar superficie de ataque
RUN rm -rf /var/cache/apk/*

# Multi-stage build para reduzir tamanho
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS runtime
COPY --from=builder /app/node_modules ./node_modules
```

### Performance
```bash
# Usar .dockerignore
node_modules
.git
.DS_Store
*.log

# Layer caching
COPY package*.json ./
RUN npm ci
COPY . .
```

### Otimização de Imagem
```dockerfile
# Alpine para imagens menores
FROM alpine:3.18

# Multi-stage builds
FROM golang:1.20 AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

FROM alpine:3.18
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main .
CMD ["./main"]
```

## Troubleshooting

### Debug de Containers
```bash
# Inspecionar container
docker inspect <container>

# Estatísticas em tempo real
docker stats

# Processos no container
docker top <container>

# Diferenças no filesystem
docker diff <container>

# Entrar no namespace do container
docker exec -it <container> /bin/bash
```

### Logs e Monitoring
```bash
# Logs com timestamp
docker logs -t <container>

# Seguir logs em tempo real
docker logs -f <container>

# Logs com filtro
docker logs --since="2023-01-01" <container>

# Exportar logs
docker logs <container> > container.log 2>&1
```

## Casos de Uso
- **Desenvolvimento**: Ambientes consistentes
- **Testing**: Isolamento de testes
- **CI/CD**: Build e deploy automatizados
- **Microservices**: Isolamento de serviços
- **Migration**: Portabilidade entre ambientes
- **Scaling**: Horizontal scaling fácil
