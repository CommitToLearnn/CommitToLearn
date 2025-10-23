# Modelagem e DAX: O Coração e o Cérebro do seu Power BI.

Imagine que você tem várias listas de pessoas: uma com aniversários, outra com endereços, e uma terceira com quem deu presente para quem. São só listas soltas.

**Modelagem de Dados** é o ato de pegar essas listas e desenhar um **mapa de relacionamentos** (uma árvore genealógica). Você desenha uma linha e diz: "Esta pessoa na lista de aniversários é a mesma pessoa na lista de endereços". De repente, você pode fazer perguntas que antes eram impossíveis: "Qual a idade média das pessoas que moram no mesmo bairro?".

**DAX (Data Analysis Expressions)** é a **linguagem** que você usa para fazer essas perguntas ao seu mapa. É como perguntar: `CALCULE a SOMA de presentes PARA os parentes que são da FAMÍLIA Silva`.

Se o Power Query é a preparação dos ingredientes, a Modelagem é a organização da sua bancada e o DAX são as receitas que você cria para combinar tudo de forma inteligente.

### O Conceito em Detalhes

**Modelagem de Dados: Fatos e Dimensões (O Modelo Estrela)**

A melhor forma de organizar seu mapa é o **Modelo Estrela (Star Schema)**. É simples:
- **Tabela Fato (O Centro da Estrela):** Contém os **eventos** e as **métricas** que você quer analisar. Geralmente tem muitas linhas e poucas colunas numéricas. Pense em uma tabela de `Vendas`, com colunas como `Data`, `ID_Produto`, `ID_Cliente` e `Valor_Venda`.
- **Tabelas Dimensão (As Pontas da Estrela):** Contêm o **contexto** e os **atributos**. Descrevem o "quem, o quê, onde, quando". Pense em tabelas como `Clientes` (com nome, cidade, estado), `Produtos` (com nome, categoria, cor) e `Calendário` (com ano, mês, dia da semana).

Você cria **relacionamentos** ligando as tabelas Dimensão à tabela Fato através de colunas de ID (ex: `ID_Cliente`).

```
      [ dCalendario ]        [ dClientes ]
           |                      |
           +----[ fVendas ]-------+
                  |
            [ dProdutos ]
```

**DAX: Colunas Calculadas vs. Medidas**

DAX é a linguagem de fórmulas do Power BI. Existem duas formas principais de usar DAX, e entender a diferença é **CRUCIAL**:

- **Coluna Calculada:**
    - **O que é:** Uma **nova coluna** que você adiciona fisicamente a uma tabela. A fórmula é calculada **linha por linha**, uma vez durante a atualização dos dados.
    - **Analogia:** É como adicionar uma coluna "Preço com Desconto" na sua planilha do Excel. O valor é calculado e armazenado em cada linha.
    - **Quando usar:** Quando você precisa do resultado em cada linha, para usar em um filtro, eixo de gráfico ou para ver o valor individual. (Ex: criar uma categoria "Caro/Barato" baseada no preço).

- **Medida:**
    - **O que é:** Uma **fórmula agregada** que **não** é armazenada em lugar nenhum. Ela é calculada **em tempo real**, com base no contexto do seu relatório (os filtros que o usuário aplicou).
    - **Analogia:** É como usar a fórmula `SOMA()` na barra de status do Excel. O resultado muda se você selecionar células diferentes.
    - **Quando usar:** **Na maioria das vezes!** É a forma correta de calcular totais, médias, percentuais e qualquer agregação. (Ex: `Total de Vendas`, `% de Margem`).

**Regra de ouro: Se puder ser uma Medida, FAÇA uma Medida.** Medidas são mais eficientes e flexíveis.

### Por Que Isso Importa?

