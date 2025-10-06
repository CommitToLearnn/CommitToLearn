### **Funções Variádicas: Aceitando um Número Indefinido de Argumentos**

Pense em uma função variádica como uma função que aceita uma **lista de compras de tamanho variável**. Às vezes você precisa de 2 itens, às vezes de 10. Em vez de criar uma função para cada tamanho, você cria uma que aceita quantos itens forem necessários.

**Ideia Central:**
Uma função variádica é aquela que pode ser chamada com um número variável de argumentos. Em Go, isso é alcançado declarando o último parâmetro de uma função com o prefixo `...` antes do tipo.

**Sintaxe e Regras Chave:**
*   A sintaxe é `...T`, onde `T` é o tipo dos argumentos.
*   Dentro da função, o parâmetro variádico se comporta como um **slice** daquele tipo (`[]T`).
*   Apenas o **último parâmetro** de uma função pode ser variádico.

**Exemplo Prático:**
Uma função que soma um número indefinido de inteiros.
```go
package main

import "fmt"

// A função 'somar' aceita zero ou mais inteiros.
// Dentro da função, 'numeros' é um slice de inteiros: []int
func somar(numeros ...int) int {
    fmt.Printf("Recebido: %v, Tipo: %T\n", numeros, numeros)
    total := 0
    for _, numero := range numeros {
        total += numero
    }
    return total
}

func main() {
    soma1 := somar(1, 2)
    fmt.Println("Soma 1:", soma1) // Saída: Soma 1: 3

    soma2 := somar(1, 2, 3, 4, 5)
    fmt.Println("Soma 2:", soma2) // Saída: Soma 2: 15
    
    // Se você já tem um slice, pode "desempacotá-lo" usando '...'
    meusNumeros := []int{10, 20, 30}
    soma3 := somar(meusNumeros...)
    fmt.Println("Soma 3:", soma3) // Saída: Soma 3: 60
}
```

**Caso de Uso Comum:**
A função mais famosa em Go, `fmt.Println()`, é variádica. Ela aceita qualquer número de argumentos de qualquer tipo (`...any`). Outros usos incluem funções de log, construtores de objetos complexos ou qualquer função que realize uma operação agregadora.