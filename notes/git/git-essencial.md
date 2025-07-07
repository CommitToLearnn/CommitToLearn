### Git Essencial - Controle de Versão para Desenvolvedores

**O que é Git?**

O **Git** é um sistema de controle de versão distribuído que permite acompanhar mudanças no código, colaborar com outros desenvolvedores e manter um histórico completo do projeto.

**Por que usar Git?**
- Histórico completo de todas as mudanças
- Colaboração eficiente em equipe
- Backup automático e distribuído
- Branches para desenvolvimento paralelo
- Reverter mudanças problemáticas

### Terminologias para Commits (Conventional Commits)

O **Conventional Commits** é uma convenção para escrever mensagens de commit padronizadas e semânticas.

#### Estrutura Básica:
```
tipo(escopo): descrição

[corpo opcional]

[rodapé(s) opcional(is)]
```

#### Tipos Principais:

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **feat** | Nova funcionalidade | `feat(auth): adicionar login com Google` |
| **fix** | Correção de bug | `fix(api): corrigir erro 500 no endpoint users` |
| **refactor** | Refatoração de código | `refactor(utils): simplificar função de validação` |
| **docs** | Documentação | `docs(readme): atualizar instruções de instalação` |
| **style** | Formatação/estilo | `style(css): corrigir indentação nos componentes` |
| **test** | Testes | `test(user): adicionar testes unitários para UserService` |
| **chore** | Tarefas de manutenção | `chore(deps): atualizar dependências do projeto` |
| **perf** | Melhoria de performance | `perf(db): otimizar query de busca de usuários` |
| **ci** | Integração contínua | `ci(github): adicionar workflow de deploy automático` |
| **build** | Sistema de build | `build(webpack): configurar minificação para produção` |

#### Exemplos Práticos:

**✅ Bons Commits:**
```bash
feat(user): implementar sistema de autenticação JWT
fix(cart): corrigir cálculo de desconto em produtos
refactor(api): reorganizar estrutura de rotas
docs(contributing): adicionar guia de contribuição
test(payment): adicionar testes de integração para pagamentos
```

**❌ Commits Ruins:**
```bash
"mudanças"
"fix"
"trabalho de hoje"
"atualizações várias"
"commit"
```

#### Breaking Changes:
```bash
feat(api)!: alterar formato de resposta da API

BREAKING CHANGE: O campo 'user_id' foi renomeado para 'userId'
```

### Comandos Principais do Git

#### Configuração Inicial
```bash
# Configurar nome e email globalmente
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Configurar editor padrão
git config --global core.editor "code --wait"

# Ver todas as configurações
git config --list
```

#### Iniciando um Repositório
```bash
# Criar novo repositório
git init

# Clonar repositório existente
git clone https://github.com/usuario/repo.git

# Clonar branch específica
git clone -b develop https://github.com/usuario/repo.git
```

#### Workflow Básico
```bash
# Ver status dos arquivos
git status

# Adicionar arquivos ao staging
git add arquivo.js
git add .                    # Todos os arquivos
git add *.js                 # Todos os arquivos .js

# Fazer commit
git commit -m "feat(login): implementar autenticação"

# Commit direto (sem staging)
git commit -am "fix(bug): corrigir validação"

# Enviar para repositório remoto
git push origin main

# Baixar mudanças do remoto
git pull origin main
```

#### Trabalhando com Branches
```bash
# Listar branches
git branch                   # Locais
git branch -r               # Remotas
git branch -a               # Todas

# Criar nova branch
git branch feature/nova-funcionalidade
git checkout -b feature/nova-funcionalidade  # Criar e mudar

# Mudar de branch
git checkout main
git switch main             # Comando mais novo

# Fazer merge
git checkout main
git merge feature/nova-funcionalidade

# Deletar branch
git branch -d feature/nova-funcionalidade    # Local
git push origin --delete feature/nome        # Remota
```

#### Histórico e Informações
```bash
# Ver histórico de commits
git log
git log --oneline           # Resumido
git log --graph            # Com gráfico
git log --author="Nome"    # Por autor

# Ver mudanças específicas
git show commit-hash
git diff                   # Mudanças não commitadas
git diff HEAD~1           # Comparar com commit anterior
```

