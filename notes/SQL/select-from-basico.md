### SELECT e FROM - Os Fundamentos das Consultas SQL

**O que são SELECT e FROM?**

O `SELECT` e `FROM` são as duas cláusulas mais fundamentais do SQL. Elas formam a base de praticamente todas as consultas que você vai escrever.

**Analogia:** Pense no SQL como uma conversa com um bibliotecário. O `FROM` é como dizer "vá até aquela estante específica" e o `SELECT` é como dizer "me traga essas informações específicas dos livros".

### A Cláusula FROM - Especificando a Fonte dos Dados

O `FROM` especifica **de onde** os dados devem vir. É sempre uma tabela (ou múltiplas tabelas).

**Sintaxe Básica:**
```sql
FROM nome_da_tabela
```

**Exemplo:**
```sql
FROM usuarios
FROM produtos  
FROM pedidos
```

### A Cláusula SELECT - Escolhendo o que Mostrar

O `SELECT` especifica **quais colunas** você quer ver no resultado da consulta.

#### Selecionando Todas as Colunas (*)

O asterisco `*` significa "todas as colunas".

```sql
SELECT * 
FROM usuarios;
```

**Resultado:** Mostra todas as colunas da tabela `usuarios`.

#### Selecionando Colunas Específicas

Você pode especificar exatamente quais colunas quer ver:

```sql
SELECT nome, email 
FROM usuarios;
```

**Resultado:** Mostra apenas as colunas `nome` e `email`.

#### Selecionando com Alias (Apelidos)

Você pode dar "apelidos" às colunas para tornar o resultado mais legível:

```sql
SELECT 
    nome AS 'Nome do Usuário',
    email AS 'E-mail',
    idade AS 'Idade'
FROM usuarios;
```

### Exemplos Práticos

Vamos usar uma tabela de exemplo chamada `funcionarios`:

| id | nome          | departamento | salario | idade |
|----|---------------|--------------|---------|-------|
| 1  | Ana Silva     | TI           | 5000    | 28    |
| 2  | João Santos   | Vendas       | 4200    | 35    |
| 3  | Maria Costa   | TI           | 5500    | 31    |
| 4  | Pedro Lima    | RH           | 4800    | 29    |

#### Exemplo 1: Buscar Todos os Dados
```sql
SELECT * 
FROM funcionarios;
```

**Resultado:** Todas as 5 colunas de todos os funcionários.

#### Exemplo 2: Buscar Apenas Nomes e Salários
```sql
SELECT nome, salario 
FROM funcionarios;
```

**Resultado:**
| nome          | salario |
|---------------|---------|
| Ana Silva     | 5000    |
| João Santos   | 4200    |
| Maria Costa   | 5500    |
| Pedro Lima    | 4800    |

#### Exemplo 3: Usando Alias para Melhor Legibilidade
```sql
SELECT 
    nome AS 'Funcionário',
    departamento AS 'Setor',
    salario AS 'Salário (R$)'
FROM funcionarios;
```

**Resultado:**
| Funcionário   | Setor  | Salário (R$) |
|---------------|--------|--------------|
| Ana Silva     | TI     | 5000         |
| João Santos   | Vendas | 4200         |
| Maria Costa   | TI     | 5500         |
| Pedro Lima    | RH     | 4800         |

### Dicas Importantes

#### Ordem das Cláusulas
`SELECT` sempre vem antes de `FROM`:
```sql
-- ✅ Correto
SELECT nome FROM funcionarios;

-- ❌ Erro
FROM funcionarios SELECT nome;
```

#### Múltiplas Colunas
Separe as colunas com vírgula:
```sql
SELECT nome, idade, salario FROM funcionarios;
```

#### Evite SELECT * em Produção
Embora `SELECT *` seja útil para testes, evite em aplicações reais:
- **Mais lento:** Traz dados desnecessários
- **Maior uso de rede:** Transfere mais dados
- **Menos legível:** Não fica claro quais dados você realmente precisa

#### Case Sensitivity
SQL não diferencia maiúsculas de minúsculas para palavras-chave:
```sql
SELECT nome FROM funcionarios;
select nome from funcionarios;
Select Nome From Funcionarios;
```

### Próximos Passos

Com `SELECT` e `FROM`, você já consegue fazer consultas básicas. Os próximos conceitos que complementam essas consultas são:

- **WHERE:** Para filtrar dados específicos
- **ORDER BY:** Para ordenar resultados
- **LIMIT:** Para limitar quantidade de resultados

Estes dois comandos são a fundação sobre a qual todos os outros conceitos SQL se constroem!
