# Pacotes em Go

Pacotes são uma forma de organizar e reutilizar código em Go. Todo programa Go é composto por pacotes, e o pacote principal é o `main`.

## Criando um Pacote

Para criar um pacote, basta criar um diretório e adicionar arquivos Go com a declaração do pacote.

```go
// arquivo: calculadora/soma.go
package calculadora

func Soma(a, b int) int {
    return a + b
}
```

## Usando um Pacote

Para usar um pacote, importe-o no arquivo onde ele será utilizado.

```go
package main

import (
    "fmt"
    "meuprojeto/calculadora"
)

func main() {
    resultado := calculadora.Soma(3, 4)
    fmt.Println("Resultado:", resultado)
}
```
