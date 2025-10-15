# Comandos Essenciais do Docker: Um Guia Prático

Uma referência completa dos comandos essenciais do Docker para o dia a dia de desenvolvimento e operações.

Pense no Docker como uma oficina de LEGOs:
- **Imagens (`docker pull`, `docker build`):** Os manuais de instrução para construir um modelo.
- **Contêineres (`docker run`, `docker stop`):** Os modelos já montados e em funcionamento.
- **Volumes (`docker volume create`):** Peças especiais que você guarda em caixas separadas para não perder.
- **Redes (`docker network create`):** A cidade onde seus modelos se conectam.

## Gerenciamento de Imagens

Comandos para baixar, listar, construir e gerenciar imagens Docker.

| Comando | Descrição |
| :--- | :--- |
| `docker pull <imagem>` | Baixa uma imagem de um registry (ex: Docker Hub). |
| `docker images` ou `docker image ls` | Lista todas as imagens locais. |
| `docker build -t <nome>:<tag> .` | Constrói uma imagem a partir de um Dockerfile. |
| `docker rmi <imagem>` | Remove uma imagem local. |
| `docker image prune` | Remove imagens não utilizadas (dangling). |
| `docker image prune -a` | Remove todas as imagens não utilizadas. |
| `docker history <imagem>` | Mostra as camadas (layers) da imagem. |
| `docker save <imagem> > arquivo.tar` | Salva uma imagem em um arquivo .tar. |
| `docker load < arquivo.tar` | Carrega uma imagem de um arquivo .tar. |

**Exemplo de Build:**
```bash
# Constrói a imagem 'minha-app' com a tag 'v1' a partir do Dockerfile no diretório atual
docker build -t minha-app:v1 .
```

## Gerenciamento de Contêineres

Comandos para executar, parar, inspecionar e remover contêineres.

| Comando | Descrição |
| :--- | :--- |
| `docker run <imagem>` | Cria e inicia um novo contêiner a partir de uma imagem. |
| `docker ps` | Lista os contêineres em execução. |
| `docker ps -a` | Lista todos os contêineres (em execução e parados). |
| `docker stop <container>` | Para um contêiner em execução. |
| `docker start <container>` | Inicia um contêiner parado. |
| `docker restart <container>` | Reinicia um contêiner. |
| `docker rm <container>` | Remove um contêiner parado. |
| `docker container prune` | Remove todos os contêineres parados. |
| `docker logs <container>` | Exibe os logs de um contêiner. |
| `docker exec -it <container> <comando>` | Executa um comando dentro de um contêiner em execução. |

**Exemplo de Execução:**
```bash
# Executa um contêiner Nginx em background, mapeando a porta 8080 do host para a 80 do contêiner
docker run -d --name meu-webserver -p 8080:80 nginx
```

**Exemplo de Acesso Interativo:**
```bash
# Acessa o terminal de um contêiner Ubuntu
docker exec -it meu-ubuntu-container /bin/bash
```

## Gerenciamento de Redes

Comandos para criar e gerenciar as redes que conectam os contêineres.

| Comando | Descrição |
| :--- | :--- |
| `docker network ls` | Lista as redes disponíveis. |
| `docker network create <nome>` | Cria uma nova rede (bridge por padrão). |
| `docker network rm <nome>` | Remove uma rede. |
| `docker network inspect <nome>` | Exibe detalhes sobre uma rede. |
| `docker network connect <rede> <container>` | Conecta um contêiner a uma rede. |
| `docker network disconnect <rede> <container>` | Desconecta um contêiner de uma rede. |

**Exemplo de Uso:**
```bash
# Cria uma rede para a aplicação
docker network create minha-app-net

# Inicia o banco de dados na rede
docker run -d --name db --network minha-app-net postgres

# Inicia a aplicação na mesma rede para que possam se comunicar pelo nome
docker run -d --name api --network minha-app-net minha-api-imagem
```

## Gerenciamento de Volumes

Comandos para gerenciar a persistência de dados.

| Comando | Descrição |
| :--- | :--- |
| `docker volume create <nome>` | Cria um volume nomeado. |
| `docker volume ls` | Lista os volumes. |
| `docker volume inspect <nome>` | Mostra detalhes de um volume. |
| `docker volume rm <nome>` | Remove um volume. |
| `docker volume prune` | Remove todos os volumes não utilizados. |

**Exemplo de Uso com Volume Nomeado (Recomendado):**
```bash
# Cria um volume para persistir os dados do PostgreSQL
docker volume create dados-postgres

# Inicia o contêiner montando o volume
docker run -d -v dados-postgres:/var/lib/postgresql/data postgres
```

**Exemplo com Bind Mount (Desenvolvimento):**
```bash
# Mapeia um diretório local para dentro do contêiner
docker run -d -v /caminho/no/host:/app minha-app
```

## Comandos do Docker Compose

Ferramenta para definir e gerenciar aplicações multi-contêiner.

| Comando | Descrição |
| :--- | :--- |
| `docker-compose up` | Cria e inicia os serviços definidos no `docker-compose.yml`. |
| `docker-compose up -d` | Inicia os serviços em background. |
| `docker-compose down` | Para e remove os contêineres, redes e volumes. |
| `docker-compose ps` | Lista os contêineres dos serviços. |
| `docker-compose logs -f` | Exibe e acompanha os logs de todos os serviços. |
| `docker-compose build` | Constrói (ou reconstrói) as imagens dos serviços. |
| `docker-compose exec <serviço> <comando>` | Executa um comando em um serviço. |

**Exemplo de `docker-compose.yml`:**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
```