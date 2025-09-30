### **Trigger (Gatilho): O Sensor de Alarme**

Pense em um Trigger como um **sensor de alarme instalado em uma porta**. Ele fica inativo, esperando por um evento específico (alguém abrir a porta). Quando o evento ocorre, ele **dispara automaticamente** uma ação (toca o alarme). Você não "chama" o sensor; ele reage sozinho.

**Ideia Central:**
É um tipo especial de procedure que é executado **automaticamente** em resposta a um evento de DML (Data Manipulation Language - `INSERT`, `UPDATE`, `DELETE`) em uma tabela específica.

**Características Principais:**
*   **Automático e Implícito:** Não pode ser invocado diretamente. Ele é disparado pelo banco de dados.
*   **Associado a um Evento e a uma Tabela:** Está sempre vinculado a uma tabela e a um ou mais eventos de DML.
*   **Timing:** Pode ser configurado para disparar `BEFORE` (antes) ou `AFTER` (depois) do evento.
*   **Acesso a Dados Antigos e Novos:** Pode acessar os valores da linha antes da alteração (`:OLD`) e depois da alteração (`:NEW`).
*   **Foco em Reações:** Usado para auditoria, validação complexa, manter a integridade de dados ou replicar informações.

**Sintaxe Prática (PL/SQL - Oracle):**
```sql
-- Tabela de log para auditoria
-- CREATE TABLE log_mudanca_salario (
--     log_id NUMBER GENERATED AS IDENTITY,
--     id_funcionario NUMBER,
--     salario_antigo NUMBER,
--     salario_novo NUMBER,
--     data_mudanca DATE
-- );

CREATE OR REPLACE TRIGGER trg_auditar_salario
AFTER UPDATE OF salary ON employees -- Dispara DEPOIS de um UPDATE na coluna SALARY da tabela EMPLOYEES
FOR EACH ROW -- Executa para cada linha afetada
BEGIN
    -- Ação: Inserir um registro na tabela de log
    INSERT INTO log_mudanca_salario (id_funcionario, salario_antigo, salario_novo, data_mudanca)
    VALUES (:OLD.employee_id, :OLD.salary, :NEW.salary, SYSDATE);
END;
/

-- Para testar, basta executar um UPDATE na tabela employees:
-- UPDATE employees SET salary = salary + 100 WHERE employee_id = 101;
-- O trigger irá disparar e inserir o log automaticamente.
```

**Quando Usar (com Cautela):**
*   **Auditoria:** Registrar quem alterou o quê e quando. Este é o uso mais clássico e seguro.
*   **Validação de Regras de Negócio Complexas:** Implementar regras que não podem ser garantidas por constraints simples.
*   **Manter Dados Denormalizados:** Sincronizar dados entre tabelas automaticamente.

**Aviso:** O uso excessivo de triggers pode criar uma lógica "invisível" e complexa, tornando o sistema difícil de depurar. Use-os quando a ação precisa ser incondicionalmente acoplada ao evento de DML.