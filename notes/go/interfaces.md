# Interfaces em Go

Interfaces em Go são tipos que definem um conjunto de métodos. Elas permitem que diferentes tipos implementem o mesmo conjunto de métodos, promovendo a flexibilidade e a reutilização de código.

## Definição de uma Interface

```go
type Forma interface {
    Area() float64
    Perimetro() float64
}
```

## Implementação de uma Interface

Qualquer tipo que implemente todos os métodos de uma interface é considerado como implementando essa interface.

```go
type Retangulo struct {
    Largura, Altura float64
}

func (r Retangulo) Area() float64 {
    return r.Largura * r.Altura
}

func (r Retangulo) Perimetro() float64 {
    return 2 * (r.Largura + r.Altura)
}

var f Forma = Retangulo{Largura: 10, Altura: 5}
fmt.Println(f.Area())
fmt.Println(f.Perimetro())
```
