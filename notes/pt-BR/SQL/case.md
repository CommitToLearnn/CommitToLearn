### CASE - Lógica Condicional no SQL

**O que é CASE?**

`CASE` é uma estrutura condicional do SQL que permite implementar lógica "se-então-senão" (if-then-else) dentro de consultas. É como ter uma estrutura de decisão que pode transformar dados baseado em condições.

**Analogia:** Imagine que você está categorizando funcionários por faixa salarial. O `CASE` é como uma pessoa que olha o salário e diz: "Se for menor que 3000, é 'Júnior'; se for entre 3000 e 6000, é 'Pleno'; se for maior que 6000, é 'Sênior'".



### Sintaxe do CASE

Existem duas formas principais:

#### CASE Simples (Comparação com Valor)
```sql
CASE coluna
    WHEN valor1 THEN resultado1
    WHEN valor2 THEN resultado2
    ...
    ELSE resultado_padrão
END
```

#### CASE com Condições (Mais Flexível)
```sql
CASE 
    WHEN condição1 THEN resultado1
    WHEN condição2 THEN resultado2
    ...
    ELSE resultado_padrão
END
```



### Exemplos Básicos

Usando nossa tabela `funcionarios`:

| id | nome          | departamento | salario | idade | status |
|----|---------------|--------------|---------|-------|--------|
| 1  | Ana Silva     | TI           | 5000    | 28    | A      |
| 2  | João Santos   | Vendas       | 3200    | 35    | A      |
| 3  | Maria Costa   | TI           | 6500    | 31    | I      |
| 4  | Pedro Lima    | RH           | 4800    | 29    | A      |
| 5  | Carlos Rocha  | Vendas       | 2800    | 42    | A      |

#### Exemplo 1: CASE Simples - Status Descritivo
```sql
SELECT 
    nome,
    status,
    CASE status
        WHEN 'A' THEN 'Ativo'
        WHEN 'I' THEN 'Inativo'
        ELSE 'Indefinido'
    END AS status_descricao
FROM funcionarios;
```

**Resultado:**
| nome          | status | status_descricao |
|---------------|--------|------------------|
| Ana Silva     | A      | Ativo            |
| João Santos   | A      | Ativo            |
| Maria Costa   | I      | Inativo          |
| Pedro Lima    | A      | Ativo            |
| Carlos Rocha  | A      | Ativo            |

#### Exemplo 2: CASE com Condições - Faixa Salarial
```sql
SELECT 
    nome,
    salario,
    CASE 
        WHEN salario < 3000 THEN 'Júnior'
        WHEN salario >= 3000 AND salario < 6000 THEN 'Pleno'
        WHEN salario >= 6000 THEN 'Sênior'
        ELSE 'Indefinido'
    END AS nivel_salarial
FROM funcionarios;
```

**Resultado:**
| nome          | salario | nivel_salarial |
|---------------|---------|----------------|
| Ana Silva     | 5000    | Pleno          |
| João Santos   | 3200    | Pleno          |
| Maria Costa   | 6500    | Sênior         |
| Pedro Lima    | 4800    | Pleno          |
| Carlos Rocha  | 2800    | Júnior         |



### CASE em Diferentes Contextos

#### No SELECT - Criando Colunas Calculadas
```sql
SELECT 
    nome,
    idade,
    CASE 
        WHEN idade < 30 THEN 'Jovem'
        WHEN idade >= 30 AND idade < 40 THEN 'Adulto'
        ELSE 'Experiente'
    END AS faixa_etaria,
    salario,
    CASE 
        WHEN salario > 5000 THEN salario * 1.1  -- Bônus de 10%
        ELSE salario * 1.05                     -- Bônus de 5%
    END AS salario_com_bonus
FROM funcionarios;
```

#### No WHERE - Filtragem Condicional
```sql
SELECT nome, departamento, salario, status
FROM funcionarios
WHERE 
    CASE 
        WHEN status = 'I' THEN 1
        WHEN salario < 3000 THEN 1
        ELSE 0
    END = 1;
```

#### No ORDER BY - Ordenação Customizada
```sql
SELECT nome, departamento, salario
FROM funcionarios
ORDER BY 
    CASE departamento
        WHEN 'TI' THEN 1
        WHEN 'RH' THEN 2
        ELSE 3
    END,
    nome;
```



### CASE com Funções de Agregação

#### Exemplo 1: Contagem Condicional
```sql
SELECT 
    departamento,
    COUNT(*) AS total_funcionarios,
    COUNT(CASE WHEN salario > 5000 THEN 1 END) AS funcionarios_alto_salario,
    COUNT(CASE WHEN idade < 30 THEN 1 END) AS funcionarios_jovens
FROM funcionarios
GROUP BY departamento;
```

#### Exemplo 2: Soma Condicional
```sql
SELECT 
    departamento,
    SUM(CASE WHEN status = 'A' THEN salario ELSE 0 END) AS folha_ativos,
    SUM(CASE WHEN status = 'I' THEN salario ELSE 0 END) AS folha_inativos
FROM funcionarios
GROUP BY departamento;
```



### CASE Aninhado (Nested CASE)

Para lógica mais complexa, você pode aninhar CASE:

