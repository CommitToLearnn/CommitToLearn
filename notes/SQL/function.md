### **Function (Função): A Calculadora Reutilizável**

Pense em uma Function como uma **calculadora especializada**. Você fornece um ou mais números (parâmetros), ela realiza um **cálculo** específico e te entrega **um único resultado**.

**Ideia Central:**
É um bloco de código nomeado e armazenado, projetado para computar e **retornar um único valor**.

**Características Principais:**
*   **Nomeada e Armazenada:** Assim como a procedure, é um objeto reutilizável.
*   **Foco em Retorno de Valor:** Sua principal obrigação é retornar um valor através da cláusula `RETURN`.
*   **Usada em Expressões SQL:** A grande vantagem é que pode ser chamada diretamente dentro de uma instrução SQL (`SELECT`, `WHERE`, `HAVING`), como se fosse uma função nativa do banco.
*   **Parâmetros de Entrada:** Geralmente, utiliza apenas parâmetros de entrada (`IN`).
*   **Restrições:** Normalmente não pode executar comandos de DML (INSERT/UPDATE/DELETE) se for ser usada em um `SELECT`, e não pode controlar transações (`COMMIT`/`ROLLBACK`).

**Sintaxe Prática (PL/SQL - Oracle):**
```sql
CREATE OR REPLACE FUNCTION calcular_salario_anual (
    p_id_funcionario IN NUMBER
) RETURN NUMBER AS
    v_salario_mensal NUMBER;
    v_comissao       NUMBER;
BEGIN
    -- Lógica para buscar os dados
    SELECT salary, NVL(commission_pct, 0)
    INTO v_salario_mensal, v_comissao
    FROM employees
    WHERE employee_id = p_id_funcionario;

    -- O cálculo e o retorno obrigatório de um único valor
    RETURN (v_salario_mensal * 12) * (1 + v_comissao);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
END;
/

-- Como invocar (diretamente em um SELECT):
-- SELECT 
--     employee_id, 
--     last_name, 
--     calcular_salario_anual(employee_id) AS salario_total
-- FROM employees;
```

**Quando Usar:**
*   Para reutilizar cálculos complexos em várias queries.
*   Para criar lógicas de formatação de dados.
*   Para simplificar consultas complexas, movendo a lógica para um componente reutilizável.