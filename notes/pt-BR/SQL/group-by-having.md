### GROUP BY e HAVING - Agrupando e Filtrando Dados Agregados

**O que é GROUP BY?**

`GROUP BY` permite **agrupar linhas** que têm valores iguais em colunas específicas e aplicar funções de agregação a cada grupo. É como separar dados em "caixinhas" e fazer cálculos em cada caixinha.

**Analogia:** Imagine que você tem uma pilha de notas fiscais de vendas e quer organizá-las por vendedor. O `GROUP BY` faz isso - agrupa todas as vendas de cada vendedor e permite calcular totais, médias, etc. para cada um.



### Sintaxe Básica do GROUP BY

```sql
SELECT coluna_agrupamento, função_agregação(coluna)
FROM tabela
WHERE condição          -- Opcional: filtro ANTES do agrupamento
GROUP BY coluna_agrupamento
HAVING condição_grupo   -- Opcional: filtro DEPOIS do agrupamento
ORDER BY coluna;        -- Opcional: ordenação do resultado
```



### Exemplos Básicos com GROUP BY

Usando nossa tabela `vendas`:

| id | vendedor    | produto  | quantidade | valor | regiao |
|----|-------------|----------|------------|-------|--------|
| 1  | Ana Silva   | Notebook | 2          | 3000  | SP     |
| 2  | João Santos | Mouse    | 10         | 500   | RJ     |
| 3  | Ana Silva   | Teclado  | 5          | 750   | SP     |
| 4  | Maria Costa | Notebook | 1          | 1500  | SP     |
| 5  | João Santos | Monitor  | 3          | 1200  | RJ     |

#### Exemplo 1: Vendas por Vendedor
```sql
SELECT 
    vendedor,
    COUNT(*) AS total_vendas,
    SUM(valor) AS faturamento_total
FROM vendas
GROUP BY vendedor;
```

**Resultado:**
| vendedor    | total_vendas | faturamento_total |
|-------------|--------------|-------------------|
| Ana Silva   | 2            | 3750              |
| João Santos | 2            | 1700              |
| Maria Costa | 1            | 1500              |

#### Exemplo 2: Vendas por Região
```sql
SELECT 
    regiao,
    COUNT(*) AS vendas_regiao,
    AVG(valor) AS valor_medio
FROM vendas
GROUP BY regiao;
```

**Resultado:**
| regiao | vendas_regiao | valor_medio |
|--------|---------------|-------------|
| SP     | 3             | 1750        |
| RJ     | 2             | 850         |

#### Exemplo 3: Múltiplas Colunas de Agrupamento
```sql
SELECT 
    vendedor,
    regiao,
    COUNT(*) AS vendas,
    SUM(valor) AS faturamento
FROM vendas
GROUP BY vendedor, regiao;
```

**Resultado:**
| vendedor    | regiao | vendas | faturamento |
|-------------|--------|--------|-------------|
| Ana Silva   | SP     | 2      | 3750        |
| João Santos | RJ     | 2      | 1700        |
| Maria Costa | SP     | 1      | 1500        |



### HAVING - Filtrando Grupos

`HAVING` é como `WHERE`, mas funciona **depois** do agrupamento. Use para filtrar grupos baseados em resultados de funções de agregação.

**Diferença principal:**
- `WHERE` filtra linhas **ANTES** do agrupamento
- `HAVING` filtra grupos **DEPOIS** do agrupamento

#### Exemplo 1: Vendedores com Mais de 1 Venda
```sql
SELECT 
    vendedor,
    COUNT(*) AS total_vendas,
    SUM(valor) AS faturamento
FROM vendas
GROUP BY vendedor
HAVING COUNT(*) > 1;
```

**Resultado:**
| vendedor    | total_vendas | faturamento |
|-------------|--------------|-------------|
| Ana Silva   | 2            | 3750        |
| João Santos | 2            | 1700        |

#### Exemplo 2: Regiões com Faturamento Maior que 2000
```sql
SELECT 
    regiao,
    SUM(valor) AS faturamento_total
FROM vendas
GROUP BY regiao
HAVING SUM(valor) > 2000;
```

**Resultado:**
| regiao | faturamento_total |
|--------|------------------|
| SP     | 5250             |

#### Exemplo 3: Combinando WHERE e HAVING
```sql
SELECT 
    vendedor,
    COUNT(*) AS vendas_grandes
FROM vendas
WHERE valor > 1000          -- Filtra ANTES do agrupamento
GROUP BY vendedor
HAVING COUNT(*) > 1;        -- Filtra DEPOIS do agrupamento
```

