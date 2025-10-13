# Biblioteca `fmt`: O Canivete Suíço para Imprimir e Formatar

Pense no pacote `fmt` (abreviação de "format") como a **caixa de ferramentas de um repórter**. Um repórter precisa de várias formas de apresentar informações:

*   **`fmt.Println` (A Manchete Rápida):** É como gritar a notícia principal. Você joga a informação lá, e ela sai de forma clara, com um espaço entre cada fato e uma nova linha no final. Rápido e direto. `Println` = Print Line.
*   **`fmt.Print` (A Nota de Rodapé):** É para juntar informações na mesma linha, sem muito alarde. Útil para construir uma frase parte por parte, sem quebras de linha automáticas.
*   **`fmt.Printf` (A Reportagem Detalhada):** É o artigo completo. Você tem um "molde" (a string de formatação) e "encaixa" suas informações exatamente onde quer, com controle total sobre o estilo: "O placar foi **10** a **5**", "A temperatura é **23.5°C**", "O código do produto é **#00FFa0**". `Printf` = Print Formatted.
*   **`fmt.Sprintf` (O Rascunho do Repórter):** É como escrever a reportagem detalhada em um bloco de notas para usar depois. Ele formata tudo em uma string, mas em vez de imprimir no jornal, ele te devolve o texto pronto para você enviar por e-mail, salvar num arquivo, etc. `Sprintf` = String Print Formatted.

### O Conceito em Detalhes

O pacote `fmt` implementa funcionalidades para **entrada e saída (I/O) formatada**. Ele é seu principal aliado para mostrar dados ao usuário, ler informações do teclado e construir strings com base em variáveis.

Para usá-lo, você sempre precisa importar o pacote no início do seu arquivo Go:
```go
import "fmt"
```

#### Funções de Impressão (Saída)

*   **`fmt.Println(a ...any)`**: Imprime seus argumentos, adiciona espaços entre eles e sempre termina com uma nova linha. É a função mais comum para debugging rápido.
    ```go
    nome := "Ana"
    idade := 30
    fmt.Println("Nome:", nome, "- Idade:", idade)
    // Saída: Nome: Ana - Idade: 30
    ```

*   **`fmt.Print(a ...any)`**: Imprime seus argumentos um após o outro, sem espaços extras e sem nova linha.
    ```go
    fmt.Print("Isso fica")
    fmt.Print(" na mesma")
    fmt.Print(" linha.")
    // Saída: Isso fica na mesma linha.
    ```

*   **`fmt.Printf(format string, a ...any)`**: A mais poderosa. Usa uma string de formato com "verbos" especiais (que começam com `%`) para controlar exatamente como cada argumento é exibido.
    ```go
    fmt.Printf("Usuário: %s, Idade: %d, Ativo: %t\n", "Bob", 42, true)
    // Saída: Usuário: Bob, Idade: 42, Ativo: true
    ```

#### Funções de Formatação para String

Às vezes, você não quer imprimir, mas sim criar uma string formatada.

*   **`fmt.Sprintf(format string, a ...any) string`**: Idêntica à `Printf`, mas em vez de imprimir, ela **retorna a string resultante**.
    ```go
    erroMsg := fmt.Sprintf("ERRO: Usuário com ID %d não encontrado.", 123)
    // agora a variável erroMsg contém "ERRO: Usuário com ID 123 não encontrado."
    log.Println(erroMsg)
    ```

### Por Que Isso Importa?

Sem o `fmt`, seria quase impossível saber o que seu programa está fazendo. Ele é essencial para:
*   **Debugging:** Imprimir o valor de variáveis em pontos críticos do código.
*   **Feedback ao Usuário:** Mostrar mensagens, status e resultados na tela.
*   **Criação de Logs:** Formatar mensagens de log para serem salvas em arquivos ou enviadas para sistemas de monitoramento.
*   **Construção de Strings Dinâmicas:** Criar mensagens de erro, queries de banco de dados (com cuidado!) ou qualquer texto que dependa de variáveis.

### Verbos de Formatação do `Printf` (Os Mais Comuns)

Os "verbos" são os códigos `%` que você usa na string de formatação.

