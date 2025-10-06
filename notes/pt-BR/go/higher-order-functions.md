### **Funções de Ordem Superior (Higher-Order Functions): Funções como Cidadãs de Primeira Classe**

Pense em uma função de ordem superior como um **gerente versátil**. Ele pode receber um "trabalhador" (outra função) como instrução para realizar uma tarefa, ou pode treinar e "produzir" um novo trabalhador especializado (retornar uma função).

**Ideia Central:**
Em Go, funções são "cidadãs de primeira classe", o que significa que podem ser tratadas como qualquer outro valor:
*   Podem ser atribuídas a variáveis.
*   Podem ser passadas como argumentos para outras funções.
*   Podem ser retornadas por outras funções.

Uma **função de ordem superior** é qualquer função que faz pelo menos uma dessas duas últimas coisas: **recebe uma função como argumento ou retorna uma função**.

**Exemplo Prático:**
Uma função genérica que executa uma operação matemática em dois números.
```go
package main

import "fmt"

// 'calcular' é uma função de ordem superior porque aceita
// uma função 'operacao' como argumento.
func calcular(a int, b int, operacao func(int, int) int) int {
    fmt.Printf("Executando operação em %d e %d\n", a, b)
    return operacao(a, b)
}

// Funções "trabalhadoras" que podem ser passadas como argumento
func somar(a, b int) int {
    return a + b
}

func multiplicar(a, b int) int {
    return a * b
}

func main() {
    resultadoSoma := calcular(10, 5, somar)
    fmt.Println("Soma:", resultadoSoma) // Soma: 15
    
    resultadoMult := calcular(10, 5, multiplicar)
    fmt.Println("Multiplicação:", resultadoMult) // Multiplicação: 50

    // Também podemos passar uma função anônima diretamente!
    resultadoSub := calcular(10, 5, func(a, b int) int {
        return a - b
    })
    fmt.Println("Subtração:", resultadoSub) // Subtração: 5
}
```

**Caso de Uso Comum:**
Middleware em servidores web (onde cada requisição passa por uma cadeia de funções), implementação de padrões de projeto como o Strategy, ou para criar abstrações que se aplicam a diferentes lógicas (ex: uma função `filtrarSlice` que recebe uma função de critério).