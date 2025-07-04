### JOINS - Combinando Dados de Múltiplas Tabelas

**O que são JOINS?**

JOINS permitem combinar dados de **duas ou mais tabelas** relacionadas em uma única consulta. É uma das funcionalidades mais poderosas do SQL, permitindo que você trabalhe com dados normalizados e relacionais.

**Analogia:** Imagine que você tem dois fichários: um com informações de funcionários (nome, cargo) e outro com departamentos (nome do departamento, localização). Um JOIN é como juntar essas informações para criar um relatório completo: "João Silva, Analista, Departamento de TI, São Paulo".

### Por que Usar JOINS?

Em bancos relacionais, os dados são normalizados (separados em tabelas diferentes) para evitar redundância. Os JOINS permitem reunir essas informações relacionadas quando necessário.

### Tabelas de Exemplo

Vamos trabalhar com duas tabelas relacionadas:

**Tabela `funcionarios`:**
| id | nome          | departamento_id | salario |
|----|---------------|-----------------|---------|
| 1  | Ana Silva     | 1               | 5000    |
| 2  | João Santos   | 2               | 4200    |
| 3  | Maria Costa   | 1               | 5500    |
| 4  | Pedro Lima    | 3               | 4800    |
| 5  | Carlos Rocha  | 2               | 3200    |

**Tabela `departamentos`:**
| id | nome     | localizacao  |
|----|----------|--------------|
| 1  | TI       | São Paulo    |
| 2  | Vendas   | Rio de Janeiro |
| 3  | RH       | São Paulo    |
| 4  | Marketing| Brasília     |

### INNER JOIN - Apenas Registros que Combinam

O `INNER JOIN` retorna apenas registros que têm correspondência em **ambas** as tabelas.

**Sintaxe:**
```sql
SELECT colunas
FROM tabela1
INNER JOIN tabela2 ON tabela1.coluna = tabela2.coluna;
```

**Exemplo:**
```sql
SELECT 
    funcionarios.nome,
    funcionarios.salario,
    departamentos.nome AS departamento,
    departamentos.localizacao
FROM funcionarios
INNER JOIN departamentos ON funcionarios.departamento_id = departamentos.id;
```

**Resultado:**
| nome          | salario | departamento | localizacao     |
|---------------|---------|--------------|-----------------|
| Ana Silva     | 5000    | TI           | São Paulo       |
| João Santos   | 4200    | Vendas       | Rio de Janeiro  |
| Maria Costa   | 5500    | TI           | São Paulo       |
| Pedro Lima    | 4800    | RH           | São Paulo       |
| Carlos Rocha  | 3200    | Vendas       | Rio de Janeiro  |

**Observe:** O departamento de Marketing não aparece porque nenhum funcionário está associado a ele.

### LEFT JOIN - Todos os Registros da Tabela da Esquerda

O `LEFT JOIN` retorna **todos** os registros da primeira tabela (esquerda) e os correspondentes da segunda tabela (direita). Se não houver correspondência, os campos da tabela da direita aparecerão como NULL.

**Exemplo:**
```sql
SELECT 
    departamentos.nome AS departamento,
    departamentos.localizacao,
    funcionarios.nome AS funcionario,
    funcionarios.salario
FROM departamentos
LEFT JOIN funcionarios ON departamentos.id = funcionarios.departamento_id;
```

**Resultado:**
| departamento | localizacao     | funcionario  | salario |
|--------------|-----------------|--------------|---------|
| TI           | São Paulo       | Ana Silva    | 5000    |
| TI           | São Paulo       | Maria Costa  | 5500    |
| Vendas       | Rio de Janeiro  | João Santos  | 4200    |
| Vendas       | Rio de Janeiro  | Carlos Rocha | 3200    |
| RH           | São Paulo       | Pedro Lima   | 4800    |
| Marketing    | Brasília        | NULL         | NULL    |

**Observe:** Marketing aparece mesmo sem funcionários associados.

### RIGHT JOIN - Todos os Registros da Tabela da Direita

O `RIGHT JOIN` é o oposto do LEFT JOIN - retorna todos os registros da segunda tabela (direita).

**Exemplo:**
```sql
SELECT 
    funcionarios.nome,
    funcionarios.salario,
    departamentos.nome AS departamento
FROM departamentos
RIGHT JOIN funcionarios ON departamentos.id = funcionarios.departamento_id;
```

