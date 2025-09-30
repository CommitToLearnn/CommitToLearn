### **Bloco Anônimo: O Rascunho de Script**

Pense em um Bloco Anônimo como um **rascunho ou um script de uso único** que você escreve no seu editor de SQL. Ele executa uma série de comandos, mas depois que termina, o banco de dados o esquece. Ele não é salvo nem nomeado.

**Ideia Central:**
É um bloco de código procedural (com declarações, lógica e exceções) que é compilado e executado em tempo real, mas não é armazenado no dicionário de dados do banco para reutilização.

**Características Principais:**
*   **Sem Nome:** Não possui um nome para ser chamado posteriormente.
*   **Não Armazenado:** Existe apenas durante sua execução.
*   **Compilado a Cada Execução:** O banco de dados precisa analisar e compilar o código toda vez que ele é submetido.
*   **Não Pode Ser Invocado:** Como não tem nome, não pode ser chamado por outras partes da aplicação.
*   **Ideal para Testes e Tarefas Pontuais:** Perfeito para testar uma lógica, realizar uma tarefa administrativa rápida ou gerar um relatório ad-hoc.

**Sintaxe Prática (PL/SQL - Oracle):**
```sql
-- A palavra-chave DECLARE é opcional se não houver variáveis
DECLARE
    v_nome_departamento VARCHAR2(100);
    v_id_departamento NUMBER := 10;
BEGIN
    -- Lógica para buscar um dado e exibi-lo
    SELECT department_name 
    INTO v_nome_departamento 
    FROM departments 
    WHERE department_id = v_id_departamento;
    
    DBMS_OUTPUT.PUT_LINE('O nome do departamento é: ' || v_nome_departamento);

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('Erro: Departamento não encontrado.');
END;
/
```

**Quando Usar:**
*   Para testar a lógica de uma Procedure ou Function antes de criá-la formalmente.
*   Para executar tarefas administrativas que não precisarão ser repetidas com frequência (ex: uma correção de dados específica).
*   Para criar scripts de instalação ou configuração.

