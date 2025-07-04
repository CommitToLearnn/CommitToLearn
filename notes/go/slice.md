### Slices em Go

Um `slice` é uma "fatia" ou uma visão de um array subjacente. É um tipo de dados flexível e poderoso para trabalhar com sequências de dados em Go.

Diferente dos arrays, os slices têm um tamanho dinâmico, podendo crescer e encolher conforme necessário.

### Criando um Slice

Você pode criar um slice a partir de um array existente ou usando a função `make`.

```go
package main

import "fmt"

func main() {
    // Criando um slice a partir de um array
    arr := [5]int{1, 2, 3, 4, 5}
    s1 := arr[1:4] // s1 terá [2, 3, 4]

    // Criando um slice com make
    // make(tipo, tamanho, capacidade)
    s2 := make([]int, 5, 10)

    fmt.Println("Slice 1:", s1)
    fmt.Println("Slice 2:", s2)
    fmt.Println("Tamanho de s2:", len(s2))
    fmt.Println("Capacidade de s2:", cap(s2))
}
```

### Funções Úteis

*   `len()`: Retorna o número de elementos no slice.
*   `cap()`: Retorna a capacidade do slice (o número de elementos no array subjacente, a partir do primeiro elemento do slice).
*   `append()`: Adiciona elementos ao final de um slice. Se a capacidade não for suficiente, um novo array maior será alocado.

```go
package main

import "fmt"

func main() {
    var s []int // Slice zero é nil, com len e cap 0
    s = append(s, 1)
    s = append(s, 2, 3)
    fmt.Println(s) // [1 2 3]
}
```

Slices são uma parte fundamental da programação em Go e são usados extensivamente para gerenciar coleções de dados.
