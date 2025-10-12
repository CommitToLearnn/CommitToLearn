# Queries em Pandas: Como fazer perguntas e filtrar seus dados

Imagine que você está no seu aplicativo de música. Você tem uma playlist gigante com milhares de músicas.

Você não ouve tudo de uma vez. Você filtra.
- "Me mostre apenas músicas do artista **Queen**."
- "Agora, apenas as do Queen que foram lançadas **depois de 1980**."
- "Ok, me mostre músicas do **Queen** OU do **David Bowie**."

Fazer **queries** (ou filtros) em um DataFrame é exatamente isso. Você tem uma tabela gigante de dados e quer selecionar apenas as linhas que atendem a certas condições. É como conversar com seus dados.

### O Conceito em Detalhes

Existem duas maneiras principais de filtrar um DataFrame. Vamos focar na mais fundamental primeiro.

**Método 1: A "Máscara Booleana" (A Lista de "Sim" ou "Não")**

Este é o jeito mais comum e poderoso. Funciona em dois passos:

1.  **Criar a condição:** Você escreve uma condição que o Pandas vai verificar para cada linha.
    - Ex: `df['idade'] > 30`.

2.  **Verificar o resultado:** O Pandas te devolve uma **Series** (uma coluna) cheia de `True` (Sim, a condição é verdadeira para esta linha) ou `False` (Não, a condição é falsa). Nós chamamos isso de **máscara**.

    ```
    # df['idade']
    0    25  -> False
    1    35  -> True
    2    22  -> False
    3    40  -> True
    Name: idade, dtype: bool
    ```

3.  **Aplicar a máscara:** Você coloca essa máscara dentro dos colchetes `[]` do seu DataFrame. O Pandas entende que ele só deve te mostrar as linhas onde a máscara é `True`.

    `df[ df['idade'] > 30 ]` -> Isso retorna um novo DataFrame só com as linhas das pessoas com mais de 30 anos.

**Combinando Condições:**

E se quisermos "idade maior que 30 **E** cidade igual a 'São Paulo'"?

- **E (AND):** Usa-se o `&`
- **OU (OR):** Usa-se o `|`

**MUITO IMPORTANTE:** Cada condição individual precisa estar dentro de parênteses `()`.

`df[ (df['idade'] > 30) & (df['cidade'] == 'São Paulo') ]`

**Método 2: A Função `.query()` (O jeito mais legível)**

Essa é uma alternativa que muitas pessoas acham mais fácil de ler. Você escreve sua condição como um texto.

`df.query('idade > 30')`
`df.query('idade > 30 and cidade == "São Paulo"')`

Funciona super bem para filtros mais simples e deixa o código mais limpo.

### Por Que Isso Importa?

A análise de dados raramente é sobre o conjunto de dados inteiro. É sobre **segmentos**.

- **Análise de Clientes:** "Quais clientes compraram mais de R$ 500 no último mês?"
- **Detecção de Fraude:** "Quais transações ocorreram de madrugada e foram acima de R$ 1.000?"
- **Relatórios:** "Mostre apenas as vendas da categoria 'Eletrônicos' para o relatório desta semana."

Filtrar é o passo número um para focar sua análise no que realmente importa.

### Exemplos Práticos

Vamos usar um DataFrame de vendas.

```python
import pandas as pd

dados_vendas = {
    'Produto': ['Café', 'Açúcar', 'Suco', 'Chá', 'Café'],
    'Categoria': ['Bebida', 'Alimento', 'Bebida', 'Bebida', 'Bebida'],
    'Preco': [15.0, 5.0, 8.0, 6.0, 18.0],
    'Avaliacao': [4.5, 4.0, 4.8, 4.2, 4.9]
}
df = pd.DataFrame(dados_vendas)
```

**Pergunta 1: Quais produtos custam mais de R$ 10?**

```python
# Usando a máscara
df[ df['Preco'] > 10.0 ]

# Usando .query()
df.query('Preco > 10.0')
```
**Resultado:**
```
  Produto Categoria  Preco  Avaliacao
0    Café    Bebida   15.0        4.5
4    Café    Bebida   18.0        4.9
```

**Pergunta 2: Quais bebidas têm avaliação maior que 4.6?**

```python
# Usando a máscara com &
filtro = (df['Categoria'] == 'Bebida') & (df['Avaliacao'] > 4.6)
df[filtro]

# Usando .query()
df.query('Categoria == "Bebida" and Avaliacao > 4.6')
```
**Resultado:**
```
  Produto Categoria  Preco  Avaliacao
2    Suco    Bebida    8.0        4.8
4    Café    Bebida   18.0        4.9
```

### Armadilhas Comuns

- **`and` vs `&`:** Usar `and` ou `or` em vez de `&` e `|` é o erro mais comum. Python usa `and`/`or` para lógica geral, mas o Pandas precisa de `&`/`|` para comparar as Series (colunas) inteiras de uma vez.

- **Esquecer os Parênteses:**
  - `df[df['cat'] == 'A' & df['preco'] > 10]` -> **VAI DAR ERRO!**
  - `df[(df['cat'] == 'A') & (df['preco'] > 10)]` -> **CORRETO!**
  - A ordem das operações em Python confunde o Pandas se você não usar parênteses para isolar cada condição.

- **Filtros em Cadeia (Chained Indexing):**
  - Evite fazer: `df[df['Categoria'] == 'Bebida']['Preco']`. Isso às vezes funciona, mas pode ser imprevisível e ineficiente.
  - O jeito certo é usar `.loc`: `df.loc[df['Categoria'] == 'Bebida', 'Preco']`.

### Boas Práticas

- **Guarde Filtros em Variáveis:**
  - Se a sua condição for longa, guarde-a em uma variável com um nome claro. Fica muito mais fácil de ler.
  - `clientes_vip = (df['compras'] > 10) & (df['ultima_visita'] > '2023-01-01')`
  - `df[clientes_vip]`

- **Use `.query()` para Simplicidade:**
  - Se seu filtro é simples e direto, `.query()` é seu amigo. Deixa o código com cara de "inglês".

- **Use `.isin()` para Múltiplos Valores:**
  - Para checar se o valor de uma coluna está em uma lista de possibilidades, não faça vários `|` (OR).
  - **Forma RUIM:** `df.query('Produto == "Café" or Produto == "Chá"')`
  - **Forma BOA:** `df[df['Produto'].isin(['Café', 'Chá'])]`

### Resumo Rápido
- **Filtrar** é selecionar linhas que atendem a uma condição.
- **Máscara Booleana:** `df[df['coluna'] > valor]` é o método principal.
- **Múltiplas Condições:** Use `&` (E) e `|` (OU), e **sempre** coloque cada condição entre parênteses `()`.
- **`.query()`:** Uma alternativa mais legível para filtros simples: `df.query('coluna > valor')`.
- **Evite:** `and`/`or` e esquecer os parênteses.