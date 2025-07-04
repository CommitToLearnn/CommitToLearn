### WHERE - Filtrando Dados com Precisão

**O que é WHERE?**

A cláusula `WHERE` é como um "filtro" que permite especificar **quais registros** você quer ver. Sem ela, você veria todos os dados da tabela. Com ela, você vê apenas os dados que atendem às suas condições.

**Analogia:** É como pedir para o bibliotecário "me traga apenas os livros de ficção científica publicados após 2020". O `WHERE` é a parte "apenas os livros de ficção científica publicados após 2020".

### Sintaxe Básica

```sql
SELECT colunas
FROM tabela
WHERE condição;
```

**Exemplo:**
```sql
SELECT nome, salario
FROM funcionarios
WHERE departamento = 'TI';
```

### Operadores de Comparação

#### Igualdade (=)
```sql
SELECT * FROM funcionarios WHERE departamento = 'TI';
SELECT * FROM funcionarios WHERE idade = 30;
```

#### Diferente (<> ou !=)
```sql
SELECT * FROM funcionarios WHERE departamento <> 'TI';
SELECT * FROM funcionarios WHERE idade != 30;
```

#### Maior que (>)
```sql
SELECT * FROM funcionarios WHERE salario > 5000;
SELECT * FROM funcionarios WHERE idade > 30;
```

#### Maior ou igual (>=)
```sql
SELECT * FROM funcionarios WHERE salario >= 5000;
```

#### Menor que (<)
```sql
SELECT * FROM funcionarios WHERE idade < 30;
```

#### Menor ou igual (<=)
```sql
SELECT * FROM funcionarios WHERE idade <= 30;
```

### Vamos Praticar com Exemplos

Usando nossa tabela `funcionarios`:

| id | nome          | departamento | salario | idade |
|----|---------------|--------------|---------|-------|
| 1  | Ana Silva     | TI           | 5000    | 28    |
| 2  | João Santos   | Vendas       | 4200    | 35    |
| 3  | Maria Costa   | TI           | 5500    | 31    |
| 4  | Pedro Lima    | RH           | 4800    | 29    |

#### Exemplo: Funcionários do Departamento TI
```sql
SELECT nome, salario 
FROM funcionarios 
WHERE departamento = 'TI';
```

**Resultado:**
| nome        | salario |
|-------------|---------|
| Ana Silva   | 5000    |
| Maria Costa | 5500    |

#### Exemplo: Funcionários com Salário Maior que 5000
```sql
SELECT nome, salario 
FROM funcionarios 
WHERE salario > 5000;
```

**Resultado:**
| nome        | salario |
|-------------|---------|
| Maria Costa | 5500    |

#### Exemplo: Funcionários com Idade Menor que 30
```sql
SELECT nome, idade 
FROM funcionarios 
WHERE idade < 30;
```

**Resultado:**
| nome      | idade |
|-----------|-------|
| Ana Silva | 28    |
| Pedro Lima| 29    |



### Trabalhando com Texto

#### Aspas Simples para Strings
```sql
WHERE nome = 'Ana Silva'
WHERE departamento = 'TI'
```

#### Case Sensitivity
A maioria dos bancos de dados é case-sensitive para valores:
```sql
-- ✅ Correto
WHERE departamento = 'TI'

-- ❌ Pode não funcionar
WHERE departamento = 'ti'
```

### Trabalhando com Números

Números não precisam de aspas:
```sql
WHERE salario = 5000
WHERE idade > 30
WHERE id = 1
```

### Trabalhando com Datas

Datas normalmente precisam de aspas (formato varia por banco):
```sql
WHERE data_contratacao = '2023-01-15'
WHERE data_nascimento > '1990-01-01'
```

### Dicas Importantes

#### WHERE vem Depois de FROM
```sql
SELECT nome FROM funcionarios WHERE idade > 30;

SELECT nome WHERE idade > 30 FROM funcionarios;
```

#### Múltiplas Condições
Você pode combinar condições (veremos AND e OR na próxima anotação):
```sql
WHERE salario > 4000 AND departamento = 'TI'
```

#### Valores NULL
Para valores nulos, use `IS NULL` ou `IS NOT NULL`:
```sql
WHERE telefone IS NULL
WHERE email IS NOT NULL
```

#### Performance
Filtros em colunas indexadas são mais rápidos:
```sql
WHERE id = 1

WHERE nome = 'Ana Silva'
```

### Casos Comuns de Uso

#### Buscar por ID Específico
```sql
SELECT * FROM usuarios WHERE id = 123;
```

#### Filtrar por Faixa de Valores
```sql
SELECT * FROM produtos WHERE preco >= 100 AND preco <= 500;
```

#### Excluir Registros
```sql
SELECT * FROM funcionarios WHERE status <> 'inativo';
```

#### Filtrar por Data Recente
```sql
SELECT * FROM pedidos WHERE data_pedido >= '2023-01-01';
```



A cláusula `WHERE` é essencial para trabalhar com dados reais, pois raramente você quer ver **todos** os registros de uma tabela. É através dela que você faz consultas específicas e úteis!
