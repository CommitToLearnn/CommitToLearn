# Redes Docker: Conectando Contêineres

Imagine que cada contêiner Docker é um apartamento em um grande prédio. As redes Docker são como os sistemas de interfone e as chaves de acesso desse prédio. 

- A **rede `bridge` padrão** é como um interfone geral onde todos os apartamentos (contêineres) estão conectados, mas a comunicação não é muito organizada.
- Uma **rede `bridge` customizada** é como criar um sistema de interfone privado apenas para os apartamentos de um mesmo andar (sua aplicação), permitindo que eles se falem facilmente usando o número do apartamento (o nome do contêiner).
- A **rede `host`** é como dar ao seu apartamento a chave mestra do prédio inteiro, eliminando o isolamento e permitindo acesso total à infraestrutura do host.
- **Mapear uma porta (`-p`)** é como instalar uma campainha na porta do seu apartamento que se conecta à portaria do prédio, permitindo que visitantes de fora (o mundo externo) consigam chamar você.

### O que são e por que usar?

Redes Docker são um mecanismo que permite que contêineres se comuniquem entre si e com o mundo externo de forma isolada e organizada. Elas são essenciais para construir aplicações compostas por múltiplos serviços (como um backend, um frontend e um banco de dados).

**Principais Benefícios:**

- **Isolamento:** Contêineres em redes diferentes não podem se comunicar, a menos que seja explicitamente permitido, aumentando a segurança.
- **Descoberta de Serviço (DNS):** Em redes customizadas, os contêineres podem se encontrar e comunicar usando seus nomes, graças a um servidor DNS embutido no Docker.
- **Organização:** Permite segmentar a comunicação, criando redes separadas para o frontend e o backend, por exemplo.
- **Flexibilidade:** Suporta diferentes drivers de rede para cenários variados, desde uma única máquina até um cluster de servidores (Swarm).

### Tipos de Rede Docker

| Tipo de Rede | Descrição | Caso de Uso Comum |
| :--- | :--- | :--- |
| **`bridge` (customizada)** | **(Recomendado)** Cria uma rede privada e isolada para um grupo de contêineres. Oferece resolução de DNS por nome. | Aplicações multi-contêiner (ex: API + Banco de Dados). |
| **`bridge` (padrão)** | A rede onde os contêineres são iniciados por padrão se nenhuma outra for especificada. Não possui DNS por nome. | Desenvolvimento rápido e testes simples. |
| **`host`** | Remove o isolamento de rede. O contêiner compartilha a interface de rede do host. | Quando a performance de rede é crítica e o isolamento não é necessário. |
| **`overlay`** | Permite a comunicação entre contêineres que estão rodando em diferentes hosts Docker (usado com Docker Swarm). | Ambientes clusterizados e orquestração. |
| **`none`** | Desabilita completamente a rede para um contêiner, deixando-o totalmente isolado. | Para tarefas que não precisam de nenhuma comunicação de rede. |

### Exemplos Práticos

#### Cenário 1: Aplicação Web com Banco de Dados

Vamos criar uma rede para que um contêiner de aplicação Node.js possa se comunicar com um banco de dados PostgreSQL.

```bash
# 1. Crie uma rede bridge customizada
docker network create minha-app-net

# 2. Inicie o banco de dados nesta rede
docker run -d \
  --network minha-app-net \
  --name banco-de-dados \
  -e POSTGRES_PASSWORD=senha_secreta \
  postgres

# 3. Inicie a aplicação, conectando-a ao banco pelo nome
docker run -d \
  --network minha-app-net \
  --name minha-app \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://postgres:senha_secreta@banco-de-dados:5432/postgres \
  minha-imagem-node
```
- A aplicação (`minha-app`) consegue encontrar o contêiner `banco-de-dados` usando seu nome como endereço.
- A porta `3000` da aplicação é exposta para o host, mas a porta `5432` do banco de dados fica acessível apenas dentro da rede `minha-app-net`.

#### Cenário 2: Usando Docker Compose

O Docker Compose simplifica tudo isso, gerenciando as redes automaticamente.

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: minha-imagem-node
    ports:
      - "3000:3000"
    environment:
      # A comunicação ocorre pelo nome do serviço ('db')
      - DATABASE_URL=postgres://postgres:senha_secreta@db:5432/postgres
    depends_on:
      - db

  db:
    image: postgres
    environment:
      - POSTGRES_PASSWORD=senha_secreta

# Por padrão, o Compose cria uma rede 'bridge' e conecta ambos os serviços a ela.
```

### Armadilhas Comuns

1.  **Usar a Rede `bridge` Padrão:** A rede padrão não oferece resolução de DNS por nome de contêiner. Sempre crie redes customizadas para suas aplicações para habilitar essa funcionalidade e garantir melhor isolamento.
2.  **Confundir `EXPOSE` com `-p` (publish):**
    - `EXPOSE` no Dockerfile é apenas uma documentação, informando qual porta o contêiner pretende usar.
    - `-p host:container` é o comando que efetivamente mapeia uma porta do host para uma porta do contêiner, permitindo o acesso externo.
3.  **Problemas de Conectividade:** Se um contêiner não consegue se conectar a outro, use `docker network inspect <nome_da_rede>` para verificar se ambos estão na mesma rede. Use `docker exec <container> ping <outro_container>` para testar a comunicação.

### Boas Práticas

- **Prefira Redes Customizadas:** Sempre crie uma rede `bridge` customizada para cada aplicação.
- **Segmente suas Redes:** Em arquiteturas complexas, crie redes separadas para diferentes camadas (ex: `frontend-net` e `backend-net`).
- **Use `internal: true`:** Para redes que não precisam de acesso externo (como a que conecta sua API ao banco de dados), use a opção `internal: true` no Docker Compose para aumentar a segurança.
- **Nomes Descritivos:** Dê nomes claros às suas redes para facilitar o gerenciamento e o debug.


### Resumo Rápido: Comandos Essenciais

| Comando | Descrição |
| :--- | :--- |
| `docker network ls` | Lista todas as redes disponíveis. |
| `docker network create <nome>` | Cria uma nova rede `bridge` customizada. |
| `docker network inspect <nome>` | Exibe informações detalhadas sobre uma rede, incluindo os contêineres conectados. |
| `docker network connect <rede> <container>` | Conecta um contêiner já em execução a uma rede. |
| `docker network disconnect <rede> <container>` | Desconecta um contêiner de uma rede. |
| `docker network rm <nome>` | Remove uma rede (só funciona se não houver contêineres conectados). |
| `docker network prune` | Remove todas as redes que não estão sendo utilizadas. |
