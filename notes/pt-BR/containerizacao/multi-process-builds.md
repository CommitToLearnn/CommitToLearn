# Multi-Stage Builds: Otimizando Imagens Docker

Imagine construir um carro de corrida. Você tem duas oficinas:

1.  **Oficina de Montagem (Estágio de Build):** Um espaço enorme com todas as ferramentas possíveis: soldadores, guindastes, máquinas de pintura, e uma equipe completa de mecânicos. Aqui, o carro é montado, o motor é ajustado e os testes são feitos. É um ambiente pesado e cheio de ferramentas.
2.  **Pista de Corrida (Estágio Final):** Um ambiente limpo e minimalista. O carro pronto é levado para cá. Na pista, você não precisa de todas as ferramentas da oficina, apenas do carro, do piloto e do combustível.

O **Multi-Stage Build** no Docker funciona exatamente assim. Ele permite que você use uma "oficina" (uma imagem de build, como `node` ou `golang`, com todas as ferramentas de compilação) para construir sua aplicação e, em seguida, copie apenas o resultado final (o "carro de corrida", seu executável ou os arquivos estáticos) para uma "pista" (uma imagem final limpa e leve, como `alpine` ou `nginx`), descartando todo o lixo e as ferramentas do processo de construção.

### O que são e por que usar?

**Multi-Stage Builds** são uma funcionalidade do Docker que permite usar múltiplos estágios `FROM` em um único Dockerfile. Cada estágio `FROM` inicia uma nova base de imagem e pode ser usado para uma tarefa específica (compilar código, rodar testes, etc.). O principal benefício é a capacidade de copiar seletivamente artefatos de um estágio para outro, permitindo criar uma imagem final extremamente otimizada.

**Principais Benefícios:**

- **Imagens Menores:** A imagem final contém apenas o necessário para executar a aplicação, sem as dependências de build (compiladores, SDKs, bibliotecas de teste), resultando em uma redução drástica de tamanho.
- **Maior Segurança:** A superfície de ataque é reduzida, pois ferramentas e pacotes desnecessários não estão presentes na imagem de produção.
- **Melhor Performance de Build:** O Docker pode armazenar em cache cada estágio separadamente. Se o código-fonte não mudou, mas os testes sim, apenas o estágio de teste será reconstruído.
- **Dockerfile Mais Simples:** Elimina a necessidade de scripts complexos para limpar artefatos de build. Tudo está contido em um único Dockerfile.
- **Paralelização Automática (com BuildKit):** O motor de build moderno do Docker, BuildKit, pode detectar estágios independentes e executá-los em paralelo, acelerando significativamente o tempo de build.

### Exemplos Práticos

#### Cenário 1: Aplicação Go (Golang)

Sem multi-stage, a imagem final conteria todo o SDK do Go, que é enorme.

```dockerfile
# ===== Estágio 1: Build (A Oficina) =====
# Usamos uma imagem completa do Go para compilar a aplicação
FROM golang:1.21 AS builder

WORKDIR /app

# Copiamos os arquivos de dependência e baixamos os módulos
COPY go.mod go.sum ./
RUN go mod download

# Copiamos o código-fonte e compilamos
COPY . .
# O 'CGO_ENABLED=0' cria um binário estaticamente vinculado
RUN CGO_ENABLED=0 go build -o /app/meu-app ./cmd/main.go

# ===== Estágio 2: Final (A Pista de Corrida) =====
# Começamos do zero com uma imagem mínima
FROM alpine:latest

WORKDIR /root/

# Copiamos APENAS o binário compilado do estágio 'builder'
COPY --from=builder /app/meu-app .

# Comando para executar a aplicação
CMD ["./meu-app"]
```
- **Resultado:** Uma imagem final com poucos megabytes, em vez de centenas.

#### Cenário 2: Aplicação Frontend (React/Vue/Angular)

Aqui, separamos a instalação de dependências, o build e o servidor final.

```dockerfile
# ===== Estágio 1: Dependências =====
# Este estágio raramente muda, então seu cache é muito aproveitado
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ===== Estágio 2: Build =====
# Este estágio reconstrói sempre que o código-fonte muda
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ===== Estágio 3: Final =====
# Usamos um servidor web leve para servir os arquivos estáticos
FROM nginx:1.23-alpine
# Copiamos os arquivos estáticos gerados no estágio 'builder'
COPY --from=builder /app/build /usr/share/nginx/html
# (Opcional) Copia uma configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
- **Resultado:** A imagem final contém apenas o Nginx e os arquivos HTML/CSS/JS, sem `node_modules` ou o código-fonte original.

### Armadilhas Comuns

1.  **Copiar a Pasta `node_modules` Inteira:** Em vez de copiar a pasta `node_modules` do estágio de build, é geralmente melhor copiar `package.json` e executar `npm install --production` no estágio final para instalar apenas as dependências de produção.
2.  **Invalidar o Cache Desnecessariamente:** A ordem das instruções `COPY` é crucial. Copie primeiro os arquivos que mudam com menos frequência (como `package.json`) e por último os que mudam sempre (como o diretório `src`).
3.  **Esquecer de Nomear os Estágios:** Usar `AS nome_do_estagio` torna o Dockerfile muito mais legível e a instrução `COPY --from=nome_do_estagio` menos propensa a erros.

### Boas Práticas

- **Comece com um Estágio de Dependências:** Crie um primeiro estágio que apenas instala as dependências. Como ele só é invalidado quando `package.json` (ou similar) muda, ele acelera muito os builds subsequentes.
- **Paralelize Estágios Independentes:** Se você tem tarefas que não dependem umas das outras (ex: rodar lint e testes unitários), coloque-as em estágios separados. O BuildKit poderá executá-las em paralelo.
- **Use uma Imagem Final Mínima:** Sempre que possível, use imagens como `alpine`, `distroless` ou até `scratch` (uma imagem vazia) para o estágio final.
- **Mantenha a Lógica Simples:** Se a lógica de build se tornar muito complexa, considere movê-la para um script shell e apenas execute esse script no Dockerfile.

### Resumo Rápido: O Conceito

| Termo | Descrição |
| :--- | :--- |
| **`FROM ... AS <nome>`** | Inicia um novo estágio de build e dá um nome a ele. |
| **Estágio de Build** | Um estágio intermediário usado para compilar, testar ou preparar a aplicação. Geralmente baseado em uma imagem com SDK completo. |
| **Estágio Final** | O último estágio no Dockerfile, que se tornará a imagem final. Deve ser baseado em uma imagem mínima. |
| **`COPY --from=<nome> ...`** | A instrução "mágica" que copia arquivos ou diretórios de um estágio anterior para o estágio atual. |
