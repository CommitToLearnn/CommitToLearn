# Dados Quantitativos vs. Qualitativos: O "Quanto" e o "Porquê".

Imagine que você é um crítico de cinema analisando um filme. Você pode coletar dois tipos de informação:

- **Dados Quantitativos (O "Quanto"):**
  - Duração do filme: **125 minutos**.
  - Orçamento: **$200 milhões**.
  - Nota no IMDb: **8.7/10**.
  - Número de ingressos vendidos: **50 milhões**.
  Estes são números. Você pode calcular a média, somar, comparar. Eles te dizem a escala, a performance, a magnitude.

- **Dados Qualitativos (O "Porquê"):**
  - Gênero do filme: **"Ficção Científica"**.
  - Críticas dos espectadores: **"O roteiro foi brilhante, mas o final foi previsível."**
  - Classificação indicativa: **"14 anos"**.
  Estes são rótulos, categorias, opiniões. Eles te dão o contexto, o significado, a história por trás dos números.

Uma boa análise precisa dos dois. Saber que o filme faturou muito (**quantitativo**) é bom, mas saber que as pessoas amaram o roteiro (**qualitativo**) explica o **porquê** do sucesso.

### O Conceito em Detalhes

Vamos quebrar as características de cada um.

**A. Dados Quantitativos (Numéricos)**

- **O que são:** Qualquer dado que pode ser medido ou contado. Permitem operações matemáticas.
- **Tipos:**
    - **Discretos:** Números inteiros, que não podem ser quebrados. Você conta esses dados. (Ex: número de cliques, quantidade de produtos no carrinho, número de filhos).
    - **Contínuos:** Podem assumir qualquer valor dentro de um intervalo. Você mede esses dados. (Ex: altura de uma pessoa, temperatura, tempo de carregamento de uma página).

**B. Dados Qualitativos (Categóricos)**

- **O que são:** Dados que descrevem qualidades ou características. Eles se encaixam em categorias.
- **Tipos:**
    - **Nominais:** Categorias que **não** têm uma ordem ou ranking lógico. (Ex: cor dos olhos, gênero, país de origem, nome de um produto).
    - **Ordinais:** Categorias que **têm** uma ordem ou hierarquia clara. (Ex: nível de satisfação ["Ruim", "Bom", "Excelente"], tamanho de camiseta ["P", "M", "G"], classe social ["Baixa", "Média", "Alta"]).

### Por Que Isso Importa?

O tipo de dado (quantitativo ou qualitativo) determina:
1.  **Que tipo de perguntas você pode responder.**
2.  **Quais operações matemáticas você pode aplicar.**
3.  **Qual o melhor gráfico para visualizá-lo.**

Você não calcula a "média" de um conjunto de cores (qualitativo nominal), mas pode calcular a frequência de cada cor. Você pode calcular a média de idade (quantitativo contínuo). Entender essa diferença é o primeiro passo para uma análise correta.

### Exemplos Práticos

**Cenário: Análise de uma loja online**

- **Dados Quantitativos:**
    - `valor_da_compra` (contínuo): R$ 125,50
    - `numero_de_itens` (discreto): 3
    - `tempo_na_pagina_em_segundos` (contínuo): 180.5
- **Dados Qualitativos:**
    - `categoria_do_produto` (nominal): "Eletrônicos"
    - `avaliacao_do_produto` (ordinal): "5 Estrelas"
    - `feedback_do_cliente` (nominal/texto livre): "A entrega foi muito rápida!"

### Armadilhas Comuns

- **Tratar Números como Quantitativos Quando Não São:** Um CEP (ex: 01000-000) ou um CPF são números, mas não são quantitativos. Você não calcula a "média dos CEPs". Eles são, na verdade, identificadores **qualitativos nominais**.
- **Ignorar a Ordem dos Dados Ordinais:** Ao converter categorias ordinais para números para usar em modelos, é crucial manter a ordem. Mapear "Ruim" -> 0, "Bom" -> 1, "Excelente" -> 2 faz sentido. Mapear aleatoriamente perde essa informação valiosa.
- **Analisar Apenas um Tipo:** Focar apenas nos números (quantitativo) pode te levar a conclusões erradas. "As vendas caíram 10%" (o quê?). A análise dos feedbacks (qualitativo) pode revelar que "o site ficou lento após a última atualização" (o porquê).

### Boas Práticas

1.  **Transforme Qualitativo em Quantitativo (Quando Apropriado):** A maior parte da análise de dados e machine learning envolve transformar dados qualitativos em números.
    - **Contagem/Frequência:** Conte quantas vezes cada categoria aparece.
    - **One-Hot Encoding:** Transforme categorias nominais (ex: "SP", "RJ") em colunas binárias (0 ou 1).
    - **Análise de Sentimento:** Transforme um texto de feedback em um score numérico (ex: de -1 a 1).
2.  **Use o Gráfico Certo para Cada Tipo:**
    - **Quantitativos:** Histogramas e Box Plots para ver a distribuição; Scatter Plots para ver o relacionamento entre duas variáveis quantitativas.
    - **Qualitativos:** Gráficos de Barras para ver a frequência de cada categoria.
3.  **Sempre Valide os Tipos de Dados:** Ao carregar um dataset (ex: com `pandas`), a primeira coisa a fazer é usar `df.info()` para checar se o Pandas interpretou cada coluna com o tipo de dado correto.

### Resumo Rápido
- **Quantitativo (O Quanto):** Números que podem ser medidos ou contados.
  - **Discreto:** Contagens (nº de cliques).
  - **Contínuo:** Medidas (temperatura).
- **Qualitativo (O Porquê):** Categorias ou rótulos.
  - **Nominal:** Sem ordem (cores).
  - **Ordinal:** Com ordem (avaliação "Bom", "Ruim").
- **A melhor análise combina os dois:** Use os números para identificar padrões e as categorias/textos para explicar o contexto por trás deles.