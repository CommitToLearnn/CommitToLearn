# Dados Estruturados, Semi-estruturados e Não Estruturados.

Pense nos seus dados como caixas em um depósito:
- **Dados Estruturados:** Caixas idênticas, etiquetadas e empilhadas em prateleiras fixas (`Nome`, `Preço`, `SKU`). Rígido, mas super fácil de encontrar e contar.
- **Dados Semi-estruturados:** Caixas com etiquetas flexíveis (JSON, XML). Você sabe o que tem dentro (`"produto": "livro"`), mas cada caixa pode ter etiquetas diferentes.
- **Dados Não Estruturados:** Uma pilha de objetos soltos (imagens, áudios, PDFs). Ricos em conteúdo, mas você precisa vasculhar cada um para extrair valor.

### O Conceito em Detalhes

- **Dados Estruturados:**
    - **Formato:** Tabelas com colunas e tipos fixos (SQL, CSV, planilhas).
    - **Esquema:** Rígido e pré-definido.
    - **Uso:** Ideal para sistemas transacionais (ERPs, CRMs) e relatórios de BI.

- **Dados Semi-estruturados:**
    - **Formato:** Usa tags ou chaves para organizar (JSON, XML, logs).
    - **Esquema:** Flexível. Novos campos podem ser adicionados sem quebrar tudo.
    - **Uso:** Perfeito para APIs, configuração de sistemas e dados da web.

- **Dados Não Estruturados:**
    - **Formato:** Nativo, sem estrutura inerente (texto, imagem, áudio, vídeo).
    - **Esquema:** Inexistente.
    - **Uso:** Requer processamento especializado (NLP para texto, Visão Computacional para imagens) para extrair features e insights.

### Por Que Isso Importa?

Entender o tipo do seu dado define **como você vai armazená-lo, processá-lo e analisá-lo**. Escolher a ferramenta errada para o trabalho gera ineficiência e frustração. Você não usa um garfo para tomar sopa.

### Exemplo Prático

- **Estruturado:** Uma tabela de `clientes` em um banco de dados PostgreSQL.
  `| id | nome | email |`
- **Semi-estruturado:** A resposta de uma API de produtos em JSON.
  `{ "nome": "Produto A", "preco": 19.99, "tags": ["novo", "oferta"] }`
- **Não Estruturado:** Uma pasta no S3 cheia de imagens `.jpg` de produtos.

### Armadilhas Comuns

- **Tentar forçar dados não estruturados em tabelas:** Armazenar um texto de 5000 palavras em uma célula de banco de dados relacional é ineficiente para buscas.
- **Usar esquemas rígidos para dados que mudam muito:** Usar uma tabela SQL para logs de eventos, onde novos campos surgem toda semana, causa dor de cabeça com migrações de esquema.

### Boas Práticas

- **Estruturados:** Mantenha o esquema limpo e documentado. Use validações.
- **Semi-estruturados:** Defina um "contrato" mínimo (campos obrigatórios) e use validadores de esquema (como JSON Schema).
- **Não Estruturados:** Sempre armazene **metadados** estruturados junto com o dado bruto (ex: para uma imagem, salve o `timestamp`, `geolocalização`, `id_camera`). Isso torna os dados pesquisáveis.

### Resumo Rápido
- **Estruturado:** Esquema rígido (tabelas). Fácil de consultar.
- **Semi-estruturado:** Esquema flexível (JSON, XML). Ótimo para APIs.
- **Não Estruturado:** Sem esquema (texto, imagem). Exige processamento para extrair valor.