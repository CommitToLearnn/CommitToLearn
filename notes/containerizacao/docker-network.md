# Docker Network

As redes Docker permitem que containers se comuniquem entre si e com o mundo externo de forma controlada e isolada.

## Conceito Básico
- Isolamento de rede entre containers
- Comunicação controlada entre serviços
- Bridge entre container e host
- DNS automático entre containers

## Tipos de Redes Docker

### 1. Bridge Network (Padrão)
```bash
# Rede padrão para containers
docker network ls
# NETWORK ID     NAME      DRIVER    SCOPE
# 7b8b9f0c1234   bridge    bridge    local

# Containers na mesma bridge podem se comunicar
docker run -d --name web nginx
docker run -d --name app python:3.9
```

### 2. Host Network
```bash
# Container usa rede do host diretamente
docker run --network host nginx

# Sem isolamento de rede
# Container acessa todas interfaces do host
```

### 3. None Network
```bash
# Container sem rede
docker run --network none alpine

# Apenas interface loopback
# Isolamento completo de rede
```

### 4. Custom Bridge Networks
```bash
# Criar rede personalizada
docker network create --driver bridge minha-rede

# Definir subnet customizada
docker network create \
  --driver bridge \
  --subnet=172.20.0.0/16 \
  --ip-range=172.20.240.0/20 \
  rede-personalizada
```

### 5. Overlay Network (Swarm)
```bash
# Para múltiplos hosts Docker
docker network create \
  --driver overlay \
  --attachable \
  rede-overlay

# Comunicação entre containers em diferentes hosts
```

## Comandos de Rede

### Gerenciamento de Redes
```bash
# Listar redes
docker network ls

# Inspecionar rede
docker network inspect bridge

# Criar rede
docker network create minha-rede

# Remover rede
docker network rm minha-rede

# Limpar redes não utilizadas
docker network prune
```

### Conectar Containers
```bash
# Executar container em rede específica
docker run --network minha-rede --name web nginx

# Conectar container existente à rede
docker network connect minha-rede container-existente

# Desconectar container da rede
docker network disconnect minha-rede container-existente

# Container em múltiplas redes
docker network connect rede2 meu-container
```

### Comunicação Entre Containers
```bash
# Containers na mesma rede custom podem usar nomes
docker network create app-network

docker run -d --network app-network --name database postgres
docker run -d --network app-network --name backend node-app

# Backend pode acessar: http://database:5432
# DNS automático resolve nomes dos containers
```

## Port Mapping e Exposição

### Port Publishing
```bash
# Mapear porta host:container
docker run -p 8080:80 nginx

# Mapear para interface específica
docker run -p 127.0.0.1:8080:80 nginx

# Mapear múltiplas portas
docker run -p 8080:80 -p 8443:443 nginx

# Porta aleatória no host
docker run -P nginx
```

### Expose vs Publish
```dockerfile
# Dockerfile - apenas documenta a porta
EXPOSE 80

# Runtime - realmente mapeia a porta
docker run -p 8080:80 nginx
```

## Configuração Avançada

### DNS Customizado
```bash
# DNS servers customizados
docker run --dns 8.8.8.8 --dns 8.8.4.4 nginx

# Arquivo hosts customizado
docker run --add-host database:192.168.1.100 nginx

# Hostname customizado
docker run --hostname meu-servidor nginx
```

### Network Aliases
```bash
# Múltiplos nomes para o mesmo container
docker run --network minha-rede \
  --network-alias web \
  --network-alias frontend \
  nginx

# Acessível por: web, frontend, ou nome do container
```

## Docker Compose Networks

### Rede Automática
```yaml
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  
  app:
    image: node:18
    # Pode acessar 'web' por nome
    environment:
      - API_URL=http://web:80
```

### Redes Customizadas
```yaml
version: '3.8'
services:
  frontend:
    image: nginx
    networks:
      - frontend-network
  
  backend:
    image: node:18
    networks:
      - frontend-network
      - backend-network
  
  database:
    image: postgres
    networks:
      - backend-network

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
    internal: true  # Sem acesso externo
```

### Rede Externa
```yaml
networks:
  existing-network:
    external: true
    name: my-pre-existing-network
```

## Troubleshooting de Rede

### Diagnóstico
```bash
# Inspecionar conectividade
docker exec -it container ping outro-container

# Ver interfaces de rede
docker exec -it container ip addr show

# Testar DNS
docker exec -it container nslookup outro-container

# Ver portas em uso
docker exec -it container netstat -tulpn

# Testar conectividade externa
docker exec -it container curl -I http://google.com
```

### Debug de Containers
```bash
# Usar container para debug de rede
docker run --rm --network container:target-container nicolaka/netshoot

# Ferramentas de rede disponíveis:
# ping, curl, dig, nslookup, traceroute, tcpdump, etc.
```

## Casos de Uso Práticos

### 1. Aplicação Multi-tier
```bash
# Criar rede para aplicação
docker network create app-tier

# Database
docker run -d \
  --network app-tier \
  --name postgres-db \
  -e POSTGRES_PASSWORD=secret \
  postgres:13

# Backend API
docker run -d \
  --network app-tier \
  --name api-server \
  -e DATABASE_URL=postgres://postgres:secret@postgres-db:5432/app \
  my-api:latest

# Frontend
docker run -d \
  --network app-tier \
  --name frontend \
  -p 80:80 \
  -e API_URL=http://api-server:3000 \
  my-frontend:latest
```

### 2. Microsserviços com Proxy Reverso
```yaml
version: '3.8'
services:
  nginx:
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - frontend

  user-service:
    image: user-service:latest
    networks:
      - frontend
      - backend

  order-service:
    image: order-service:latest
    networks:
      - frontend
      - backend

  database:
    image: postgres
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true
```

## Segurança de Rede
- Usar redes customizadas ao invés da bridge padrão
- Principle of least privilege - apenas conexões necessárias
- Redes internas para serviços que não precisam de acesso externo
- Firewall rules no host quando necessário
- Network policies em ambientes orchestrados
