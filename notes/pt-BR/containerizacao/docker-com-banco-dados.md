# Docker com Banco de Dados: Guia Prático

Conectar aplicações a bancos de dados é um passo essencial em ambientes Docker. Este guia mostra como fazer isso de forma robusta e segura.

Pense no `docker-compose` como o projeto de uma casa:
- **Aplicação (`app`):** A casa em si.
- **Banco de Dados (`db`):** A fundação.
- **Rede (`network`):** O sistema elétrico e hidráulico que conecta tudo.
- **Volumes (`volumes`):** O cofre onde você guarda seus bens preciosos (dados), que sobrevive mesmo se a casa for reconstruída.

A casa (`app`) precisa que a fundação (`db`) esteja pronta antes de ser construída sobre ela (`depends_on`).

## O que é e por que usar?

Integrar um banco de dados com sua aplicação em Docker permite:
- **Ambientes de desenvolvimento consistentes:** Todos os desenvolvedores usam a mesma versão do banco de dados.
- **Isolamento:** A aplicação e o banco rodam em seus próprios contêineres, evitando conflitos.
- **Portabilidade:** A aplicação inteira (código + banco) pode ser movida facilmente entre diferentes máquinas.
- **Persistência de dados:** Usando volumes, os dados sobrevivem mesmo que o contêiner do banco seja recriado.

## Padrão Essencial: `docker-compose.yml`

O `docker-compose` é a ferramenta ideal para orquestrar a aplicação e o banco de dados.

**Exemplo com Node.js e PostgreSQL:**
```yaml
version: '3.8'

services:
  # Serviço da Aplicação
  app:
    build: . # Constrói a imagem a partir do Dockerfile local
    ports:
      - "3000:3000" # Mapeia a porta 3000 do host para a 3000 do contêiner
    environment:
      # Variáveis de ambiente para conectar ao banco
      - DB_HOST=db
      - DB_USER=user
      - DB_PASSWORD=secret
      - DB_NAME=myapp
    networks:
      - app-net # Conecta à rede da aplicação
    depends_on:
      db:
        condition: service_healthy # Espera o banco estar saudável para iniciar

  # Serviço do Banco de Dados
  db:
    image: postgres:15-alpine # Usa uma imagem oficial e leve do PostgreSQL
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data # Persiste os dados do banco
    networks:
      - app-net
    healthcheck:
      # Verifica se o banco está pronto para aceitar conexões
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

# Define a rede customizada
networks:
  app-net:
    driver: bridge

# Define o volume nomeado para persistência
volumes:
  postgres-data:
```

## Conexão na Aplicação

O código da sua aplicação deve ler as credenciais do banco a partir das variáveis de ambiente.

**Exemplo em Node.js (com `pg`):**
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,       // 'db' (nome do serviço no docker-compose)
  user: process.env.DB_USER,       // 'user'
  password: process.env.DB_PASSWORD, // 'secret'
  database: process.env.DB_NAME,     // 'myapp'
  port: 5432,
});

// A aplicação agora pode usar 'pool' para fazer queries.
```

## Armadilhas Comuns e Soluções

1.  **A Aplicação Inicia Antes do Banco:**
    - **Armadilha:** O contêiner da aplicação sobe, tenta conectar ao banco, mas ele ainda não está pronto. A aplicação falha.
    - **Solução:** Use `depends_on` com `condition: service_healthy` no `docker-compose.yml`. Isso faz com que o Docker espere o `healthcheck` do banco passar antes de iniciar a aplicação.

2.  **Perda de Dados ao Recriar o Contêiner:**
    - **Armadilha:** Sem um volume, todos os dados do banco são perdidos quando o contêiner é removido (`docker-compose down`).
    - **Solução:** Sempre use **volumes nomeados** (`volumes: - postgres-data:/var/lib/postgresql/data`). Eles são gerenciados pelo Docker e persistem independentemente do ciclo de vida do contêiner.

3.  **Hardcoding de Credenciais:**
    - **Armadilha:** Colocar `localhost` ou senhas diretamente no código.
    - **Solução:** Use variáveis de ambiente (`process.env.DB_HOST`) e passe os valores através do `docker-compose.yml`. O nome do host para o banco de dados é o **nome do serviço** (ex: `db`).

## Boas Práticas

1.  **Use Redes Customizadas:** Crie uma rede `bridge` para sua aplicação (`networks: app-net`). Isso fornece melhor isolamento e permite que os contêineres se comuniquem usando seus nomes de serviço como DNS.
2.  **Prefira Volumes Nomeados a Bind Mounts:** Volumes nomeados são mais portáteis e performáticos. Use bind mounts (mapear um diretório local) apenas para desenvolvimento (ex: live-reloading de código).
3.  **Implemente Health Checks:** Defina um `healthcheck` para o seu contêiner de banco de dados. Isso dá ao Docker uma forma de saber quando o banco está realmente pronto.
4.  **Não Exponha a Porta do Banco em Produção:** No `docker-compose.yml`, remova a seção `ports` do serviço `db` em ambientes de produção. A aplicação se conecta ao banco através da rede interna do Docker, não precisando de exposição externa.

## Resumo Rápido

- **Orquestre com `docker-compose.yml`:** Defina seus serviços `app` e `db`.
- **Conecte com Nomes de Serviço:** Sua aplicação se conecta ao host `db`, não a `localhost`.
- **Persista com Volumes Nomeados:** Use `volumes` para não perder dados.
- **Controle a Inicialização com `depends_on` e `healthcheck`:** Garanta que o banco esteja pronto antes da aplicação.
- **Isole com Redes Customizadas:** Crie uma rede `bridge` para seus serviços.
