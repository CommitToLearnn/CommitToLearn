# Testes em Go

Testes são fundamentais para garantir a qualidade do código. Em Go, os testes são escritos em arquivos que terminam com `_test.go` e utilizam o pacote `testing`.

## Estrutura de um Teste

```go
package main

import "testing"

func TestSoma(t *testing.T) {
    resultado := Soma(2, 3)
    esperado := 5

    if resultado != esperado {
        t.Errorf("Resultado %d, esperado %d", resultado, esperado)
    }
}
```

## Executando Testes

Use o comando `go test` para executar os testes.

```bash
go test
```