```sql
SELECT 
    nome,
    departamento,
    salario,
    CASE departamento
        WHEN 'TI' THEN 
            CASE 
                WHEN salario > 6000 THEN 'TI Sênior'
                WHEN salario > 4000 THEN 'TI Pleno'
                ELSE 'TI Júnior'
            END
        WHEN 'Vendas' THEN 
            CASE 
                WHEN salario > 5000 THEN 'Vendas Sênior'
                ELSE 'Vendas Júnior'
            END
        ELSE 'Outros'
    END AS categoria_detalhada
FROM funcionarios;
```



### Casos Práticos Avançados

#### Relatório de Performance
```sql
SELECT 
    nome,
    CASE 
        WHEN salario > 6000 AND idade < 35 THEN 'Alto Potencial'
        WHEN salario > 5000 AND status = 'A' THEN 'Performer'
        WHEN salario < 3000 THEN 'Desenvolvimento'
        WHEN status = 'I' THEN 'Inativo'
        ELSE 'Padrão'
    END AS categoria_funcionario,
    COUNT(*) OVER (PARTITION BY departamento) AS total_departamento
FROM funcionarios;
```

#### Análise de Vendas com CASE
```sql
SELECT 
    produto,
    SUM(quantidade) AS total_vendido,
    SUM(CASE WHEN regiao = 'SP' THEN quantidade ELSE 0 END) AS vendas_sp,
    SUM(CASE WHEN regiao = 'RJ' THEN quantidade ELSE 0 END) AS vendas_rj,
    CASE 
        WHEN SUM(quantidade) > 100 THEN 'Produto Estrela'
        WHEN SUM(quantidade) > 50 THEN 'Produto Regular'
        ELSE 'Produto Lento'
    END AS categoria_produto
FROM vendas
GROUP BY produto;
```

#### Transformação de Dados
```sql
SELECT 
    ano,
    SUM(CASE WHEN mes = 1 THEN valor ELSE 0 END) AS janeiro,
    SUM(CASE WHEN mes = 2 THEN valor ELSE 0 END) AS fevereiro,
    SUM(CASE WHEN mes = 3 THEN valor ELSE 0 END) AS marco,
    SUM(CASE WHEN mes = 4 THEN valor ELSE 0 END) AS abril
FROM vendas_mensais
GROUP BY ano;
```



### Dicas Importantes

#### ELSE é Opcional, mas Recomendado
```sql
CASE 
    WHEN salario > 5000 THEN 'Alto'
    WHEN salario > 3000 THEN 'Médio'
    -- Se salario <= 3000, retorna NULL
END

CASE 
    WHEN salario > 5000 THEN 'Alto'
    WHEN salario > 3000 THEN 'Médio'
    ELSE 'Baixo'
END
```

#### Ordem das Condições Importa
```sql
CASE 
    WHEN salario > 0 THEN 'Positivo'      -- Pega todos os salários > 0
    WHEN salario > 5000 THEN 'Alto'       -- Nunca será executado
    ELSE 'Zero ou Negativo'
END

CASE 
    WHEN salario > 5000 THEN 'Alto'
    WHEN salario > 0 THEN 'Positivo'
    ELSE 'Zero ou Negativo'
END
```

#### Tipos de Dados Consistentes
```sql
CASE 
    WHEN condicao1 THEN 'Texto'
    WHEN condicao2 THEN 123          -- Número
    ELSE 'Padrão'
END

CASE 
    WHEN condicao1 THEN 'Texto'
    WHEN condicao2 THEN '123'        -- Texto
    ELSE 'Padrão'
END
```

#### Performance
```sql
CASE 
    WHEN status = 'A' THEN 'Ativo'     -- 90% dos casos
    WHEN status = 'I' THEN 'Inativo'   -- 10% dos casos
    ELSE 'Indefinido'                  -- Casos raros
END
```



### Casos de Uso Comuns

#### Formatação de Dados
```sql
SELECT 
    nome,
    CASE 
        WHEN LENGTH(telefone) = 11 THEN 
            CONCAT('(', SUBSTRING(telefone, 1, 2), ') ', 
                   SUBSTRING(telefone, 3, 5), '-', 
                   SUBSTRING(telefone, 8, 4))
        ELSE telefone
    END AS telefone_formatado
FROM clientes;
```

#### Classificação de Clientes
```sql
SELECT 
    cliente,
    total_compras,
    CASE 
        WHEN total_compras > 10000 THEN 'Premium'
        WHEN total_compras > 5000 THEN 'Gold'
        WHEN total_compras > 1000 THEN 'Silver'
        ELSE 'Bronze'
    END AS segmento
FROM clientes;
```

#### Alertas e Notificações
```sql
SELECT 
    funcionario,
    ultimo_login,
    CASE 
        WHEN ultimo_login < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 'ALERTA: Não acessa há 30+ dias'
        WHEN ultimo_login < DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 'Atenção: Não acessa há 7+ dias'
        ELSE 'OK'
    END AS status_acesso
FROM usuarios;
```

`CASE` é uma ferramenta poderosa que adiciona flexibilidade e inteligência às consultas SQL, permitindo transformar e categorizar dados de forma dinâmica!
