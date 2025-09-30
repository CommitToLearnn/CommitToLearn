# Reflection em Go

Reflection é a capacidade de inspecionar e manipular tipos e valores em tempo de execução. Em Go, isso é feito usando o pacote `reflect`.

## Obtendo Informações de um Tipo

```go
package main

import (
    "fmt"
    "reflect"
)

func main() {
    var x float64 = 3.4
    t := reflect.TypeOf(x)
    fmt.Println("Tipo:", t)
    fmt.Println("Nome do Tipo:", t.Name())
}
```

## Modificando Valores

```go
v := reflect.ValueOf(&x).Elem()
v.SetFloat(7.1)
fmt.Println("Novo valor:", x)
```
