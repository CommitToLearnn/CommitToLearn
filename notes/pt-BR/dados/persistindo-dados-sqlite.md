# Persistindo Dados: Como salvar seu DataFrame em um banco de dados SQLite.

Imagine que você passou horas limpando e organizando seus dados em um DataFrame. Você removeu linhas duplicadas, corrigiu erros, criou novas colunas... seu trabalho está perfeito!

Agora você desliga o computador. O que acontece? **Você perde tudo.** O DataFrame vive apenas na memória RAM enquanto o script está rodando.

**Persistir dados** é o ato de "salvar o jogo". Em vez de salvar em um arquivo de save, nós vamos salvar nosso DataFrame em um arquivo de banco de dados. O **SQLite** é perfeito para isso porque ele é um banco de dados inteiro contido em um único arquivo no seu computador. Não precisa de servidor, nem de instalação complicada.

`CSV/Excel = Salvar um documento de texto.`
`SQLite = Salvar em um "memory card" estruturado e eficiente.`

### O Conceito em Detalhes

O processo é surpreendentemente simples e tem 3 passos:

1.  **Conectar ao Banco de Dados:**
    - Primeiro, você precisa "abrir a porta" para o banco de dados. Em Python, fazemos isso com a biblioteca `sqlite3`.
    - `sqlite3.connect('meu_banco.db')`
    - Isso cria um objeto de **conexão**. Se o arquivo `meu_banco.db` não existir, ele será criado automaticamente!

2.  **Salvar o DataFrame na Conexão:**
    - O Pandas tem uma função mágica para isso: `.to_sql()`.
    - Você diz ao DataFrame: "Ei, se salve nesta conexão que eu abri".
    - `df.to_sql('nome_da_tabela', conexao, ...)`

3.  **Fechar a Conexão:**
    - Depois de terminar, é uma boa prática "fechar a porta" para garantir que tudo foi salvo corretamente.
    - `conexao.close()`

**Lendo os dados de volta:**
O processo inverso também é simples. Você abre a conexão e usa a função `pd.read_sql_query()` do Pandas.

`pd.read_sql_query('SELECT * FROM nome_da_tabela', conexao)`

### Por Que Isso Importa?

"Mas eu posso simplesmente salvar como um arquivo CSV!" Sim, você pode, mas usar um banco de dados como o SQLite tem grandes vantagens:

- **Eficiência:** Para dados grandes, consultar um banco de dados é muito mais rápido do que ler um CSV inteiro na memória.
- **Segurança dos Tipos:** O banco de dados armazena os tipos de dados (número, texto, data). Quando você lê de volta, não corre o risco do Pandas adivinhar errado, o que acontece muito com CSVs.
- **Poder de Consulta:** Você pode usar a linguagem SQL para fazer consultas complexas diretamente no banco de dados, trazendo para o Pandas apenas os dados de que precisa.
- **Portabilidade:** Você só precisa enviar um único arquivo `.db` para alguém, e ele contém todas as suas tabelas de dados.

É o próximo passo natural depois de aprender a lidar com arquivos CSV.

### Exemplos Práticos

Vamos pegar nosso DataFrame de vendas e salvá-lo.

```python
import pandas as pd
import sqlite3

# 0. Nosso DataFrame pronto para ser salvo
dados_vendas = {
    'Produto': ['Café', 'Açúcar', 'Suco', 'Chá', 'Café'],
    'Categoria': ['Bebida', 'Alimento', 'Bebida', 'Bebida', 'Bebida'],
    'Preco': [15.0, 5.0, 8.0, 6.0, 18.0]
}
df_vendas = pd.DataFrame(dados_vendas)

# 1. Criar a conexão com o banco de dados
# Isso vai criar o arquivo 'loja.db' na mesma pasta do seu script
con = sqlite3.connect('loja.db')

# 2. Salvar o DataFrame no banco de dados
# - 'vendas' será o nome da nossa tabela lá dentro
# - if_exists='replace' significa: se a tabela 'vendas' já existir, apague-a e crie de novo.
# - index=False significa: não salve o índice do DataFrame (0, 1, 2...) como uma coluna.
df_vendas.to_sql('vendas', con, if_exists='replace', index=False)

# 3. Fechar a conexão
con.close()

print("DataFrame salvo com sucesso no arquivo 'loja.db'!")
```

**Agora, vamos ler os dados de volta em um novo script:**

```python
import pandas as pd
import sqlite3

# 1. Conectar ao banco de dados existente
con = sqlite3.connect('loja.db')

# 2. Escrever uma query SQL e usar o Pandas para ler o resultado
query = "SELECT * FROM vendas WHERE Categoria = 'Bebida'"
df_bebidas_do_banco = pd.read_sql_query(query, con)

# 3. Fechar a conexão
con.close()

# 4. Ver o que veio do banco!
print(df_bebidas_do_banco)
```

### Armadilhas Comuns

- **O Parâmetro `if_exists`:** Este é o mais perigoso.
  - `if_exists='fail'` (padrão): Dá erro se a tabela já existe. Seguro, mas pode ser chato.
  - `if_exists='replace'`: **Apaga a tabela inteira** e a substitui. Útil, mas você pode perder dados se não tomar cuidado.
  - `if_exists='append'`: Adiciona os dados do DataFrame ao final da tabela existente. Ótimo para atualizar dados, mas pode criar duplicatas se você rodar o mesmo script várias vezes.

- **Esquecer de `index=False`:**
  - Por padrão, o Pandas salva o índice (0, 1, 2...) como uma coluna chamada `index` no banco de dados. Na maioria das vezes, você não quer isso. Quase sempre você vai usar `index=False`.

- **Deixar a Conexão Aberta:**
  - Em scripts pequenos, não é o fim do mundo, mas é uma péssima prática. Pode levar a arquivos de banco de dados corrompidos ou bloqueados. Sempre feche a conexão.

### Boas Práticas

- **Seja Explícito com `if_exists`:**
  - Nunca confie no padrão. Sempre decida e escreva o que você quer fazer: `'replace'`, `'append'` ou `'fail'`. Isso força você a pensar no que está acontecendo.

- **Use `index=False` por Padrão:**
  - A menos que seu índice tenha um significado real e importante (ex: datas, IDs de usuário), não o salve.

- **Use o Bloco `with` para Conexões (Nível Intermediário):**
  - Uma forma mais segura de garantir que a conexão seja fechada é usar um bloco `with`, mas para começar, apenas lembrar de `.close()` é suficiente.
  - `with sqlite3.connect('loja.db') as con: ... # A conexão fecha sozinha no final`

### Resumo Rápido
- **Persistir** é salvar seus dados da memória para um arquivo.
- **SQLite** é um banco de dados em um único arquivo, perfeito para projetos locais.
- **Passo 1: Conectar:** `con = sqlite3.connect('meu_banco.db')`
- **Passo 2: Salvar:** `df.to_sql('nome_tabela', con, if_exists='replace', index=False)`
- **Passo 3: Fechar:** `con.close()`
- **Para Ler:** `pd.read_sql_query('SELECT * FROM nome_tabela', con)`
- **Cuidado:** Preste muita atenção nos parâmetros `if_exists` e `index`.