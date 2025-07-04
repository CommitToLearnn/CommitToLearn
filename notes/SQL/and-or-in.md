### AND, OR e IN - Combinando Condições no WHERE

**Por que Combinar Condições?**

Na vida real, raramente queremos dados baseados em apenas uma condição. Normalmente queremos coisas como:
- "Funcionários do TI **E** com salário maior que 5000"
- "Produtos da categoria eletrônicos **OU** categoria livros"  
- "Usuários que moram **EM** São Paulo, Rio de Janeiro ou Brasília"

É aqui que entram os operadores `AND`, `OR` e `IN`.

### Operador AND - "E" Lógico

O `AND` significa que **TODAS** as condições devem ser verdadeiras.

**Sintaxe:**
```sql
WHERE condição1 AND condição2 AND condição3...
```

**Analogia:** É como uma lista de exigências para um emprego. Você precisa atender **TODAS** para ser contratado.

#### Exemplos com AND

Usando nossa tabela `funcionarios`:

| id | nome          | departamento | salario | idade |
|----|---------------|--------------|---------|-------|
| 1  | Ana Silva     | TI           | 5000    | 28    |
| 2  | João Santos   | Vendas       | 4200    | 35    |
| 3  | Maria Costa   | TI           | 5500    | 31    |
| 4  | Pedro Lima    | RH           | 4800    | 29    |

```sql
-- Funcionários do TI E com salário maior que 5000
SELECT nome, departamento, salario 
FROM funcionarios 
WHERE departamento = 'TI' AND salario > 5000;
```

**Resultado:**
| nome        | departamento | salario |
|-------------|-------------|---------|
| Maria Costa | TI          | 5500    |

```sql
-- Funcionários com idade menor que 30 E do departamento TI
SELECT nome, idade, departamento 
FROM funcionarios 
WHERE idade < 30 AND departamento = 'TI';
```

**Resultado:**
| nome      | idade | departamento |
|-----------|-------|-------------|
| Ana Silva | 28    | TI          |

### Operador OR - "OU" Lógico

O `OR` significa que **PELO MENOS UMA** das condições deve ser verdadeira.

**Sintaxe:**
```sql
WHERE condição1 OR condição2 OR condição3...
```

**Analogia:** É como um cupom de desconto que vale para roupas **OU** sapatos **OU** acessórios. Você só precisa comprar uma dessas categorias.

#### Exemplos com OR

```sql
-- Funcionários do TI OU do RH
SELECT nome, departamento 
FROM funcionarios 
WHERE departamento = 'TI' OR departamento = 'RH';
```

**Resultado:**
| nome        | departamento |
|-------------|-------------|
| Ana Silva   | TI          |
| Maria Costa | TI          |
| Pedro Lima  | RH          |

```sql
SELECT nome, idade, salario 
FROM funcionarios 
-- Funcionários com menos de 30 anos OU salário maior que 5000
WHERE idade < 30 OR salario > 5000;
```

**Resultado:**
| nome        | idade | salario |
|-------------|-------|---------|
| Ana Silva   | 28    | 5000    |
| Maria Costa | 31    | 5500    |
| Pedro Lima  | 29    | 4800    |

### Operador IN - "Está Na Lista"

O `IN` é um atalho para múltiplas condições `OR` quando você quer verificar se um valor está dentro de uma lista específica.

**Sintaxe:**
```sql
WHERE coluna IN (valor1, valor2, valor3...)
```

**Analogia:** É como uma lista VIP de uma festa. Se seu nome está na lista, você entra.

#### Exemplos com IN

```sql
SELECT nome, departamento 
FROM funcionarios 
-- Funcionários dos departamentos especificados
WHERE departamento IN ('TI', 'RH', 'Vendas');
```

**Resultado:**
| nome          | departamento |
|---------------|-------------|
| Ana Silva     | TI          |
| João Santos   | Vendas      |
| Maria Costa   | TI          |
| Pedro Lima    | RH          |

```sql
SELECT nome, idade 
FROM funcionarios 
WHERE idade IN (28, 31, 35);
```

**Resultado:**
| nome          | idade |
|---------------|-------|
| Ana Silva     | 28    |
| João Santos   | 35    |
| Maria Costa   | 31    |

#### IN vs OR - Comparação

Estas duas consultas fazem a mesma coisa:

```sql
WHERE departamento = 'TI' OR departamento = 'RH' OR departamento = 'Vendas'

WHERE departamento IN ('TI', 'RH', 'Vendas')
```

### Combinando AND, OR e IN

Você pode combinar todos esses operadores, mas precisa ter cuidado com a precedência.

#### Exemplo 1: AND com IN
```sql
SELECT nome, departamento, salario 
FROM funcionarios 
WHERE departamento IN ('TI', 'RH') AND salario > 4500;
```

**Resultado:**
| nome        | departamento | salario |
|-------------|-------------|---------|
| Ana Silva   | TI          | 5000    |
| Maria Costa | TI          | 5500    |
| Pedro Lima  | RH          | 4800    |

#### Exemplo 2: Usando Parênteses para Clareza
```sql
SELECT nome, idade, departamento 
FROM funcionarios 
WHERE (departamento = 'TI' AND idade < 30) OR (idade > 35);
```

### Operador NOT IN - "Não Está Na Lista"

O `NOT IN` é o oposto do `IN` - pega tudo que **NÃO** está na lista.

```sql
SELECT nome, departamento 
FROM funcionarios 
WHERE departamento NOT IN ('TI', 'RH');
```

**Resultado:**
| nome          | departamento |
|---------------|-------------|
| João Santos   | Vendas      |

### Dicas Importantes

#### Precedência dos Operadores
`AND` tem precedência maior que `OR`. Use parênteses para clareza:
```sql
WHERE salario > 5000 OR departamento = 'TI' AND idade < 30

WHERE salario > 5000 OR (departamento = 'TI' AND idade < 30)
```

#### Performance
- `IN` é geralmente mais eficiente que múltiplos `OR`
- Condições mais seletivas devem vir primeiro no `AND`

#### Valores NULL
Cuidado com valores NULL:
```sql
WHERE departamento IN ('TI', 'RH')

WHERE departamento IN ('TI', 'RH') OR departamento IS NULL
```

#### Aspas em Strings
Lembre-se das aspas para valores de texto:
```sql
WHERE departamento IN ('TI', 'RH')  -- ✅ Correto
WHERE departamento IN (TI, RH)      -- ❌ Erro
```

### Casos Práticos Comuns

#### Filtro de Status Ativos
```sql
WHERE status IN ('ativo', 'pendente') AND data_criacao >= '2023-01-01'
```

#### Exclusão de Registros de Teste
```sql
WHERE email NOT IN ('teste@teste.com', 'admin@admin.com')
```

#### Faixa de Valores com Múltiplas Condições
```sql
WHERE (salario >= 3000 AND salario <= 6000) AND departamento IN ('TI', 'Engenharia')
```

Estes operadores são fundamentais para criar consultas precisas e úteis. Eles transformam o SQL de uma ferramenta básica em uma ferramenta poderosa para análise de dados!
