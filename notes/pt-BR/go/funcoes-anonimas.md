### **Funções Anônimas: Funções Sem Nome**

Pense em uma função anônima como uma **instrução em um post-it**: uma tarefa rápida e de uso único que não precisa de um nome formal. Você a escreve, usa e descarta.

**Ideia Central:**
É uma função definida e declarada sem um nome. Também é chamada de "function literal". Ela é útil para encapsular uma pequena lógica exatamente onde ela é necessária, sem poluir o namespace do pacote.

**Sintaxe e Regras Chave:**
*   A sintaxe é `func(parametros) tipo_retorno { ... }`.
*   Pode ser atribuída a uma variável ou chamada imediatamente após sua definição.

**Exemplo Prático:**
```go
package main

import (
	"fmt"
	"time"
)

func main() {
    // 1. Atribuindo uma função anônima a uma variável
    minhaFuncao := func(texto string) {
        fmt.Println("Olá,", texto)
    }
    
    minhaFuncao("Mundo") // Chama a função através da variável

    // 2. Chamada imediata (muito comum para goroutines)
    fmt.Println("Esperando a goroutine...")
    
    go func() {
        fmt.Println("Esta mensagem vem de uma função anônima em outra thread!")
    }() // Os parênteses () no final invocam a função imediatamente

    time.Sleep(1 * time.Second) // Apenas para dar tempo da goroutine executar
}
```

**Caso de Uso Comum:**
O uso mais idiomático é para iniciar **goroutines**, onde você precisa executar uma pequena tarefa em paralelo. Também são usadas para `defer`, callbacks ou qualquer situação que exija uma função simples e de escopo limitado.