- **Eficiência:** Um bom modelo estrela com relacionamentos corretos é muito mais rápido e consome menos memória do que uma única tabela gigante com tudo misturado.
- **Flexibilidade:** A mesma Medida `Total de Vendas` pode mostrar o total geral, o total por categoria, o total para o ano de 2023, etc., tudo dependendo de como o usuário filtra o relatório. É dinâmica por natureza.
- **Inteligência de Negócio:** O DAX permite criar lógicas de negócio complexas que seriam impossíveis no Power Query ou em planilhas, como cálculos de acumulado do ano (YTD), comparação com o mesmo período do ano anterior, etc.

### As Funções DAX Essenciais

Não tente aprender tudo de uma vez. Domine estas três e você estará no caminho certo:

1.  **Agregadores Simples:** `SUM()`, `AVERAGE()`, `COUNT()`, `DISTINCTCOUNT()`. Fazem exatamente o que dizem.
    - `Total de Vendas = SUM(Vendas[Valor])`
2.  **CALCULATE(): O Superpoder do DAX**
    - **O que faz:** É a função mais importante. Ela **modifica o contexto do filtro** de um cálculo.
    - **Como ler:** `CALCULATE( <o que calcular> , <como filtrar> )`
    - **Exemplo:** "Calcule o total de vendas, mas apenas para a categoria 'Eletrônicos'".
      `Vendas de Eletrônicos = CALCULATE( [Total de Vendas], Produtos[Categoria] = "Eletrônicos" )`
3.  **Funções de Tabela (Iteradores):** Funções que terminam com `X`, como `SUMX()`.
    - **O que fazem:** Elas iteram (passam) por cada linha de uma tabela, fazem um cálculo por linha, e depois agregam o resultado.
    - **Exemplo:** Se sua tabela de vendas tem `Quantidade` e `Preço Unitário`, mas não o total por linha:
      `Faturamento Total (com SUMX) = SUMX( Vendas, Vendas[Quantidade] * Vendas[Preço Unitário] )`

### Armadilhas Comuns

- **Relacionamentos Bidirecionais:** O Power BI permite criar relacionamentos que filtram em ambas as direções. Embora pareça útil, isso pode criar ambiguidades no modelo e deixar tudo lento. Evite-os sempre que possível. A direção única (Dimensão filtra Fato) é a prática recomendada.
- **Usar Colunas Calculadas para Agregações:** Criar uma coluna calculada que repete o valor total em todas as linhas é ineficiente e errado. Totais devem ser **Medidas**.
- **Contexto de Filtro Implícito:** Não entender que toda Medida é calculada dentro de um "contexto" criado pelos filtros do relatório. O valor da sua medida `[Total de Vendas]` muda se o usuário clica em "2023" no filtro de ano.

### Boas Práticas

- **Construa um Modelo Estrela:** Sempre separe suas tabelas em Fatos (eventos) e Dimensões (contexto).
- **Crie uma Tabela Calendário:** Crie uma tabela de datas e a relacione com sua tabela Fato. Isso é essencial para qualquer análise de tempo inteligente com DAX.
- **Escreva Medidas Explícitas:** Em vez de arrastar um campo de valor para um gráfico e deixar o Power BI fazer a soma "implícita", crie uma medida explícita como `Total de Vendas = SUM(...)`. Isso torna seu modelo mais robusto e reutilizável.
- **Formate seu Código DAX:** Use quebras de linha e indentação para tornar suas fórmulas DAX legíveis.

### Resumo Rápido
- **Modelagem:** Organize seus dados em um **Modelo Estrela** (Fatos no centro, Dimensões ao redor).
- **Relacionamentos:** Conecte as Dimensões à Fato usando colunas de ID.
- **DAX:** A linguagem de fórmulas para criar inteligência.
- **Coluna Calculada:** Valor calculado **por linha**, armazenado na tabela. Use para categorizar ou em eixos.
- **Medida:** Valor agregado, calculado **em tempo real** com base nos filtros. Use para praticamente todos os seus KPIs e valores em gráficos.
- **Funções chave:** Comece com `SUM`/`COUNT`, depois domine `CALCULATE`.