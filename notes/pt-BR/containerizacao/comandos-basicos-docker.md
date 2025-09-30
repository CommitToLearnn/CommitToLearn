# Comandos Básicos Docker

Uma referência completa dos comandos essenciais do Docker para desenvolvimento e operações diárias.

## Comandos de Imagens

### Baixar e Gerenciar Imagens
```bash
# Baixar imagem do registry
docker pull nginx:latest
docker pull python:3.9-alpine

# Listar imagens locais
docker images
docker image ls

# Buscar imagens no Docker Hub
docker search nginx

# Ver detalhes da imagem
docker image inspect nginx:latest

# Ver histórico de layers
docker image history nginx:latest

# Remover imagem
docker rmi nginx:latest
docker image rm python:3.9

# Remover imagens não utilizadas
docker image prune
docker image prune -a  # Remove todas não utilizadas
```

### Construir Imagens
```bash
# Build com Dockerfile
docker build -t minha-app:v1.0 .

# Build com context remoto
docker build -t app https://github.com/user/repo.git

# Build sem cache
docker build --no-cache -t app .

# Build com argumentos
docker build --build-arg VERSION=1.0 -t app .

# Multi-stage build
docker build --target production -t app:prod .
```

### Salvar e Carregar Imagens
```bash
# Salvar imagem para arquivo
docker save nginx:latest > nginx.tar
docker save -o nginx.tar nginx:latest

# Carregar imagem de arquivo
docker load < nginx.tar
docker load -i nginx.tar

# Exportar container como imagem
docker export container-name > container.tar

# Importar como imagem
docker import container.tar new-image:tag
```

## Comandos de Containers

### Executar Containers
```bash
# Executar container básico
docker run nginx

# Executar em background (detached)
docker run -d nginx

# Executar com nome personalizado
docker run --name meu-nginx nginx

# Executar com porta mapeada
docker run -p 8080:80 nginx

# Executar interativo
docker run -it ubuntu:20.04 /bin/bash

# Executar com variáveis de ambiente
docker run -e NODE_ENV=production node-app

# Executar com volume montado
docker run -v /host/path:/container/path nginx

# Executar e remover após parar
docker run --rm alpine echo "Hello World"
```

### Gerenciar Containers
```bash
# Listar containers executando
docker ps

# Listar todos containers (incluindo parados)
docker ps -a

# Ver apenas IDs dos containers
docker ps -q

# Parar container
docker stop container-name
docker stop container-id

# Parar todos containers
docker stop $(docker ps -q)

# Iniciar container parado
docker start container-name

# Reiniciar container
docker restart container-name

# Pausar/despausar container
docker pause container-name
docker unpause container-name

# Matar container
docker kill container-name
```

### Remover Containers
```bash
# Remover container parado
docker rm container-name

# Forçar remoção de container executando
docker rm -f container-name

# Remover múltiplos containers
docker rm container1 container2 container3

# Remover todos containers parados
docker container prune

# Remover todos containers (cuidado!)
docker rm -f $(docker ps -aq)
```

## Comandos de Interação

### Executar Comandos no Container
```bash
# Executar comando interativo
docker exec -it container-name /bin/bash
docker exec -it container-name /bin/sh

# Executar comando não-interativo
docker exec container-name ls -la

# Executar como usuário específico
docker exec -u root -it container-name /bin/bash

# Executar com variáveis de ambiente
docker exec -e VAR=value container-name env
```

### Ver Logs
```bash
# Ver logs do container
docker logs container-name

# Seguir logs em tempo real
docker logs -f container-name

# Ver logs com timestamp
docker logs -t container-name

# Ver últimas N linhas
docker logs --tail 50 container-name

# Ver logs desde tempo específico
docker logs --since="2023-01-01T00:00:00" container-name
docker logs --since="1h" container-name
```

### Inspecionar e Monitorar
```bash
# Ver detalhes completos do container
docker inspect container-name

# Ver processos no container
docker top container-name

# Ver estatísticas em tempo real
docker stats
docker stats container-name

# Ver mudanças no filesystem
docker diff container-name

# Ver portas mapeadas
docker port container-name
```

