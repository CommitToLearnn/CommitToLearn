### COALESCE - Lidando com Valores NULL de Forma Elegante

**O que é COALESCE?**

`COALESCE` é uma função SQL que retorna o **primeiro valor não-NULL** de uma lista de valores. É extremamente útil para substituir valores NULL por valores padrão ou para escolher entre várias colunas que podem ter valores ausentes.

**Analogia:** Imagine que você tem uma lista de telefones de contato (residencial, celular, trabalho) e quer usar o primeiro que estiver disponível. O `COALESCE` faz exatamente isso com dados.



### Sintaxe Básica

```sql
COALESCE(valor1, valor2, valor3, ..., valorPadrão)
```

**Como funciona:**
- Verifica `valor1` - se não for NULL, retorna ele
- Se `valor1` for NULL, verifica `valor2` - se não for NULL, retorna ele
- Continua até encontrar um valor não-NULL
- Se todos forem NULL, retorna NULL (a menos que você ponha um valor padrão no final)



### Exemplos Básicos

#### Exemplo 1: Valor Padrão para NULL
```sql
SELECT 
    nome,
    COALESCE(telefone, 'Não informado') AS telefone_contato
FROM clientes;
```

#### Exemplo 2: Escolher Entre Múltiplas Colunas
```sql
SELECT 
    nome,
    COALESCE(telefone_celular, telefone_residencial, telefone_trabalho, 'Sem telefone') AS melhor_telefone
FROM clientes;
```



### Exemplos Práticos

Vamos usar uma tabela `funcionarios` com alguns valores NULL:

| id | nome          | telefone_celular | telefone_residencial | telefone_trabalho | salario | bonus |
|----|---------------|------------------|----------------------|------------------|---------|-------|
| 1  | Ana Silva     | 11-99999-9999    | NULL                 | 11-3333-3333     | 5000    | 500   |
| 2  | João Santos   | NULL             | 21-2222-2222        | NULL             | 4200    | NULL  |
| 3  | Maria Costa   | 11-88888-8888    | 11-4444-4444        | 11-5555-5555     | 5500    | 800   |
| 4  | Pedro Lima    | NULL             | NULL                 | NULL             | 4800    | NULL  |

#### Exemplo 1: Telefone Principal
```sql
SELECT 
    nome,
    COALESCE(telefone_celular, telefone_residencial, telefone_trabalho, 'Sem telefone') AS telefone_principal
FROM funcionarios;
```

**Resultado:**
| nome          | telefone_principal |
|---------------|--------------------|
| Ana Silva     | 11-99999-9999      |
| João Santos   | 21-2222-2222       |
| Maria Costa   | 11-88888-8888      |
| Pedro Lima    | Sem telefone       |

#### Exemplo 2: Salário com Bônus (Tratando NULL como 0)
```sql
SELECT 
    nome,
    salario,
    COALESCE(bonus, 0) AS bonus_real,
    salario + COALESCE(bonus, 0) AS salario_total
FROM funcionarios;
```

**Resultado:**
| nome          | salario | bonus_real | salario_total |
|---------------|---------|------------|---------------|
| Ana Silva     | 5000    | 500        | 5500          |
| João Santos   | 4200    | 0          | 4200          |
| Maria Costa   | 5500    | 800        | 6300          |
| Pedro Lima    | 4800    | 0          | 4800          |



### COALESCE vs CASE WHEN

`COALESCE` é mais limpo para casos simples, mas `CASE WHEN` é mais poderoso para lógica complexa.

#### Estas consultas fazem a mesma coisa:

**Com COALESCE:**
```sql
-- Substitui valores NULL
SELECT nome, COALESCE(telefone, 'Não informado') AS telefone
FROM clientes;
```

**Com CASE WHEN:**
```sql
SELECT nome,
    CASE 
        WHEN telefone IS NULL THEN 'Não informado'
        ELSE telefone
    END AS telefone
FROM clientes;
```



### Casos Avançados

#### Múltiplas Colunas com Lógica
```sql
SELECT 
    COALESCE(nome_preferido, nome_completo, 'Usuário') AS nome_exibir,
    email
FROM usuarios;
```

#### Cálculos com Valores NULL
```sql
SELECT 
    vendedor,
    COALESCE(comissao_mes, 0) + COALESCE(bonus_meta, 0) + COALESCE(comissao_extra, 0) AS comissao_total
FROM vendas;
```

#### Concatenação Segura
```sql
SELECT 
    COALESCE(endereco + ', ', '') + 
    COALESCE(cidade + ', ', '') + 
    COALESCE(estado, '') AS endereco_completo
FROM enderecos;
```



### COALESCE em Condições WHERE

Você também pode usar `COALESCE` dentro de condições:

```sql
SELECT nome 
FROM funcionarios 
WHERE COALESCE(telefone_celular, telefone_residencial, telefone_trabalho, '') LIKE '%11%';
```

```sql
SELECT nome, salario, bonus
FROM funcionarios 
WHERE salario + COALESCE(bonus, 0) > 5000;
```



### Dicas Importantes

#### Tipos de Dados
Todos os valores no `COALESCE` devem ser do mesmo tipo:
```sql
COALESCE(telefone, 'Não informado')

COALESCE(telefone, 0)  -- telefone é string, 0 é número
```

#### Performance
`COALESCE` é geralmente muito rápido, mas em consultas complexas pode ser otimizado:
```sql
COALESCE(campo_mais_preenchido, campo_menos_preenchido, 'padrão')
```

#### Diferença entre NULL e String Vazia
```sql
COALESCE(campo, 'padrão')  -- Não substitui '' por 'padrão'

COALESCE(NULLIF(campo, ''), 'padrão')
```

#### Usar com Agregações
```sql
SELECT 
    departamento,
    SUM(COALESCE(bonus, 0)) AS total_bonus
FROM funcionarios 
GROUP BY departamento;
```



### Casos Práticos Comuns

#### Relatórios com Valores Padrão
```sql
SELECT 
    produto,
    categoria,
    COALESCE(preco_promocional, preco_normal, 0) AS preco_final
FROM produtos;
```

#### Consolidação de Dados
```sql
SELECT 
    cliente,
    COALESCE(endereco_entrega, endereco_cobranca, endereco_cadastro) AS endereco_principal
FROM clientes;
```

#### Limpeza de Dados para Relatórios
```sql
SELECT 
    nome,
    COALESCE(departamento, 'Não definido') AS departamento,
    COALESCE(cargo, 'Não definido') AS cargo
FROM funcionarios;
```

#### Cálculos Financeiros
```sql
SELECT 
    produto,
    preco,
    COALESCE(desconto, 0) AS desconto_aplicado,
    preco - COALESCE(desconto, 0) AS preco_final
FROM produtos;
```

`COALESCE` é uma ferramenta essencial para trabalhar com dados reais, onde valores NULL são comuns e precisam ser tratados de forma elegante e consistente!