| Verbo | Descrição                               | Exemplo                               |
|-------|-----------------------------------------|---------------------------------------|
| `%v`  | **Valor:** O formato padrão.            | `fmt.Printf("%v", pessoa)`            |
| `%+v` | **Valor com Nomes:** Para structs, mostra os nomes dos campos. | `fmt.Printf("%+v", pessoa)` |
| `%#v` | **Valor com Sintaxe Go:** Mostra o valor na sua sintaxe Go. | `fmt.Printf("%#v", pessoa)` |
| `%T`  | **Tipo:** Mostra o tipo da variável.    | `fmt.Printf("%T", pessoa)`            |
| `%d`  | **Decimal:** Para inteiros.             | `fmt.Printf("%d", 100)`               |
| `%f`  | **Float:** Para números de ponto flutuante. | `fmt.Printf("%.2f", 123.456)` (limita a 2 casas decimais) |
| `%s`  | **String:** Para strings.               | `fmt.Printf("%s", "olá")`             |
| `%t`  | **Booleano:** Para `true` ou `false`.   | `fmt.Printf("%t", true)`              |
| `%p`  | **Ponteiro:** Mostra o endereço de memória. | `fmt.Printf("%p", &variavel)`         |
| `%%`  | **Sinal de Porcentagem:** Para imprimir o caractere `%`. | `fmt.Printf("Desconto de 10%%")` |

### Exemplos Práticos

```go
package main

import "fmt"

type Produto struct {
    Nome  string
    Preco float64
    ID    int
}

func main() {
    p := Produto{Nome: "Notebook", Preco: 4500.99, ID: 101}

    fmt.Println("--- Println (Simples) ---")
    fmt.Println("Produto:", p.Nome, "Preço:", p.Preco)

    fmt.Println("\n--- Printf (Formatado) ---")
    fmt.Printf("O produto '%s' (ID: %d) custa R$ %.2f.\n", p.Nome, p.ID, p.Preco)

    fmt.Println("\n--- Verbos Especiais para Structs ---")
    fmt.Printf("%%v:  %v\n", p)  // Formato padrão
    fmt.Printf("%%+v: %+v\n", p) // Com nomes dos campos
    fmt.Printf("%%#v: %#v\n", p) // Sintaxe Go
    fmt.Printf("%%T:  %T\n", p)  // Tipo

    fmt.Println("\n--- Sprintf (Criando uma String) ---")
    resumo := fmt.Sprintf("Resumo do Produto: %s | Preço: %.2f", p.Nome, p.Preco)
    fmt.Println(resumo)
}
```

### Armadilhas Comuns

1.  **Número Incorreto de Argumentos no `Printf`:** Se a string de formatação espera 3 verbos (`%s`, `%d`, `%f`) e você só passa 2 argumentos, Go vai inserir um valor de erro como `(MISSING)` e isso pode quebrar a formatação.

2.  **Tipo Incompatível com o Verbo:** Tentar usar `%d` (decimal) para uma string, ou `%s` para um inteiro. O `Printf` vai tentar fazer o seu melhor, mas o resultado geralmente não é o que você espera.

3.  **Usar `Println` e Esperar Formatação:** Escrever `fmt.Println("Nome: %s", nome)` não funciona. O `%s` será impresso literalmente. Para formatação, você **precisa** usar `Printf` ou `Sprintf`.

### Boas Práticas

1.  **Use `Println` para Debug Rápido:** É a ferramenta perfeita para inspecionar rapidamente o valor de uma variável. `fmt.Println("DEBUG:", minhaVariavel)`.

2.  **Use `Printf` para Saída Controlada:** Quando a aparência da saída importa (em um relatório, uma mensagem para o usuário, etc.), use `Printf` para ter controle total.

3.  **Use `Sprintf` para Construir Erros e Logs:** É a forma idiomática de criar strings de erro que incluem valores dinâmicos. `return fmt.Errorf("item com id %d não encontrado", id)`.

4.  **O Verbo `%v` é seu Amigo:** Quando você não tem certeza do tipo ou só quer uma representação rápida, `%v` geralmente faz o que você quer. Para structs, `%+v` é ainda melhor para entender o que está acontecendo.

### Resumo Rápido

*   `fmt` é o pacote para formatar e imprimir dados.
*   **`Println`**: Rápido, fácil, adiciona espaços e nova linha. Ideal para debug.
*   **`Print`**: Junta tudo na mesma linha, sem extras.
*   **`Printf`**: Controle total sobre a formatação usando "verbos" (`%d`, `%s`, `%f`, etc.).
*   **`Sprintf`**: Igual ao `Printf`, mas retorna uma `string` em vez de imprimir.
*   Dominar os verbos de formatação, especialmente `%v`, `%+v` e `%T`, vai acelerar muito seu desenvolvimento e capacidade de depuração.