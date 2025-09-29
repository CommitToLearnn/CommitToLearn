### **Test-Driven Development (TDD): Desenhando a Fechadura Antes de Criar a Chave**

Pense no TDD não como uma técnica de teste, mas como uma **metodologia de design de software**. Em vez de construir uma chave e depois procurar uma fechadura que ela abra, você primeiro projeta a fechadura (o requisito, o teste) e só então constrói a chave exata que a abre.

**O Problema Resolvido**
Frequentemente, desenvolvedores escrevem código que é difícil ou impossível de testar. A lógica de negócio fica acoplada à interface do usuário, ao banco de dados, etc. Além disso, é comum escrever mais código do que o necessário ("over-engineering") e deixar os testes para o final, resultando em uma cobertura de testes baixa ou tendenciosa.

**A Solução: O Ciclo Red-Green-Refactor**
TDD inverte o fluxo de trabalho tradicional. O desenvolvimento é guiado por um ciclo curto e repetitivo:

1.  **RED (Vermelho):** Escreva um teste unitário **falho** para uma funcionalidade que ainda não existe. O teste falha porque o código ainda não foi implementado. Este passo é crucial: ele prova que o teste funciona (pois ele consegue falhar) e que a funcionalidade ainda não está presente.

2.  **GREEN (Verde):** Escreva a **quantidade mínima de código** necessária para fazer o teste passar. O objetivo aqui não é escrever o código mais elegante, mas o mais simples possível para satisfazer o requisito do teste.

3.  **REFACTOR (Refatorar):** Com a segurança do teste que está passando, melhore a qualidade do código que você acabou de escrever. Remova duplicação, melhore a legibilidade e a estrutura (design) sem alterar seu comportamento. A suíte de testes garante que você não quebrou nada durante a refatoração.

Repita esse ciclo para cada pequena funcionalidade.

**Exemplo Prático (Desenvolvendo a função `is_password_strong` com TDD):**

**Ciclo 1: Senha curta deve falhar**
1.  **RED:** Escrevemos `test_password_is_weak_if_too_short`.
    ```python
    # test_validators.py
    from validators import is_password_strong

    def test_password_is_weak_if_too_short():
        assert is_password_strong("curta1") is False
    ```
    Rodamos o teste. Ele falha (`NameError: is_password_strong is not defined`).

2.  **GREEN:** Escrevemos o mínimo de código em `validators.py` para passar.
    ```python
    # validators.py
    def is_password_strong(password: str) -> bool:
        return False # A forma mais simples de fazer o teste passar
    ```
    Rodamos o teste. Ele passa.

3.  **REFACTOR:** O código é muito simples. Mas vamos torná-lo um pouco mais real.
    ```python
    # validators.py
    def is_password_strong(password: str) -> bool:
        return len(password) >= 8
    ```
    Opa, o teste agora falha. Bom! Voltamos para o passo Green com a lógica correta.
    ```python
    # validators.py
    def is_password_strong(password: str) -> bool:
        if len(password) < 8:
            return False
        return True # Por enquanto
    ```
    Agora o teste `test_password_is_weak_if_too_short` passa.

**Ciclo 2: Senha sem número deve falhar**
1.  **RED:** Adicionamos o teste `test_password_is_weak_without_number`.
    ```python
    # test_validators.py
    def test_password_is_weak_without_number():
        assert is_password_strong("senhasemnumero") is False
    ```
    Rodamos os testes. O novo teste falha (porque nossa função atual retorna `True`).

2.  **GREEN:** Modificamos a função para passar em *todos* os testes.
    ```python
    # validators.py
    def is_password_strong(password: str) -> bool:
        if len(password) < 8:
            return False
        if not any(char.isdigit() for char in password):
            return False
        return True
    ```
    Rodamos os testes. Todos passam.

3.  **REFACTOR:** Podemos limpar o código.
    ```python
    # validators.py
    def is_password_strong(password: str) -> bool:
        """Verifica se a senha tem pelo menos 8 caracteres e um número."""
        if not isinstance(password, str) or len(password) < 8:
            return False
        
        return any(char.isdigit() for char in password)
    ```
    Rodamos os testes novamente para garantir que a refatoração não quebrou nada. Tudo verde.

### **TDD vs. Testes Unitários: A Relação**

É um erro comum pensar que são a mesma coisa. A relação é simples:

*   **Testes Unitários (TU)** é **O QUÊ**: Um artefato, um tipo de teste. É o substantivo.
*   **Test-Driven Development (TDD)** é **COMO**: Uma metodologia, um processo de desenvolvimento. É o verbo.

> Você **usa** Testes Unitários para **praticar** o Test-Driven Development.

Você pode escrever testes unitários sem fazer TDD (escrevendo-os *depois* do código de produção). No entanto, você não pode fazer TDD sem escrever testes unitários, pois eles são a ferramenta fundamental que guia o processo.