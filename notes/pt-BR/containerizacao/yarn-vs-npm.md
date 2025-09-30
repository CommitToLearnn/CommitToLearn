# Yarn vs NPM vs PNPM: Escolhendo o Gerenciador de Pacotes Ideal para Docker

A escolha do gerenciador de pacotes impacta significativamente o tamanho, velocidade de build e confiabilidade dos seus containers Node.js.

## NPM (Node Package Manager)

### Características
- **Padrão oficial**: Vem instalado com Node.js
- **Lock file**: package-lock.json
- **Cache**: ~/.npm
- **Versioning**: Semântico com package.json

### Dockerfile com NPM
```dockerfile
FROM node:18-slim
WORKDIR /app

# Otimização: copiar apenas package files primeiro
COPY package*.json ./

# npm ci é mais rápido e determinístico que npm install
RUN npm ci --only=production

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Vantagens do NPM
```dockerfile
# 1. Universalmente disponível
FROM node:18-alpine
# npm já está disponível, sem instalação adicional

# 2. Comandos simples e familiares
RUN npm ci --only=production --silent

# 3. Boa integração com Docker
RUN npm ci \
    && npm cache clean --force \
    && rm -rf /tmp/*
```

### Otimizações NPM
```dockerfile
# Cache em multi-stage
FROM node:18-slim as deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
CMD ["node", "dist/server.js"]
```

## Yarn

### Características
- **Desenvolvido pelo Facebook**: Focado em performance e segurança
- **Lock file**: yarn.lock
- **Cache**: ~/.yarn/cache
- **Workspaces**: Suporte nativo para monorepos

### Dockerfile com Yarn
```dockerfile
FROM node:18-slim

# Instalar Yarn
RUN npm install -g yarn

WORKDIR /app
COPY package.json yarn.lock ./

# yarn install --frozen-lockfile é equivalente ao npm ci
RUN yarn install --frozen-lockfile --production

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Yarn Berry (v2+)
```dockerfile
FROM node:18-slim
WORKDIR /app

# Habilitar Yarn Berry
RUN npm install -g yarn
RUN yarn set version stable

# Copiar configurações do Yarn
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

# Zero-installs com PnP
RUN yarn install --immutable

COPY . .
CMD ["yarn", "node", "server.js"]
```

### Vantagens do Yarn
```dockerfile
# 1. Instalação paralela mais rápida
FROM node:18-slim
RUN npm install -g yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
# ✅ Até 2x mais rápido que npm

# 2. Workspaces para monorepos
FROM node:18-slim
RUN npm install -g yarn
COPY package.json yarn.lock ./
COPY packages/*/package.json packages/*/
RUN yarn install --frozen-lockfile
# ✅ Gerencia dependências compartilhadas
```

## PNPM (Performant NPM)

### Características
- **Eficiência de espaço**: Hard links e content-addressable storage
- **Performance**: Instalação não-flat, mais rápida
- **Lock file**: pnpm-lock.yaml
- **Compatibilidade**: API similar ao npm

### Dockerfile com PNPM
```dockerfile
FROM node:18-slim

# Instalar PNPM
RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# pnpm install --frozen-lockfile é equivalente ao npm ci
RUN pnpm install --frozen-lockfile --prod

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### PNPM com Cache Otimizado
```dockerfile
# Multi-stage com PNPM store
FROM node:18-slim as base
RUN npm install -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

FROM base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
CMD ["node", "dist/server.js"]
```

## Comparação de Performance

### Benchmarks de Build Time
```dockerfile
# Teste de velocidade - mesmo projeto
# NPM
FROM node:18-slim as npm-test
WORKDIR /app
COPY package*.json ./
RUN time npm ci --only=production
# Resultado típico: ~45s

# Yarn
FROM node:18-slim as yarn-test
RUN npm install -g yarn
WORKDIR /app
COPY package.json yarn.lock ./
RUN time yarn install --frozen-lockfile --production
# Resultado típico: ~30s

# PNPM
FROM node:18-slim as pnpm-test
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN time pnpm install --frozen-lockfile --prod
# Resultado típico: ~25s
```

### Tamanho de node_modules
```dockerfile
# Comparação de tamanho
FROM node:18-slim as comparison
WORKDIR /app
COPY package.json ./

# NPM - estrutura flat
RUN npm install --only=production
RUN du -sh node_modules  # ~200MB típico

# Yarn - estrutura flat similar
RUN yarn install --production
RUN du -sh node_modules  # ~200MB típico

# PNPM - hard links, menor footprint
RUN pnpm install --prod
RUN du -sh node_modules  # ~150MB típico (30% menor)
```

## Estratégias de Cache

### NPM Cache Strategy
```dockerfile
FROM node:18-slim
WORKDIR /app

# Cache de dependências
COPY package*.json ./
RUN npm ci --only=production \
    && npm cache clean --force

# Cache layers do Docker
COPY . .
RUN npm run build
```

### Yarn Cache Strategy
```dockerfile
FROM node:18-slim
RUN npm install -g yarn

# Yarn cache pode ser preservado
WORKDIR /app
COPY package.json yarn.lock ./

# Cache explícito
RUN yarn config set cache-folder /yarn-cache
RUN yarn install --frozen-lockfile --production

COPY . .
```

### PNPM Store Strategy
```dockerfile
FROM node:18-slim
RUN npm install -g pnpm

# PNPM store compartilhado
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# Store global otimizado
RUN pnpm config set store-dir /pnpm-store
RUN pnpm install --frozen-lockfile --prod

COPY . .
```

## Monorepos e Workspaces

### Yarn Workspaces
```dockerfile
FROM node:18-slim
RUN npm install -g yarn

WORKDIR /app

# Root package.json com workspaces
COPY package.json yarn.lock ./
COPY packages/*/package.json packages/*/

# Instalar todas as dependências do workspace
RUN yarn install --frozen-lockfile

# Copiar código de todos os packages
COPY packages/ packages/

# Build apenas o package necessário
RUN yarn workspace @myorg/api build

# Runtime apenas com o que é necessário
FROM node:18-slim
RUN npm install -g yarn
WORKDIR /app
COPY --from=0 /app/packages/api/dist ./
COPY --from=0 /app/packages/api/package.json ./
RUN yarn install --production
CMD ["node", "index.js"]
```

### PNPM Workspaces
```dockerfile
FROM node:18-slim
RUN npm install -g pnpm

WORKDIR /app

# pnpm-workspace.yaml
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/*/package.json packages/*/

# Instalar com workspaces
RUN pnpm install --frozen-lockfile

COPY packages/ packages/

# Build específico
RUN pnpm --filter @myorg/api build

# Deploy apenas o necessário
FROM node:18-slim
RUN npm install -g pnpm
WORKDIR /app
COPY --from=0 /app/packages/api/dist ./
COPY --from=0 /app/packages/api/package.json ./
RUN pnpm install --prod
CMD ["node", "index.js"]
```

## Segurança e Auditoria

### NPM Security
```dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./

# Auditoria de segurança
RUN npm audit --audit-level=moderate
RUN npm ci --only=production

# Remover devDependencies explicitamente
RUN npm prune --production
```

### Yarn Security
```dockerfile
FROM node:18-slim
RUN npm install -g yarn
WORKDIR /app
COPY package.json yarn.lock ./

# Yarn audit
RUN yarn audit --level moderate
RUN yarn install --frozen-lockfile --production

# Yarn Berry com PnP (mais seguro)
RUN yarn set version stable
RUN yarn install --immutable
```

### PNPM Security
```dockerfile
FROM node:18-slim
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./

# PNPM audit
RUN pnpm audit --audit-level moderate
RUN pnpm install --frozen-lockfile --prod

# Store verification
RUN pnpm store verify
```

## Multi-Stage Builds Otimizados

### NPM Multi-Stage
```dockerfile
# Dependências
FROM node:18-slim as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM node:18-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime
FROM node:18-slim
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
USER node
CMD ["node", "dist/server.js"]
```

### Yarn Multi-Stage
```dockerfile
# Dependências
FROM node:18-slim as dependencies
RUN npm install -g yarn
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Build
FROM node:18-slim as builder
RUN npm install -g yarn
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Runtime
FROM node:18-slim
RUN npm install -g yarn
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
USER node
CMD ["yarn", "start"]
```

### PNPM Multi-Stage
```dockerfile
# Dependências
FROM node:18-slim as dependencies
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Build
FROM node:18-slim as builder
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Runtime
FROM node:18-slim
RUN npm install -g pnpm
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
USER node
CMD ["pnpm", "start"]
```

## Recomendações por Cenário

### Use NPM quando:
```dockerfile
# 1. Projeto simples e equipe pequena
FROM node:18-slim
COPY package*.json ./
RUN npm ci --only=production
# ✅ Sem overhead de instalação adicional

# 2. CI/CD padronizado
# ✅ Amplamente suportado em pipelines

# 3. Aplicações legadas
# ✅ Máxima compatibilidade
```

### Use Yarn quando:
```dockerfile
# 1. Monorepos complexos
FROM node:18-slim
RUN npm install -g yarn
# ✅ Workspaces nativos e robustos

# 2. Equipes grandes com lockfile strict
RUN yarn install --frozen-lockfile
# ✅ Determinismo garantido

# 3. Performance crítica
# ✅ Instalação paralela otimizada
```

### Use PNPM quando:
```dockerfile
# 1. Múltiplos projetos no mesmo host
# ✅ Economia significativa de espaço

# 2. Builds frequentes
# ✅ Cache eficiente entre projetos

# 3. Desenvolvimento local com Docker
# ✅ Menos I/O, builds mais rápidos
```

## Checklist de Otimização

### Para todos os gerenciadores:
```dockerfile
# ✅ Multi-stage builds
# ✅ Cache de dependências em layer separado
# ✅ Usar versões de produção (--only=production)
# ✅ Limpar caches após instalação
# ✅ User não-root para segurança
# ✅ .dockerignore apropriado

# Exemplo .dockerignore
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.git
.env
```

A escolha do gerenciador deve considerar o contexto do projeto, tamanho da equipe e infraestrutura existente, sempre priorizando builds determinísticos e seguros.
