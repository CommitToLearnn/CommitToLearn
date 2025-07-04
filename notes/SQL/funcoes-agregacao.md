### Funções de Agregação - SUM, COUNT, MIN, MAX, AVG

**O que são Funções de Agregação?**

Funções de agregação são funções que pegam **múltiplos valores** de várias linhas e retornam **um único resultado**. São essenciais para análises, relatórios e estatísticas.

**Analogia:** Imagine que você tem as notas de todos os alunos de uma turma. As funções de agregação são como:
- `COUNT`: "Quantos alunos fizeram a prova?"
- `SUM`: "Qual a soma de todas as notas?"
- `AVG`: "Qual a média da turma?"
- `MIN`: "Qual a menor nota?"
- `MAX`: "Qual a maior nota?"



### COUNT - Contando Registros

`COUNT` conta quantas linhas existem.

#### Sintaxe:
```sql
COUNT(*)           -- Conta todas as linhas
COUNT(coluna)      -- Conta linhas onde a coluna não é NULL
COUNT(DISTINCT coluna)  -- Conta valores únicos
```

#### Exemplos:
Usando uma tabela `vendas`:

| id | vendedor    | produto  | quantidade | valor | regiao |
|----|-------------|----------|------------|-------|--------|
| 1  | Ana Silva   | Notebook | 2          | 3000  | SP     |
| 2  | João Santos | Mouse    | 10         | 500   | RJ     |
| 3  | Ana Silva   | Teclado  | 5          | 750   | SP     |
| 4  | Maria Costa | Notebook | 1          | 1500  | SP     |
| 5  | João Santos | Monitor  | 3          | 1200  | RJ     |

```sql
-- Contagem de registros
SELECT COUNT(*) AS total_vendas FROM vendas;
```
**Resultado:** 5

```sql
-- Contagem de registros
SELECT COUNT(DISTINCT vendedor) AS total_vendedores FROM vendas;
```
**Resultado:** 3



### SUM - Somando Valores

`SUM` soma todos os valores numéricos de uma coluna.

```sql
-- Soma de valores
SELECT SUM(valor) AS faturamento_total FROM vendas;
```
**Resultado:** 6950

```sql
-- Soma de valores
SELECT SUM(quantidade) AS quantidade_total FROM vendas;
```
**Resultado:** 21



### AVG - Calculando Média

`AVG` calcula a média aritmética dos valores.

```sql
-- Média de valores
SELECT AVG(valor) AS valor_medio FROM vendas;
```
**Resultado:** 1390

```sql
-- Média de valores
SELECT AVG(quantidade) AS quantidade_media FROM vendas;
```
**Resultado:** 4.2



### MIN e MAX - Menor e Maior Valor

`MIN` retorna o menor valor, `MAX` retorna o maior.

```sql
SELECT 
    MIN(valor) AS menor_venda,
    MAX(valor) AS maior_venda
FROM vendas;
```
**Resultado:**
| menor_venda | maior_venda |
|-------------|-------------|
| 500         | 3000        |

```sql
SELECT 
    MIN(id) AS primeira_venda,
    MAX(id) AS ultima_venda
FROM vendas;
```
**Resultado:**
| primeira_venda | ultima_venda |
|----------------|--------------|
| 1              | 5            |



### Combinando Múltiplas Funções

Você pode usar várias funções de agregação na mesma consulta:

```sql
SELECT 
    COUNT(*) AS total_vendas,
    COUNT(DISTINCT vendedor) AS total_vendedores,
    SUM(valor) AS faturamento_total,
    AVG(valor) AS valor_medio,
    MIN(valor) AS menor_venda,
    MAX(valor) AS maior_venda
FROM vendas;
```

**Resultado:**
| total_vendas | total_vendedores | faturamento_total | valor_medio | menor_venda | maior_venda |
|--------------|------------------|------------------|-------------|-------------|-------------|
| 5            | 3                | 6950             | 1390        | 500         | 3000        |



### Tratando Valores NULL

Funções de agregação ignoram valores NULL (exceto `COUNT(*)`):

Exemplo com tabela contendo NULL:

| id | vendedor | valor |
|----|----------|-------|
| 1  | Ana      | 1000  |
| 2  | João     | NULL  |
| 3  | Maria    | 2000  |

```sql
SELECT 
    COUNT(*) AS total_linhas,        -- Conta todas as linhas: 3
    COUNT(valor) AS vendas_com_valor, -- Conta apenas não-NULL: 2
    SUM(valor) AS soma_valores,       -- Soma apenas não-NULL: 3000
    AVG(valor) AS media_valores       -- Média apenas não-NULL: 1500
FROM vendas;
```



### Usando WHERE com Funções de Agregação

Você pode filtrar dados antes de agregar:

```sql
SELECT 
    COUNT(*) AS vendas_sp,
    SUM(valor) AS faturamento_sp,
    AVG(valor) AS valor_medio_sp
FROM vendas 
WHERE regiao = 'SP';
```

**Resultado:**
| vendas_sp | faturamento_sp | valor_medio_sp |
|-----------|----------------|----------------|
| 3         | 5250           | 1750           |



### Casos Práticos Comuns

#### Relatório de Vendas Mensais
```sql
SELECT 
    COUNT(*) AS total_vendas,
    SUM(valor) AS faturamento,
    AVG(valor) AS ticket_medio,
    MIN(valor) AS menor_venda,
    MAX(valor) AS maior_venda
FROM vendas 
WHERE data_venda >= '2023-01-01' AND data_venda < '2023-02-01';
```

#### Análise de Produtos
```sql
SELECT 
    COUNT(*) AS vendas_produto,
    SUM(quantidade) AS unidades_vendidas,
    AVG(preco) AS preco_medio
FROM vendas 
WHERE produto = 'Notebook';
```

#### Estatísticas de Clientes
```sql
SELECT 
    COUNT(*) AS total_clientes,
    COUNT(DISTINCT cidade) AS cidades_atendidas,
    AVG(idade) AS idade_media
FROM clientes;
```

#### Validação de Dados
```sql
SELECT 
    COUNT(*) AS total_registros,
    COUNT(email) AS com_email,
    COUNT(*) - COUNT(email) AS sem_email
FROM usuarios;
```



### Dicas Importantes

#### COUNT(*) vs COUNT(coluna)
```sql
COUNT(*)        -- Conta todas as linhas, incluindo com valores NULL
COUNT(coluna)   -- Conta apenas linhas onde a coluna não é NULL
```

#### Divisão por Zero
```sql
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN SUM(valor) / COUNT(*)
        ELSE 0
    END AS media_segura
FROM vendas;
```

#### Precisão em Cálculos
```sql
SELECT 
    ROUND(AVG(valor), 2) AS valor_medio,
    ROUND(SUM(valor), 2) AS faturamento_total
FROM vendas;
```

#### Performance
```sql
-- Contagem de registros
SELECT COUNT(*) FROM vendas;

-- Contagem de registros
SELECT COUNT(*) > 0 FROM vendas WHERE condicao;
```



### Preparando para GROUP BY

Estas funções ficam ainda mais poderosas quando combinadas com `GROUP BY`, que permite agrupar dados por categorias:

```sql
SELECT 
    vendedor,
    COUNT(*) AS vendas_por_vendedor,
    SUM(valor) AS faturamento_por_vendedor
FROM vendas
GROUP BY vendedor;
```

As funções de agregação são fundamentais para análise de dados e criação de relatórios. Elas transformam grandes volumes de dados em informações úteis e insights!