#### Desfazendo Mudanças
```bash
# Desfazer mudanças no arquivo (não commitado)
git checkout -- arquivo.js
git restore arquivo.js      # Comando mais novo

# Remover do staging
git reset HEAD arquivo.js
git restore --staged arquivo.js

# Voltar ao commit anterior (mantém mudanças)
git reset --soft HEAD~1

# Voltar ao commit anterior (remove mudanças)
git reset --hard HEAD~1

# Criar commit que reverte outro commit
git revert commit-hash
```

#### Repositórios Remotos
```bash
# Ver remotos configurados
git remote -v

# Adicionar remoto
git remote add origin https://github.com/usuario/repo.git

# Buscar mudanças (sem merge)
git fetch origin

# Buscar e fazer merge
git pull origin main

# Enviar branch pela primeira vez
git push -u origin feature/nova-branch
```

#### Stash (Mudanças Temporárias)
```bash
# Salvar mudanças temporariamente
git stash
git stash save "trabalho em progresso"

# Ver stashes salvos
git stash list

# Aplicar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}

# Deletar stash
git stash drop stash@{0}
```

### Workflow Avançado

#### Git Flow Simplificado:

1. **main/master**: Código estável em produção
2. **develop**: Integração de novas funcionalidades
3. **feature/**: Desenvolvimento de novas funcionalidades
4. **hotfix/**: Correções urgentes para produção

```bash
# Fluxo típico de feature
git checkout develop
git pull origin develop
git checkout -b feature/nova-funcionalidade

# Desenvolvimento...
git add .
git commit -m "feat(feature): implementar nova funcionalidade"
git push origin feature/nova-funcionalidade

# Pull Request/Merge Request
# Após aprovação:
git checkout develop
git pull origin develop
git branch -d feature/nova-funcionalidade
```

#### Resolução de Conflitos:
```bash
# Quando há conflito no merge/pull:
git status                  # Ver arquivos em conflito

# Editar arquivos manualmente para resolver conflitos
# Marcar como resolvido:
git add arquivo-resolvido.js

# Finalizar merge:
git commit -m "resolve: conflito em arquivo.js"
```

#### Rebase vs Merge:
```bash
# Merge (preserva histórico de branches)
git merge feature/branch

# Rebase (história linear)
git rebase develop          # Reaplica commits em cima de develop
git rebase -i HEAD~3       # Rebase interativo (últimos 3 commits)
```

### Comandos de Emergência

#### Recuperar Commits Perdidos:
```bash
# Ver todos os commits (incluindo "perdidos")
git reflog

# Recuperar commit específico
git checkout commit-hash
git cherry-pick commit-hash
```

#### Limpar Repositório:
```bash
# Remover arquivos não versionados
git clean -n               # Ver o que seria removido
git clean -f               # Remover arquivos
git clean -fd              # Remover arquivos e diretórios
```

#### Corrigir Último Commit:
```bash
# Alterar mensagem do último commit
git commit --amend -m "nova mensagem"

# Adicionar mudanças ao último commit
git add arquivo-esquecido.js
git commit --amend --no-edit
```

### Boas Práticas

#### Faça:
- **Commits atômicos**: Uma mudança lógica por commit
- **Mensagens descritivas**: Use Conventional Commits
- **Commits frequentes**: Não acumule muitas mudanças
- **Teste antes de commitar**: Garanta que o código funciona
- Use .gitignore: Ignore arquivos desnecessários

#### Evite:
- Commits com mensagens vagas
- Commits gigantes com muitas mudanças
- Commitar arquivos sensíveis (senhas, tokens)
- Trabalhar direto na branch main
- Push --force em branches compartilhadas

#### Exemplo de .gitignore:
```
# Dependências
node_modules/
vendor/

# Arquivos de configuração
.env
.env.local
config/database.yml

# Arquivos de build
dist/
build/
*.log

# IDEs
.vscode/
.idea/
*.swp

# Sistema operacional
.DS_Store
Thumbs.db
```

### Recursos Úteis

#### Aliases Úteis:
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --decorate --all"
```

#### Ferramentas Visuais:
- **GitKraken**: Interface gráfica avançada
- **Sourcetree**: Cliente visual gratuito
- **VS Code**: Integração Git nativa
- **GitHub Desktop**: Cliente oficial do GitHub

**Dica:** Git é uma ferramenta fundamental para qualquer desenvolvedor. Pratique os comandos básicos diariamente e aos poucos incorpore os comandos mais avançados ao seu workflow!