## Comandos de Volume

### Gerenciar Volumes
```bash
# Criar volume
docker volume create meu-volume

# Listar volumes
docker volume ls

# Inspecionar volume
docker volume inspect meu-volume

# Remover volume
docker volume rm meu-volume

# Remover volumes não utilizados
docker volume prune

# Usar volume em container
docker run -v meu-volume:/data nginx
```

### Bind Mounts
```bash
# Montar diretório do host
docker run -v /host/path:/container/path nginx

# Mount somente leitura
docker run -v /host/path:/container/path:ro nginx

# Mount com propagação
docker run -v /host/path:/container/path:shared nginx
```

## Comandos de Rede

### Gerenciar Redes
```bash
# Listar redes
docker network ls

# Criar rede
docker network create minha-rede

# Inspecionar rede
docker network inspect minha-rede

# Conectar container à rede
docker network connect minha-rede container-name

# Desconectar container da rede
docker network disconnect minha-rede container-name

# Remover rede
docker network rm minha-rede

# Remover redes não utilizadas
docker network prune
```

## Docker Compose

### Comandos Básicos
```bash
# Iniciar serviços
docker-compose up
docker-compose up -d  # Em background

# Parar serviços
docker-compose down

# Parar serviços e remover volumes
docker-compose down -v

# Ver logs
docker-compose logs
docker-compose logs -f service-name

# Executar comando em serviço
docker-compose exec service-name bash

# Scaling de serviços
docker-compose up --scale web=3

# Rebuild de serviços
docker-compose build
docker-compose up --build
```

### Gerenciamento de Serviços
```bash
# Ver status dos serviços
docker-compose ps

# Parar serviço específico
docker-compose stop service-name

# Reiniciar serviço
docker-compose restart service-name

# Ver configuração resolvida
docker-compose config

# Validar arquivo compose
docker-compose config --quiet
```

## Comandos de Sistema

### Limpeza e Manutenção
```bash
# Limpar tudo não utilizado
docker system prune

# Limpeza agressiva (inclui imagens não utilizadas)
docker system prune -a

# Ver uso de espaço
docker system df

# Ver eventos do Docker
docker system events

# Ver informações do sistema
docker system info
docker info
```

### Backup e Restore
```bash
# Commit de container para imagem
docker commit container-name nova-imagem:tag

# Backup de volume
docker run --rm -v volume-name:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .

# Restore de volume
docker run --rm -v volume-name:/data -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data
```

## Comandos de Registry

### Docker Hub e Registries
```bash
# Login no registry
docker login
docker login registry.example.com

# Push de imagem
docker push username/image:tag

# Tag de imagem
docker tag local-image:tag username/image:tag

# Logout
docker logout

# Pull de registry privado
docker pull registry.example.com/image:tag
```

## Comandos Úteis para Debug

### Troubleshooting
```bash
# Entrar em container que não tem shell
docker run --rm -it --pid container:target-container \
  --net container:target-container \
  --cap-add SYS_PTRACE \
  alpine

# Ver processos de todos containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Container de debug com ferramentas de rede
docker run --rm -it --net container:target nicolaka/netshoot

# Ver logs de container que morreu
docker logs --details container-name

# Copiar arquivos do/para container
docker cp container:/path/file.txt .
docker cp file.txt container:/path/
```

## Aliases Úteis

### Configuração de Aliases
```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias drm='docker rm'
alias drmi='docker rmi'
alias dexec='docker exec -it'
alias dlogs='docker logs -f'
alias dstop='docker stop $(docker ps -q)'
alias dclean='docker system prune -f'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
```

## Dicas de Performance

### Otimização
```bash
# Use .dockerignore para acelerar builds
echo "node_modules" >> .dockerignore
echo ".git" >> .dockerignore

# Multi-stage builds para imagens menores
# Use cache de layers eficientemente
# Ordene comandos do menos para mais propenso a mudanças

# Limpe regularmente
docker system prune -f
docker volume prune -f
docker image prune -f
```
