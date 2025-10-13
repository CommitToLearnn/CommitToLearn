# Funções de Ordem Superior (Higher-Order Functions)

Pense em funções como **ferramentas** e em uma **função de ordem superior** como uma **bancada de trabalho personalizável**.

Uma função normal é uma ferramenta específica, como uma chave de fenda. Ela faz um trabalho e pronto.

Uma função de ordem superior é a bancada onde você pode:
1.  **Encaixar uma ferramenta**: Você pode passar uma função (uma ferramenta) para a bancada de trabalho (a função de ordem superior) para que ela execute uma tarefa específica. Ex: "Bancada, use esta furadeira (função `furar`) neste ponto."
2.  **Construir uma nova ferramenta**: A bancada pode montar e te entregar uma ferramenta nova e especializada. Ex: "Bancada, me dê uma ferramenta que sempre aperta parafusos com a força X." (retornar uma nova função).

Em Go, funções são "cidadãs de primeira classe", o que significa que podem ser tratadas como qualquer outro valor (como um `int` ou uma `string`). Elas podem ser passadas como argumentos e retornadas por outras funções.

### O Conceito em Detalhes

Uma **função de ordem superior (Higher-Order Function)** é qualquer função que atende a pelo menos um dos seguintes critérios:

1.  **Recebe uma ou mais funções como argumento.**
2.  **Retorna uma função como seu resultado.**

Essa capacidade permite criar abstrações poderosas, onde a lógica específica (o "o quê") pode ser separada da estrutura de controle (o "como").

### Por Que Isso Importa?

*   **Reutilização de Código:** Permite criar componentes genéricos que podem ser customizados com diferentes lógicas. Por exemplo, uma função `filtrar` pode ser usada em slices de qualquer tipo, desde que você forneça a função de critério correta.
*   **Composição:** Facilita a construção de lógicas complexas combinando funções menores e mais simples (como peças de Lego).
*   **Legibilidade:** Ajuda a expressar a intenção do código de forma mais clara. Em vez de um loop `for` com um `if` dentro, você pode ter uma chamada `filtrar(slice, condicao)`.
*   **Padrões de Projeto:** É a base para muitos padrões de projeto, como Strategy, Decorator e Middleware (muito comum em desenvolvimento web).

### Exemplos Práticos

#### Exemplo 1: Recebendo uma Função como Argumento

Vamos criar uma função `processar` que aplica uma operação (uma função) a cada elemento de um slice de strings.

```go
package main

import (
    "fmt"
    "strings"
)

// 'processar' é uma função de ordem superior porque aceita 'fn' como argumento.
// 'fn' é do tipo func(string) string, ou seja, uma função que recebe e retorna uma string.
func processar(nomes []string, fn func(string) string) []string {
    nomesProcessados := make([]string, len(nomes))
    for i, nome := range nomes {
        nomesProcessados[i] = fn(nome)
    }
    return nomesProcessados
}

func main() {
    participantes := []string{"ana", "BETO", "  caio  "}

    // Passando a função strings.ToUpper como argumento.
    nomesMaiusculos := processar(participantes, strings.ToUpper)
    fmt.Println("Maiúsculos:", nomesMaiusculos) // [ANA, BETO,   CAIO  ]

    // Passando a função strings.TrimSpace como argumento.
    nomesSemEspacos := processar(participantes, strings.TrimSpace)
    fmt.Println("Sem Espaços:", nomesSemEspacos) // [ana, BETO, caio]

    // Passando uma função anônima para capitalizar.
    nomesCapitalizados := processar(participantes, func(s string) string {
        return strings.Title(strings.ToLower(strings.TrimSpace(s)))
    })
    fmt.Println("Capitalizados:", nomesCapitalizados) // [Ana, Beto, Caio]
}
```

#### Exemplo 2: Retornando uma Função (Closures)

Vamos criar uma função que retorna outra função. A função retornada "lembra" do ambiente onde foi criada.

```go
package main

import "fmt"

// 'criarSaudacao' é uma função de ordem superior porque retorna uma função.
func criarSaudacao(saudacao string) func(string) string {
    // A função anônima abaixo é uma 'closure'.
    // Ela "captura" a variável 'saudacao' do seu escopo pai.
    return func(nome string) string {
        return saudacao + ", " + nome + "!"
    }
}

func main() {
    // Criamos duas "fábricas" de saudações.
    saudacaoBomDia := criarSaudacao("Bom dia")
    saudacaoBoaNoite := criarSaudacao("Boa noite")

    // Usamos as funções geradas.
    fmt.Println(saudacaoBomDia("Maria"))   // Bom dia, Maria!
    fmt.Println(saudacaoBoaNoite("João")) // Boa noite, João!
    fmt.Println(saudacaoBomDia("Pedro"))   // Bom dia, Pedro!
}
```

### Armadilhas Comuns

1.  **Assinatura Incorreta:** A função que você passa como argumento deve ter exatamente a mesma assinatura (tipos de parâmetros e de retorno) que a função de ordem superior espera. Um erro de tipo aqui é muito comum.

2.  **Captura de Variáveis em Loops (Closures):** Ao criar funções dentro de um loop, tenha cuidado. A função pode capturar a variável do loop, e não o valor dela em cada iteração, levando a resultados inesperados.

### Boas Práticas

1.  **Mantenha as Assinaturas Simples:** Funções que recebem `func(int, string) (bool, error)` são mais difíceis de usar. Prefira assinaturas claras e concisas.

2.  **Use Tipos de Função:** Para melhorar a legibilidade, você pode definir um tipo para uma assinatura de função complexa.
    ```go
    type OperacaoMatematica func(int, int) int
    
    func calcular(a, b int, op OperacaoMatematica) int {
        return op(a, b)
    }
    ```

### Resumo Rápido

*   **Função de Ordem Superior**: Uma função que recebe outra função como argumento ou retorna uma função.
*   **Cidadãs de Primeira Classe**: Em Go, funções são valores como quaisquer outros.
*   **Receber Função**: Permite criar código genérico e reutilizável (ex: `processar(dados, logica)`).
*   **Retornar Função**: Permite criar "fábricas" de funções e padrões como closures (ex: `geradorDeFuncao := criarFuncao(config)`).
*   **Principal Vantagem**: Abstração e composição de lógica.