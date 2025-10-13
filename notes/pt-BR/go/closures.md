# Closures: Funções com Memória

Pense em uma **closure** como um **chef de cozinha com uma receita secreta de família**.

O chef (a função) sabe como executar uma tarefa (cozinhar um prato). A receita secreta (as variáveis do escopo externo) não faz parte das instruções gerais de "cozinhar", mas o chef a carrega consigo e a utiliza toda vez que prepara aquele prato específico.

Mesmo que o chef saia da cozinha original onde aprendeu a receita, ele ainda se lembra dela e pode usá-la em qualquer outro lugar. Se dois chefs aprendem a mesma receita, cada um pode fazer suas próprias pequenas modificações (alterar o estado da variável) sem afetar a receita do outro.

### O Conceito em Detalhes

Uma **closure** é uma função que "se lembra" do ambiente em que foi criada. Tecnicamente, é uma função anônima que referencia (acessa e manipula) variáveis declaradas fora de seu próprio corpo.

O ponto-chave é que a closure "fecha sobre" (em inglês, *closes over*) essas variáveis. Isso significa que ela mantém uma referência a elas, e o estado dessas variáveis é **preservado** entre as chamadas da closure.

```go
// 'gerarIncrementador' é uma função "fábrica" que retorna uma closure.
func gerarIncrementador() func() int {
    
    // 'contador' é a variável externa, a "receita secreta".
    // Ela pertence ao escopo de 'gerarIncrementador'.
    contador := 0 
    
    // A função anônima abaixo é a closure.
    // Ela captura e modifica a variável 'contador'.
    return func() int {
        contador++ // Modifica a variável do seu ambiente de criação.
        return contador
    }
}
```

### Por Que Isso Importa?

Closures são uma maneira poderosa de criar funções com **estado**. Elas permitem o encapsulamento de dados, um conceito geralmente associado à programação orientada a objetos, mas de uma forma mais leve e funcional.

**Casos de uso principais:**
1.  **Emular Estado Privado:** Criar contadores, geradores de ID, ou qualquer função que precise manter um estado interno que não seja acessível globalmente.
2.  **Fábricas de Funções (Function Factories):** Gerar funções que são pré-configuradas com determinados valores ou comportamentos.
3.  **Callbacks e Handlers:** Em programação concorrente ou web, closures são perfeitas para serem usadas como *handlers* que precisam de acesso a um contexto específico (como um ID de requisição ou uma conexão de usuário).

### Exemplos Práticos

#### Exemplo 1: O Contador Clássico (Estado Isolado)

Este é o exemplo canônico que demonstra o estado isolado de cada closure.

```go
package main

import "fmt"

// A função fábrica que retorna nossa closure.
func gerarIncrementador() func() int {
    contador := 0 // Esta variável é "capturada" pela closure.
    return func() int {
        contador++
        return contador
    }
}

func main() {
    // 'incrementadorA' é uma closure. Ela tem sua própria "mochila"
    // com sua própria variável 'contador' inicializada em 0.
    incrementadorA := gerarIncrementador()

    // 'incrementadorB' é outra closure. Ela também tem sua própria mochila,
    // completamente independente da de 'A'.
    incrementadorB := gerarIncrementador()
    
    // Chamando 'incrementadorA' várias vezes.
    fmt.Println("A:", incrementadorA()) // A: 1
    fmt.Println("A:", incrementadorA()) // A: 2
    
    // Chamando 'incrementadorB'. Note que o estado de 'A' não é afetado.
    fmt.Println("B:", incrementadorB()) // B: 1
    
    fmt.Println("A:", incrementadorA()) // A: 3
}
```

#### Exemplo 2: Fábrica de Funções para Filtros

Imagine que você precisa de várias funções que filtram números, cada uma com um limite diferente.

```go
package main

import "fmt"

// Esta fábrica cria uma função que diz se um número é maior que um 'limite'.
func criarFiltro(limite int) func(int) bool {
    // A closure captura a variável 'limite'.
    return func(numero int) bool {
        return numero > limite
    }
}

func main() {
    // Criamos uma função que filtra números maiores que 10.
    filtroMaiorQue10 := criarFiltro(10)

    // Criamos outra que filtra números maiores que 50.
    filtroMaiorQue50 := criarFiltro(50)

    fmt.Println("30 é maior que 10?", filtroMaiorQue10(30)) // true
    fmt.Println("5 é maior que 10?", filtroMaiorQue10(5))   // false

    fmt.Println("30 é maior que 50?", filtroMaiorQue50(30)) // false
    fmt.Println("75 é maior que 50?", filtroMaiorQue50(75)) // true
}
```

### Armadilhas Comuns

1.  **Captura de Variáveis de Loop (A Armadilha Clássica):** Se você criar closures dentro de um loop `for`, elas capturarão a *referência* à variável do loop, não o seu *valor* em cada iteração. No final do loop, todas as closures apontarão para o último valor da variável.

    ```go
    // Exemplo do que NÃO fazer:
    for i := 0; i < 3; i++ {
        // Todas as goroutines usarão o último valor de 'i' (que será 3).
        go func() {
            fmt.Println(i) // Imprime 3, 3, 3 (em alguma ordem)
        }()
    }

    // A forma correta é passar o valor como argumento:
    for i := 0; i < 3; i++ {
        go func(valor int) {
            fmt.Println(valor) // Imprime 0, 1, 2 (em alguma ordem)
        }(i) // Passa uma cópia do valor de 'i' para a goroutine.
    }
    ```

### Boas Práticas

1.  **Mantenha o Estado Simples:** Closures são ótimas para estados simples. Se a lógica de estado se tornar muito complexa, pode ser melhor usar uma `struct` para gerenciar o estado de forma mais explícita.

2.  **Cuidado com a Concorrência:** Se múltiplas goroutines acessarem a mesma closure que modifica uma variável, você precisará usar mecanismos de sincronização (como `mutexes`) para evitar *data races*.

3.  **Passe Variáveis de Loop como Argumentos:** Como visto na armadilha, sempre passe variáveis de loop como argumentos para closures executadas de forma concorrente ou adiada (`defer`).

### Resumo Rápido

*   **Closure:** Uma função que referencia variáveis de um escopo externo, "lembrando-se" delas.
*   **Estado:** Permite que funções mantenham um estado privado e isolado entre chamadas.
*   **Fábricas:** Útil para criar funções pré-configuradas.
*   **Armadilha Principal:** Cuidado ao criar closures dentro de loops; elas capturam a referência da variável, não seu valor.
*   **Concorrência:** O estado de uma closure não é inerentemente seguro para concorrência. Proteja-o se necessário.