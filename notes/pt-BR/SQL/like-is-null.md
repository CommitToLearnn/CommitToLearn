### LIKE % e IS NULL - Busca por Padrões e Valores Ausentes

**Por que Precisamos Desses Operadores?**

Nem sempre sabemos o valor exato que estamos procurando. Às vezes queremos:
- "Todos os clientes cujo nome **começa com** 'João'"
- "Todos os produtos que **contêm** a palavra 'Pro' no nome"  
- "Todos os usuários que **não preencheram** o telefone"

Para isso, usamos `LIKE` com wildcards e `IS NULL`.



### LIKE - Busca por Padrões

O `LIKE` permite buscar por **padrões** em texto, não valores exatos.

**Sintaxe:**
```sql
WHERE coluna LIKE 'padrão'
```

#### Wildcards (Caracteres Especiais)

##### % (Porcentagem) - Zero ou Mais Caracteres

O `%` representa qualquer quantidade de caracteres (incluindo zero).

**Exemplos:**

```sql
WHERE nome LIKE 'Ana%'

WHERE nome LIKE '%Silva'

WHERE nome LIKE '%Maria%'
```

##### _ (Underscore) - Exatamente Um Caractere

O `_` representa exatamente **um** caractere qualquer.

```sql
WHERE codigo LIKE 'A_'

WHERE telefone LIKE '11-9____-____'
```



### Exemplos Práticos com LIKE

Vamos usar uma tabela `clientes`:

| id | nome           | email                 | telefone      | cidade        |
|----|----------------|-----------------------|---------------|---------------|
| 1  | Ana Silva      | ana@email.com         | 11-99999-9999 | São Paulo     |
| 2  | João Santos    | joao.santos@email.com | 21-88888-8888 | Rio de Janeiro|
| 3  | Maria Costa    | maria@gmail.com       | 11-77777-7777 | São Paulo     |
| 4  | Pedro Lima     | pedro.lima@yahoo.com  | NULL          | Campinas      |
| 5  | Ana Beatriz    | anab@email.com        | 11-66666-6666 | São Bernardo  |

#### Exemplo 1: Clientes cujo Nome Começa com 'Ana'
```sql
SELECT nome, email 
FROM clientes 
WHERE nome LIKE 'Ana%';
```

**Resultado:**
| nome        | email          |
|-------------|----------------|
| Ana Silva   | ana@email.com  |
| Ana Beatriz | anab@email.com |

#### Exemplo 2: E-mails do Gmail
```sql
SELECT nome, email 
FROM clientes 
WHERE email LIKE '%gmail.com';
```

**Resultado:**
| nome        | email           |
|-------------|-----------------|
| Maria Costa | maria@gmail.com |

#### Exemplo 3: Cidades que Contêm 'São'
```sql
SELECT nome, cidade 
FROM clientes 
WHERE cidade LIKE '%São%';
```

**Resultado:**
| nome        | cidade       |
|-------------|--------------|
| Ana Silva   | São Paulo    |
| Maria Costa | São Paulo    |
| Ana Beatriz | São Bernardo |

#### Exemplo 4: Telefones de São Paulo (11)
```sql
SELECT nome, telefone 
FROM clientes 
WHERE telefone LIKE '11-%';
```

**Resultado:**
| nome        | telefone      |
|-------------|---------------|
| Ana Silva   | 11-99999-9999 |
| Maria Costa | 11-77777-7777 |
| Ana Beatriz | 11-66666-6666 |



### IS NULL e IS NOT NULL - Valores Ausentes

`NULL` em SQL significa "ausência de valor" - diferente de zero ou string vazia.

**⚠️ IMPORTANTE:** Você **NÃO** pode usar `=` ou `!=` com NULL. Deve usar `IS NULL` ou `IS NOT NULL`.

#### IS NULL - Encontrar Valores Ausentes

```sql
SELECT nome, telefone 
FROM clientes 
WHERE telefone IS NULL;
```

**Resultado:**
| nome       | telefone |
|------------|----------|
| Pedro Lima | NULL     |

#### IS NOT NULL - Encontrar Valores Presentes

```sql
SELECT nome, telefone 
FROM clientes 
WHERE telefone IS NOT NULL;
```

**Resultado:**
| nome        | telefone      |
|-------------|---------------|
| Ana Silva   | 11-99999-9999 |
| João Santos | 21-88888-8888 |
| Maria Costa | 11-77777-7777 |
| Ana Beatriz | 11-66666-6666 |



### Combinando LIKE com Outros Operadores

#### LIKE + AND
```sql
SELECT nome, cidade 
FROM clientes 
WHERE nome LIKE 'Ana%' AND cidade LIKE '%São%';
```

**Resultado:**
| nome        | cidade       |
|-------------|--------------|
| Ana Silva   | São Paulo    |
| Ana Beatriz | São Bernardo |

#### LIKE + OR
```sql
SELECT nome, email 
FROM clientes 
WHERE email LIKE '%gmail.com' OR email LIKE '%yahoo.com';
```

**Resultado:**
| nome        | email                |
|-------------|----------------------|
| Maria Costa | maria@gmail.com      |
| Pedro Lima  | pedro.lima@yahoo.com |

#### LIKE + IS NOT NULL
```sql
SELECT nome, telefone, cidade 
FROM clientes 
WHERE telefone IS NOT NULL AND cidade = 'São Paulo';
```

**Resultado:**
| nome        | telefone      | cidade    |
|-------------|---------------|-----------|
| Ana Silva   | 11-99999-9999 | São Paulo |
| Maria Costa | 11-77777-7777 | São Paulo |



### Casos Especiais e Dicas

#### Case Sensitivity
A sensibilidade a maiúsculas/minúsculas varia por banco de dados:
```sql
WHERE nome LIKE 'ana%'  -- Encontra 'Ana Silva'

WHERE nome ILIKE 'ana%'  -- Use ILIKE para ignorar case
```

#### Escape de Caracteres Especiais
Se você quiser buscar literalmente por `%` ou `_`:
```sql
WHERE nome LIKE '%\%%' ESCAPE '\'

WHERE codigo LIKE '%\_%' ESCAPE '\'
```

#### Performance
`LIKE` com `%` no início é lento em tabelas grandes:
```sql
WHERE nome LIKE '%Silva'

WHERE nome LIKE 'Silva%'
```

#### Valores NULL vs Vazios
```sql
WHERE campo = ''        -- String vazia
WHERE campo IS NULL     -- Valor ausente
WHERE campo IS NOT NULL AND campo != ''  -- Valor presente e não vazio
```



### Casos Práticos Comuns

#### Busca de Produtos
```sql
-- Busca por padrão no texto
SELECT * FROM produtos WHERE nome LIKE '%notebook%' OR nome LIKE '%laptop%';
```

#### Validação de Dados
```sql
-- Clientes sem dados cadastrados
SELECT * FROM usuarios WHERE email IS NULL OR email = '';
```

#### Busca por CEP
```sql
-- Busca por padrão no texto
SELECT * FROM enderecos WHERE cep LIKE '0%' OR cep LIKE '1%';
```

#### Limpeza de Dados
```sql
-- Clientes sem dados cadastrados
SELECT * FROM clientes WHERE telefone IS NULL AND endereco IS NULL;
```

Estes operadores são essenciais para trabalhar com dados reais, onde nem sempre temos informações completas ou sabemos exatamente o que estamos procurando!
