# Trabalhando com JSON em Go

O pacote `encoding/json` é usado para codificar e decodificar dados JSON em Go.

## Estruturas e JSON

```go
package main

import (
    "encoding/json"
    "fmt"
)

type Pessoa struct {
    Nome  string `json:"nome"`
    Idade int    `json:"idade"`
}

func main() {
    p := Pessoa{Nome: "João", Idade: 30}

    // Codificar para JSON
    jsonData, _ := json.Marshal(p)
    fmt.Println(string(jsonData))

    // Decodificar de JSON
    var p2 Pessoa
    json.Unmarshal(jsonData, &p2)
    fmt.Println(p2)
}
```
