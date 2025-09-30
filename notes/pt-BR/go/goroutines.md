# Goroutines em Go

Goroutines são funções ou métodos que são executados de forma concorrente em Go. Elas são leves e permitem a execução paralela de código.

## Criando uma Goroutine

Para criar uma goroutine, basta usar a palavra-chave `go` antes de uma chamada de função.

```go
func diga(msg string) {
    fmt.Println(msg)
}

go diga("Olá")
```

## Sincronização com WaitGroup

Para sincronizar goroutines, podemos usar `sync.WaitGroup`.

```go
var wg sync.WaitGroup

wg.Add(1)
go func() {
    defer wg.Done()
    fmt.Println("Goroutine executada")
}()

wg.Wait()
```