Este exemplo retornaria todos os funcionários, mesmo se algum não tivesse departamento associado.

### FULL OUTER JOIN - Todos os Registros de Ambas as Tabelas

O `FULL OUTER JOIN` retorna registros de ambas as tabelas, incluindo aqueles sem correspondência.

**Exemplo:**
```sql
SELECT 
    funcionarios.nome,
    departamentos.nome AS departamento
FROM funcionarios
FULL OUTER JOIN departamentos ON funcionarios.departamento_id = departamentos.id;
```

### Usando Aliases para Simplificar

Para consultas mais legíveis, use aliases (apelidos) para as tabelas:

```sql
SELECT 
    f.nome AS funcionario,
    f.salario,
    d.nome AS departamento,
    d.localizacao
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id;
```

### JOIN com Múltiplas Tabelas

Você pode combinar mais de duas tabelas:

**Tabela `projetos`:**
| id | nome_projeto   | funcionario_id |
|----|----------------|----------------|
| 1  | Sistema Web    | 1              |
| 2  | App Mobile     | 3              |
| 3  | Análise Dados  | 1              |

**Exemplo com 3 tabelas:**
```sql
SELECT 
    f.nome AS funcionario,
    d.nome AS departamento,
    p.nome_projeto
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id
INNER JOIN projetos p ON f.id = p.funcionario_id;
```

**Resultado:**
| funcionario | departamento | nome_projeto  |
|-------------|--------------|---------------|
| Ana Silva   | TI           | Sistema Web   |
| Ana Silva   | TI           | Análise Dados |
| Maria Costa | TI           | App Mobile    |

### JOIN com Condições Adicionais

Você pode adicionar condições extras além da relação:

```sql
SELECT 
    f.nome,
    f.salario,
    d.nome AS departamento
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id
WHERE f.salario > 4500 AND d.localizacao = 'São Paulo';
```

### Casos Práticos Comuns

#### Relatório de Funcionários por Localização
```sql
SELECT 
    d.localizacao,
    COUNT(f.id) AS total_funcionarios,
    AVG(f.salario) AS salario_medio
FROM departamentos d
LEFT JOIN funcionarios f ON d.id = f.departamento_id
GROUP BY d.localizacao;
```

#### Departamentos sem Funcionários
```sql
SELECT d.nome AS departamento_vazio
FROM departamentos d
LEFT JOIN funcionarios f ON d.id = f.departamento_id
WHERE f.id IS NULL;
```

#### Top Funcionários por Departamento
```sql
SELECT 
    d.nome AS departamento,
    f.nome AS funcionario,
    f.salario
FROM funcionarios f
INNER JOIN departamentos d ON f.departamento_id = d.id
WHERE f.salario = (
    SELECT MAX(f2.salario)
    FROM funcionarios f2
    WHERE f2.departamento_id = f.departamento_id
);
```

### Dicas Importantes

#### Performance
```sql
CREATE INDEX idx_funcionarios_dept ON funcionarios(departamento_id);
CREATE INDEX idx_departamentos_id ON departamentos(id);
```

#### Especificar Colunas Ambíguas
```sql
SELECT id, nome FROM funcionarios f INNER JOIN departamentos d ...

SELECT f.id, f.nome FROM funcionarios f INNER JOIN departamentos d ...
```

#### NULL em JOINs
```sql
-- Contagem de registros
SELECT COUNT(*) FROM funcionarios WHERE departamento_id IS NULL;
```

#### Ordem dos JOINs
```sql
FROM tabela_menor t1
INNER JOIN tabela_maior t2 ON ...
```

### Tipos de JOIN Resumidos

| Tipo JOIN    | Descrição                                    |
|--------------|----------------------------------------------|
| INNER JOIN   | Apenas registros que combinam                |
| LEFT JOIN    | Todos da esquerda + correspondentes direita  |
| RIGHT JOIN   | Todos da direita + correspondentes esquerda |
| FULL OUTER   | Todos de ambas as tabelas                    |

### Casos de Uso por Tipo

- **INNER JOIN:** Relatórios onde você só quer dados completos
- **LEFT JOIN:** Quando quer manter todos os registros principais
- **RIGHT JOIN:** Raramente usado, LEFT JOIN é preferido
- **FULL OUTER JOIN:** Análises completas, auditoria de dados

Os JOINS são fundamentais para trabalhar com bancos relacionais e permitem criar consultas poderosas que combinam informações de múltiplas fontes!
