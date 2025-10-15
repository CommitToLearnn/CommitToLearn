# Docker: A Revolução dos Contêineres

Pense no Docker como um conjunto de blocos de LEGO para software. Antes, para construir uma aplicação, você precisava montar um castelo (um servidor) com todas as peças (dependências, bibliotecas, configurações) espalhadas. Se quisesse mover o castelo, era um pesadelo.

O Docker permite que você construa cada parte da sua aplicação (um banco de dados, um backend, um frontend) como um bloco de LEGO autossuficiente e padronizado. Cada bloco já vem com tudo o que precisa para funcionar. Agora, você pode montar seu castelo em qualquer lugar, simplesmente encaixando os blocos, e ele funcionará exatamente da mesma maneira.

### O que é e por que usar?

Docker é uma plataforma de **containerização** que empacota uma aplicação e todas as suas dependências em uma unidade isolada e portátil chamada **contêiner**. Diferente de uma Máquina Virtual (VM), que virtualiza um sistema operacional inteiro, um contêiner compartilha o kernel do sistema operacional do host, tornando-o extremamente leve, rápido e eficiente.

**Principais Benefícios:**

- **Portabilidade:** "Funciona na minha máquina" deixa de ser um problema. Um contêiner roda de forma idêntica em qualquer ambiente (desenvolvimento, teste, produção).
- **Isolamento:** Contêineres são isolados uns dos outros e do host, garantindo que as dependências de uma aplicação não entrem em conflito com as de outra.
- **Eficiência:** Inicia em segundos e consome muito menos recursos (CPU, RAM) do que uma VM.
- **Escalabilidade:** É fácil criar e destruir contêineres rapidamente para escalar uma aplicação horizontalmente.
- **Ecossistema Robusto:** Ferramentas como Docker Compose e Kubernetes facilitam a orquestração de aplicações complexas com múltiplos contêineres.

### Arquitetura e Objetos Principais

A arquitetura do Docker é baseada em um modelo cliente-servidor.

1.  **Docker Daemon (`dockerd`):** O "cérebro" do Docker. É um processo de fundo (serviço) que gerencia os objetos Docker. Ele escuta as requisições da API Docker e cuida da construção, execução e distribuição dos contêineres.
2.  **Cliente Docker (`docker`):** A ferramenta de linha de comando que você usa para interagir com o Docker Daemon.
3.  **Registry (Registro):** Um repositório para armazenar e distribuir imagens Docker. O **Docker Hub** é o registro público padrão.

**Objetos Fundamentais:**

| Objeto | Descrição | Analogia |
| :--- | :--- | :--- |
| **Imagem (`Image`)** | Um template somente leitura que contém tudo o que é necessário para rodar uma aplicação: o código, as dependências e as configurações. | A planta de um bloco de LEGO. |
| **Contêiner (`Container`)** | Uma instância executável de uma imagem. É o ambiente isolado onde a aplicação realmente roda. | O bloco de LEGO construído a partir da planta. |
| **Volume (`Volume`)** | Um mecanismo para persistir dados gerados e usados pelos contêineres, desacoplando os dados do ciclo de vida do contêiner. | Um compartimento de armazenamento externo que você pode conectar ao seu bloco de LEGO. |
| **Rede (`Network`)** | Permite que contêineres se comuniquem entre si de forma isolada. | O sistema de encaixe que conecta um bloco de LEGO a outro. |
| **Dockerfile** | Um arquivo de texto com instruções para construir uma imagem Docker. | O manual de instruções para criar a planta do bloco de LEGO. |

### Exemplos Práticos

#### Cenário 1: Rodando um Servidor Web Nginx

```bash
# 1. Baixa a imagem oficial do Nginx do Docker Hub
docker pull nginx

# 2. Cria e inicia um contêiner a partir da imagem
# -d: roda em modo "detached" (em segundo plano)
# -p 8080:80: mapeia a porta 8080 do seu computador para a porta 80 do contêiner
# --name meu-servidor-web: dá um nome amigável ao contêiner
docker run -d -p 8080:80 --name meu-servidor-web nginx

# Agora, acesse http://localhost:8080 no seu navegador!
```

#### Cenário 2: Construindo uma Imagem para uma Aplicação Node.js

```dockerfile
# Dockerfile

# 1. Imagem base: um ambiente Node.js leve
FROM node:18-alpine

# 2. Diretório de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia os arquivos de dependência e instala (aproveitando o cache)
COPY package*.json ./
RUN npm install

# 4. Copia o resto do código da aplicação
COPY . .

# 5. Expõe a porta que a aplicação usa
EXPOSE 3000

# 6. Comando para iniciar a aplicação quando o contêiner rodar
CMD [ "node", "server.js" ]
```

```bash
# Para construir a imagem a partir do Dockerfile:
# -t minha-app:v1: dá um nome (tag) à imagem
docker build -t minha-app:v1 .

# Para rodar a aplicação em um contêiner:
docker run -d -p 3000:3000 --name minha-node-app minha-app:v1
```

### Armadilhas Comuns

1.  **Executar como Root:** Por padrão, os processos dentro de um contêiner rodam como usuário `root`. Isso é um risco de segurança. Sempre crie e use um usuário não-privilegiado no seu Dockerfile.
2.  **Imagens Gigantes:** Não incluir arquivos desnecessários (como `node_modules`, `.git`) na imagem. Use um arquivo `.dockerignore` para excluí-los.
3.  **Não Usar Cache de Camadas:** Estruture seu Dockerfile para aproveitar o cache. Coloque as instruções que mudam com menos frequência (como a instalação de dependências) antes das que mudam sempre (como copiar o código-fonte).

### Boas Práticas

- **Use Imagens Oficiais e Leves:** Prefira imagens oficiais do Docker Hub e use variantes `alpine` ou `slim` para manter suas imagens pequenas.
- **Adote Multi-Stage Builds:** Use múltiplos estágios `FROM` no seu Dockerfile para separar o ambiente de build do ambiente de execução, resultando em uma imagem final muito menor e mais segura.
- **Gerencie Segredos Corretamente:** Nunca coloque senhas ou chaves de API diretamente no Dockerfile. Use variáveis de ambiente ou, melhor ainda, os sistemas de gerenciamento de segredos do Docker.
- **Use Docker Compose para Desenvolvimento:** Para aplicações com múltiplos serviços, o Docker Compose simplifica drasticamente a orquestração do ambiente de desenvolvimento local.

### Resumo Rápido: Comandos Essenciais

| Comando | Descrição |
| :--- | :--- |
| `docker build -t <nome> .` | Constrói uma imagem a partir de um Dockerfile. |
| `docker run [opções] <imagem>` | Cria e inicia um contêiner a partir de uma imagem. |
| `docker ps` | Lista os contêineres em execução. |
| `docker ps -a` | Lista todos os contêineres (em execução e parados). |
| `docker stop <container>` | Para um contêiner em execução. |
| `docker rm <container>` | Remove um contêiner parado. |
| `docker images` | Lista as imagens locais. |
| `docker rmi <imagem>` | Remove uma imagem. |
| `docker logs <container>` | Exibe os logs de um contêiner. |
| `docker exec -it <container> sh` | Abre um shell interativo dentro de um contêiner em execução. |
| `docker-compose up -d` | Inicia os serviços definidos em `docker-compose.yml`. |
| `docker-compose down` | Para e remove os contêineres, redes e volumes criados pelo `up`. |
