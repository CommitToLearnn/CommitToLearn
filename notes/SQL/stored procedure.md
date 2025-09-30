### **Stored Procedure (Procedimento Armazenado): A Receita de Bolo Guardada**

Pense em uma Stored Procedure como uma **receita de bolo que você guarda em um livro**. Ela tem um nome, uma lista de ingredientes (parâmetros) e uma série de passos (a lógica) para realizar uma **ação**. O resultado final é o bolo pronto (o estado do banco de dados modificado).

**Ideia Central:**
É um bloco de código nomeado e armazenado no banco de dados, projetado para executar uma ação ou uma sequência de operações.

**Características Principais:**
*   **Nomeada e Armazenada:** É um objeto do banco de dados, compilada uma vez e reutilizada muitas vezes.
*   **Parâmetros de Entrada e Saída:** Pode receber parâmetros de entrada (`IN`), retornar parâmetros de saída (`OUT`) e ter parâmetros que fazem ambos (`IN OUT`).
*   **Focada em Ações:** Seu propósito é *fazer algo*: inserir dados, atualizar registros, deletar informações, iniciar um processo complexo.
*   **Controle de Transação:** Pode conter comandos de controle de transação (`COMMIT`, `ROLLBACK`).
*   **Não Retorna Valor Diretamente:** Não usa uma cláusula `RETURN` para devolver um valor. A "resposta" é a ação executada ou valores retornados via parâmetros `OUT`.

**Sintaxe Prática (PL/SQL - Oracle):**
```sql
CREATE OR REPLACE PROCEDURE aumentar_salario (
    p_id_funcionario IN NUMBER,
    p_percentual     IN NUMBER
) AS
BEGIN
    -- Ação: Atualizar o salário do funcionário
    UPDATE employees
    SET salary = salary * (1 + p_percentual / 100)
    WHERE employee_id = p_id_funcionario;

    -- Se não houver erro, confirma a transação
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, desfaz a transação
        ROLLBACK;
        -- Propaga o erro para a aplicação que chamou
        RAISE;
END;
/

-- Como invocar (dentro de um bloco anônimo ou outra procedure):
-- BEGIN
--     aumentar_salario(p_id_funcionario => 101, p_percentual => 10);
-- END;
-- /
```

**Quando Usar:**
*   Para encapsular regras de negócio complexas.
*   Para centralizar operações de DML (INSERT, UPDATE, DELETE) que são usadas em várias partes de um sistema.
*   Para tarefas agendadas (jobs) que executam processos em lote (ex: processamento noturno).