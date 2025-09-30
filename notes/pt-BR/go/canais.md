# Canais em Go

Canais são usados para comunicação entre goroutines. Eles permitem o envio e recebimento de valores de forma sincronizada.

## Criando um Canal

```go
ch := make(chan int)
```

## Enviando e Recebendo Dados

```go
ch <- 42 // Envia o valor 42 para o canal
valor := <-ch // Recebe o valor do canal
```

## Exemplos

### Comunicação Simples

```go
package main

import "fmt"

func main() {
    ch := make(chan string)

    go func() {
        ch <- "Olá, canal!"
    }()

    mensagem := <-ch
    fmt.Println(mensagem)
}
```

### Buffer em Canais

```go
ch := make(chan int, 2)
ch <- 1
ch <- 2
fmt.Println(<-ch)
fmt.Println(<-ch)
```
