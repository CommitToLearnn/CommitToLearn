# Salvando seu DataFrame em um banco de dados SQLite.

Imagine que você passou horas limpando e organizando seus dados em um DataFrame. Agora você desliga o computador. O que acontece? **Você perde tudo.** O DataFrame vive apenas na memória RAM.

**Persistir dados** é o ato de "salvar o jogo". O **SQLite** é perfeito para isso porque ele é um banco de dados inteiro contido em um **único arquivo** no seu computador. Não precisa de servidor nem de instalação complicada.

`CSV/Excel = Salvar um documento de texto.`
`SQLite = Salvar em um "memory card" estruturado e eficiente.`

### O Conceito em Detalhes

O processo é simples e tem 3 passos:
1.  **Conectar ao Banco de Dados:** Você "abre a porta" para o arquivo do banco. Se o arquivo não existir, ele é criado.
2.  **Salvar o DataFrame:** O Pandas tem a função `.to_sql()` que envia a tabela para dentro do banco.
3.  **Fechar a Conexão:** Você "fecha a porta" para garantir que tudo foi salvo corretamente.

### Por Que Isso Importa?

"Mas eu posso simplesmente salvar como um arquivo CSV!" Sim, mas SQLite tem vantagens:
- **Eficiência:** Para dados grandes, consultar um banco de dados com SQL é muito mais rápido do que ler um CSV inteiro na memória.
- **Segurança dos Tipos:** O banco armazena os tipos de dados (número, texto). Quando você lê de volta, não corre o risco do Pandas adivinhar errado.
- **Portabilidade:** Você só precisa enviar um único arquivo `.db` para alguém, e ele contém todas as suas tabelas.

### Exemplo Prático

```python
import pandas as pd
import sqlite3

df = pd.DataFrame({'Produto': ['Café', 'Açúcar'], 'Preco': [15.0, 5.0]})

# 1. Conectar (cria o arquivo 'loja.db' se não existir)
con = sqlite3.connect('loja.db')

# 2. Salvar o DataFrame
# 'vendas' será o nome da tabela
# if_exists='replace' apaga a tabela antiga e cria uma nova
# index=False evita salvar o índice do DataFrame como uma coluna
df.to_sql('vendas', con, if_exists='replace', index=False)

# 3. Fechar a conexão
con.close()

# Para ler de volta:
con = sqlite3.connect('loja.db')
df_lido = pd.read_sql_query("SELECT * FROM vendas WHERE Preco > 10", con)
con.close()
print(df_lido)
```

### Armadilhas Comuns

- **O Parâmetro `if_exists`:** Este é o mais perigoso.
  - `if_exists='replace'`: **Apaga a tabela inteira** e a substitui. Cuidado para não perder dados.
  - `if_exists='append'`: Adiciona os dados ao final da tabela. Cuidado para não criar duplicatas se rodar o mesmo script várias vezes.
- **Esquecer de `index=False`:** Quase sempre você vai querer usar isso. Senão, o Pandas cria uma coluna `index` desnecessária na sua tabela.

### Boas Práticas

- **Use o Bloco `with`:** A forma mais segura de garantir que a conexão seja fechada, mesmo que ocorra um erro.
  ```python
  with sqlite3.connect('loja.db') as con:
      df.to_sql('vendas', con, if_exists='replace', index=False)
  # A conexão fecha sozinha aqui!
  ```
- **Seja Explícito:** Sempre defina o `if_exists`. Não confie no valor padrão.

### Resumo Rápido
- **Persistir** é salvar seus dados da memória para um arquivo.
- **SQLite** é um banco de dados em um único arquivo, perfeito para projetos locais.
- **Salvar:** `df.to_sql('nome_tabela', con, if_exists='replace', index=False)`
- **Ler:** `pd.read_sql_query('SELECT * FROM nome_tabela', con)`
- **Boa Prática:** Use `with sqlite3.connect(...)` para gerenciar a conexão.