**Resultado:**
| vendedor  | vendas_grandes |
|-----------|----------------|
| Ana Silva | 2              |



### Casos Práticos Avançados

#### Top 3 Vendedores
```sql
SELECT 
    vendedor,
    SUM(valor) AS faturamento_total
FROM vendas
GROUP BY vendedor
ORDER BY SUM(valor) DESC
LIMIT 3;
```

#### Produtos Mais Vendidos por Região
```sql
SELECT 
    regiao,
    produto,
    SUM(quantidade) AS total_vendido
FROM vendas
GROUP BY regiao, produto
ORDER BY regiao, total_vendido DESC;
```

#### Análise de Performance de Vendedores
```sql
SELECT 
    vendedor,
    COUNT(*) AS numero_vendas,
    SUM(valor) AS faturamento,
    AVG(valor) AS ticket_medio,
    MIN(valor) AS menor_venda,
    MAX(valor) AS maior_venda
FROM vendas
GROUP BY vendedor
HAVING COUNT(*) >= 2        -- Apenas vendedores com 2+ vendas
ORDER BY faturamento DESC;
```

#### Relatório Mensal de Vendas
```sql
SELECT 
    YEAR(data_venda) AS ano,
    MONTH(data_venda) AS mes,
    COUNT(*) AS total_vendas,
    SUM(valor) AS faturamento,
    COUNT(DISTINCT vendedor) AS vendedores_ativos
FROM vendas
GROUP BY YEAR(data_venda), MONTH(data_venda)
HAVING SUM(valor) > 10000   -- Apenas meses com faturamento > 10k
ORDER BY ano, mes;
```



### Erros Comuns e Como Evitar

#### Colunas não Agregadas no SELECT
```sql
SELECT vendedor, produto, COUNT(*)
FROM vendas
GROUP BY vendedor;

SELECT vendedor, produto, COUNT(*)
FROM vendas
GROUP BY vendedor, produto;
```

#### Usar WHERE com Funções de Agregação
```sql
SELECT vendedor, COUNT(*)
FROM vendas
WHERE COUNT(*) > 1
GROUP BY vendedor;

SELECT vendedor, COUNT(*)
FROM vendas
GROUP BY vendedor
HAVING COUNT(*) > 1;
```

#### Ordem das Cláusulas
```sql
SELECT vendedor, COUNT(*)
FROM vendas
WHERE valor > 100           -- 1. WHERE (filtra linhas)
GROUP BY vendedor           -- 2. GROUP BY (agrupa)
HAVING COUNT(*) > 1         -- 3. HAVING (filtra grupos)
ORDER BY COUNT(*) DESC;     -- 4. ORDER BY (ordena resultado)
```



### Funções de Agregação Avançadas com GROUP BY

#### COUNT DISTINCT para Valores Únicos
```sql
SELECT 
    regiao,
    COUNT(DISTINCT produto) AS produtos_diferentes,
    COUNT(DISTINCT vendedor) AS vendedores_ativos
FROM vendas
GROUP BY regiao;
```

#### Percentuais com Subquery
```sql
SELECT 
    vendedor,
    SUM(valor) AS faturamento,
-- Soma de valores
    ROUND(SUM(valor) * 100.0 / (SELECT SUM(valor) FROM vendas), 2) AS percentual_faturamento
FROM vendas
GROUP BY vendedor;
```

#### Agrupamento por Faixas
```sql
SELECT 
    CASE 
        WHEN valor < 1000 THEN 'Baixo'
        WHEN valor < 2000 THEN 'Médio'
        ELSE 'Alto'
    END AS faixa_valor,
    COUNT(*) AS quantidade_vendas
FROM vendas
GROUP BY 
    CASE 
        WHEN valor < 1000 THEN 'Baixo'
        WHEN valor < 2000 THEN 'Médio'
        ELSE 'Alto'
    END;
```



### Dicas de Performance

#### Índices nas Colunas de GROUP BY
```sql
CREATE INDEX idx_vendedor ON vendas(vendedor);
```

#### WHERE antes de GROUP BY
```sql
SELECT vendedor, COUNT(*)
FROM vendas
WHERE data_venda >= '2023-01-01'  -- Filtra primeiro
GROUP BY vendedor;
```

#### LIMIT com ORDER BY
```sql
SELECT vendedor, SUM(valor) AS faturamento
FROM vendas
GROUP BY vendedor
ORDER BY SUM(valor) DESC
LIMIT 10;
```

`GROUP BY` e `HAVING` são fundamentais para análise de dados, permitindo transformar dados detalhados em insights agregados e relatórios úteis!
