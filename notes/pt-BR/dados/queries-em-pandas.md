# Queries em Pandas: Como fazer perguntas e filtrar seus dados.

Imagine sua playlist gigante no Spotify. Você não ouve tudo de uma vez. Você filtra:
- "Me mostre apenas músicas do artista **Queen**."
- "Agora, apenas as do Queen que foram lançadas **depois de 1980**."
- "Ok, me mostre músicas do **Queen** OU do **David Bowie**."

Fazer **queries** (filtros) em um DataFrame é exatamente isso. Você tem uma tabela gigante e quer selecionar apenas as linhas que atendem a certas condições.

### O Conceito em Detalhes

A forma mais poderosa de filtrar é com uma **máscara booleana**. É um processo de dois passos:
1.  **Crie a condição:** Você escreve uma expressão que resulta em `True` ou `False` para cada linha. Ex: `df['idade'] > 30`.
2.  **Aplique a máscara:** Você coloca essa condição dentro dos colchetes `[]` do DataFrame. O Pandas te retorna apenas as linhas onde a condição foi `True`.

Para combinar condições:
- **E (AND):** Use o símbolo `&`
- **OU (OR):** Use o símbolo `|`
- **NÃO (NOT):** Use o símbolo `~`

**MUITO IMPORTANTE:** Cada condição individual **precisa** estar dentro de parênteses `()` ao combinar.

### Por Que Isso Importa?

A análise de dados raramente é sobre o conjunto de dados inteiro. É sobre **segmentos**.
- **Análise de Clientes:** "Quais clientes compraram mais de R$ 500 no último mês?"
- **Detecção de Fraude:** "Quais transações ocorreram de madrugada e foram acima de R$ 1.000?"
- **Relatórios:** "Mostre apenas as vendas da categoria 'Eletrônicos'."

Filtrar é o passo número um para focar sua análise no que realmente importa.

### Exemplos Práticos

```python
import pandas as pd
dados = {'Produto': ['Café','Açúcar','Suco','Chá'], 'Preco': [15.0, 5.0, 8.0, 6.0], 'Avaliacao': [4.5, 4.0, 4.8, 4.2]}
df = pd.DataFrame(dados)

# Pergunta 1: Produtos com preço maior que 10?
df[df['Preco'] > 10]

# Pergunta 2: Produtos com preço menor que 7 E avaliação maior que 4.1?
df[(df['Preco'] < 7) & (df['Avaliacao'] > 4.1)]

# Pergunta 3: Produtos que são 'Café' OU 'Chá'?
df[df['Produto'].isin(['Café', 'Chá'])]
```

### Armadilhas Comuns

- **Usar `and` ou `or`:** O erro mais comum. Python usa `and`/`or` para lógicas simples, mas o Pandas precisa de `&` e `|` para comparar as Séries (colunas) inteiras de uma vez.
- **Esquecer os Parênteses:** `df[df['Preco'] < 7 & df['Avaliacao'] > 4.1]` **VAI DAR ERRO**. O certo é `df[(df['Preco'] < 7) & (df['Avaliacao'] > 4.1)]`.

### Boas Práticas

- **Use `.isin()` para Múltiplos Valores:** Em vez de `(df['Produto'] == 'Café') | (df['Produto'] == 'Chá')`, use `df['Produto'].isin(['Café', 'Chá'])`. É mais limpo e rápido.
- **Guarde Filtros em Variáveis:** Se a sua condição for longa, guarde-a em uma variável com nome claro: `produtos_bem_avaliados = df['Avaliacao'] > 4.5`. Depois, `df[produtos_bem_avaliados]`.
- **Use `.query()` para Simplicidade:** Para filtros simples, `df.query('Preco > 10 and Avaliacao > 4.0')` pode ser mais legível.

### Resumo Rápido
- **Filtrar** é selecionar linhas que atendem a uma condição.
- **Máscara Booleana:** `df[df['coluna'] > valor]` é o método principal.
- **Múltiplas Condições:** Use `&` (E), `|` (OU), e **sempre** coloque cada condição entre parênteses `()`.
- **Use `.isin()`** para checar se um valor está em uma lista de possibilidades.