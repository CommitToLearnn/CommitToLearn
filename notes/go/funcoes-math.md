### Funções Math em Go - Operações Matemáticas Avançadas

**O que é o Pacote Math?**

O pacote **`math`** em Go fornece constantes e funções matemáticas fundamentais para operações avançadas. É essencial para cálculos científicos, engenharia e análise de dados.

**Analogia:** É como ter uma calculadora científica integrada no seu código - com todas as funções trigonométricas, logarítmicas e exponenciais que você precisa.

### Importando o Pacote Math

```go
package main

import (
    "fmt"
    "math"
)

func exemploBasico() {
    fmt.Println("π =", math.Pi)
    fmt.Println("e =", math.E)
    fmt.Println("√2 =", math.Sqrt2)
}
```

### Constantes Matemáticas Principais

| Constante | Valor | Descrição |
|-----------|-------|-----------|
| `math.Pi` | 3.14159... | Razão circunferência/diâmetro |
| `math.E` | 2.71828... | Base do logaritmo natural |
| `math.Phi` | 1.61803... | Razão áurea |
| `math.Sqrt2` | 1.41421... | Raiz quadrada de 2 |
| `math.SqrtE` | 1.64872... | Raiz quadrada de e |
| `math.SqrtPi` | 1.77245... | Raiz quadrada de π |
| `math.SqrtPhi` | 1.27201... | Raiz quadrada de φ |

```go
package main

import (
    "fmt"
    "math"
)

func mostrarConstantes() {
    fmt.Println("=== CONSTANTES MATEMÁTICAS ===")
    fmt.Printf("π (Pi): %.10f\n", math.Pi)
    fmt.Printf("e (Euler): %.10f\n", math.E)
    fmt.Printf("φ (Phi/Razão Áurea): %.10f\n", math.Phi)
    fmt.Printf("√2: %.10f\n", math.Sqrt2)
    fmt.Printf("√e: %.10f\n", math.SqrtE)
    fmt.Printf("√π: %.10f\n", math.SqrtPi)
    
    // Limites de float64
    fmt.Printf("Maior float64: %.3e\n", math.MaxFloat64)
    fmt.Printf("Menor float64: %.3e\n", math.SmallestNonzeroFloat64)
    fmt.Printf("Infinito: %v\n", math.Inf(1))
    fmt.Printf("NaN: %v\n", math.NaN())
}
```

### Funções Básicas de Arredondamento

```go
package main

import (
    "fmt"
    "math"
)

func exemploArredondamento() {
    numero := 3.7825
    
    fmt.Printf("Número original: %.4f\n", numero)
    fmt.Printf("Ceil (teto): %.0f\n", math.Ceil(numero))        // 4
    fmt.Printf("Floor (piso): %.0f\n", math.Floor(numero))      // 3
    fmt.Printf("Round (arredonda): %.0f\n", math.Round(numero)) // 4
    fmt.Printf("Trunc (trunca): %.0f\n", math.Trunc(numero))    // 3
    
    // Exemplos com números negativos
    negativo := -3.7825
    fmt.Printf("\nNúmero negativo: %.4f\n", negativo)
    fmt.Printf("Ceil: %.0f\n", math.Ceil(negativo))   // -3
    fmt.Printf("Floor: %.0f\n", math.Floor(negativo)) // -4
    fmt.Printf("Round: %.0f\n", math.Round(negativo)) // -4
    fmt.Printf("Trunc: %.0f\n", math.Trunc(negativo)) // -3
}

func exemploAbs() {
    fmt.Println("=== VALOR ABSOLUTO ===")
    valores := []float64{-5.5, 0, 3.2, -10}
    
    for _, v := range valores {
        fmt.Printf("Abs(%.1f) = %.1f\n", v, math.Abs(v))
    }
}
```

### Funções de Potência e Raiz

```go
package main

import (
    "fmt"
    "math"
)

func exemploPotenciaRaiz() {
    fmt.Println("=== POTÊNCIAS E RAÍZES ===")
    
    base := 2.0
    expoente := 3.0
    
    fmt.Printf("%.0f^%.0f = %.0f\n", base, expoente, math.Pow(base, expoente))
    fmt.Printf("√%.0f = %.3f\n", 16.0, math.Sqrt(16.0))
    fmt.Printf("∛%.0f = %.3f\n", 27.0, math.Cbrt(27.0))
    
    // Potências especiais
    fmt.Printf("2^10 = %.0f\n", math.Pow(2, 10))
    fmt.Printf("e^2 = %.3f\n", math.Exp(2))
    fmt.Printf("e^x - 1 (x=0.1) = %.10f\n", math.Expm1(0.1)) // Mais preciso para x pequeno
    
    // Raízes e potências de 2
    fmt.Printf("2^3 = %.0f\n", math.Exp2(3))      // 2^3
    fmt.Printf("log₂(8) = %.0f\n", math.Log2(8))  // log base 2
    fmt.Printf("log₁₀(100) = %.0f\n", math.Log10(100)) // log base 10
    fmt.Printf("ln(e) = %.3f\n", math.Log(math.E))     // logaritmo natural
}

func exemploHypot() {
    fmt.Println("=== HIPOTENUSA (TEOREMA DE PITÁGORAS) ===")
    
    // Calcular hipotenusa sem overflow/underflow
    a, b := 3.0, 4.0
    hipotenusa := math.Hypot(a, b)
    fmt.Printf("Triângulo com lados %.0f e %.0f\n", a, b)
    fmt.Printf("Hipotenusa: %.3f\n", hipotenusa)
    
    // Comparar com cálculo manual
    manual := math.Sqrt(a*a + b*b)
    fmt.Printf("Cálculo manual: %.3f\n", manual)
    fmt.Printf("Diferença: %.10f\n", math.Abs(hipotenusa-manual))
}
```

### Funções Trigonométricas

```go
package main

import (
    "fmt"
    "math"
)

func exemploTrigonometria() {
    fmt.Println("=== FUNÇÕES TRIGONOMÉTRICAS ===")
    
    // Ângulos em radianos
    angulos := []float64{0, math.Pi / 6, math.Pi / 4, math.Pi / 3, math.Pi / 2}
    nomes := []string{"0°", "30°", "45°", "60°", "90°"}
    
    for i, rad := range angulos {
        graus := rad * 180 / math.Pi
        fmt.Printf("\n%s (%.3f rad):\n", nomes[i], rad)
        fmt.Printf("  sin = %.3f\n", math.Sin(rad))
        fmt.Printf("  cos = %.3f\n", math.Cos(rad))
        if math.Cos(rad) != 0 {
            fmt.Printf("  tan = %.3f\n", math.Tan(rad))
        } else {
            fmt.Printf("  tan = indefinido\n")
        }
    }
}

func exemploTrigonometriaInversa() {
    fmt.Println("=== FUNÇÕES TRIGONOMÉTRICAS INVERSAS ===")
    
    valores := []float64{0, 0.5, 0.707, 0.866, 1}
    
    for _, v := range valores {
        if v <= 1 { // asin e acos são definidos apenas para [-1, 1]
            asin := math.Asin(v)
            acos := math.Acos(v)
            fmt.Printf("Valor: %.3f\n", v)
            fmt.Printf("  arcsin = %.3f rad (%.1f°)\n", asin, asin*180/math.Pi)
            fmt.Printf("  arccos = %.3f rad (%.1f°)\n", acos, acos*180/math.Pi)
        }
        atan := math.Atan(v)
        fmt.Printf("  arctan = %.3f rad (%.1f°)\n", atan, atan*180/math.Pi)
        fmt.Println()
    }
}

func exemploAtan2() {
    fmt.Println("=== ATAN2 - ÂNGULO DE VETOR ===")
    
    // atan2(y, x) retorna o ângulo do vetor (x, y)
    pontos := [][2]float64{
        {1, 0},   // 0°
        {1, 1},   // 45°
        {0, 1},   // 90°
        {-1, 1},  // 135°
        {-1, 0},  // 180°
        {-1, -1}, // -135°
        {0, -1},  // -90°
        {1, -1},  // -45°
    }
    
    for _, ponto := range pontos {
        x, y := ponto[0], ponto[1]
        angulo := math.Atan2(y, x)
        graus := angulo * 180 / math.Pi
        fmt.Printf("Ponto (%.0f, %.0f): %.3f rad (%.0f°)\n", x, y, angulo, graus)
    }
}
```

### Funções Hiperbólicas

```go
package main

import (
    "fmt"
    "math"
)

func exemploHiperbolicas() {
    fmt.Println("=== FUNÇÕES HIPERBÓLICAS ===")
    
    valores := []float64{0, 0.5, 1, 2}
    
    for _, x := range valores {
        fmt.Printf("\nx = %.1f:\n", x)
        fmt.Printf("  sinh(%.1f) = %.3f\n", x, math.Sinh(x))
        fmt.Printf("  cosh(%.1f) = %.3f\n", x, math.Cosh(x))
        fmt.Printf("  tanh(%.1f) = %.3f\n", x, math.Tanh(x))
        
        // Verificar identidade: cosh²(x) - sinh²(x) = 1
        cosh := math.Cosh(x)
        sinh := math.Sinh(x)
        identidade := cosh*cosh - sinh*sinh
        fmt.Printf("  cosh²-sinh² = %.10f (deve ser 1)\n", identidade)
    }
}

func exemploHiperbolicasInversas() {
    fmt.Println("=== FUNÇÕES HIPERBÓLICAS INVERSAS ===")
    
    valores := []float64{0.5, 1, 2, 3}
    
    for _, x := range valores {
        fmt.Printf("\nx = %.1f:\n", x)
        
        // asinh é definido para todos os reais
        fmt.Printf("  asinh(%.1f) = %.3f\n", x, math.Asinh(x))
        
        // acosh é definido para x >= 1
        if x >= 1 {
            fmt.Printf("  acosh(%.1f) = %.3f\n", x, math.Acosh(x))
        }
        
        // atanh é definido para |x| < 1
        if math.Abs(x) < 1 {
            fmt.Printf("  atanh(%.1f) = %.3f\n", x, math.Atanh(x))
        }
    }
}
```

### Funções de Comparação e Utilidade

```go
package main

import (
    "fmt"
    "math"
)

func exemploComparacao() {
    fmt.Println("=== FUNÇÕES DE COMPARAÇÃO ===")
    
    a, b := 5.7, 3.2
    
    fmt.Printf("Valores: a=%.1f, b=%.1f\n", a, b)
    fmt.Printf("Max(a, b) = %.1f\n", math.Max(a, b))
    fmt.Printf("Min(a, b) = %.1f\n", math.Min(a, b))
    
    // Comparar com zero
    valores := []float64{-2.5, 0, 3.7}
    for _, v := range valores {
        sinal := ""
        if math.Signbit(v) {
            sinal = "negativo"
        } else {
            sinal = "positivo"
        }
        fmt.Printf("%.1f é %s\n", v, sinal)
    }
}

func exemploUtilidade() {
    fmt.Println("=== FUNÇÕES DE UTILIDADE ===")
    
    // Verificar valores especiais
    valores := []float64{
        1.5,
        math.Inf(1),   // +∞
        math.Inf(-1),  // -∞
        math.NaN(),    // Not a Number
        0,
    }
    
    for _, v := range valores {
        fmt.Printf("\nValor: %v\n", v)
        fmt.Printf("  IsNaN: %t\n", math.IsNaN(v))
        fmt.Printf("  IsInf: %t\n", math.IsInf(v, 0))
        fmt.Printf("  IsInf(+): %t\n", math.IsInf(v, 1))
        fmt.Printf("  IsInf(-): %t\n", math.IsInf(v, -1))
    }
}

func exemploRemainder() {
    fmt.Println("=== RESTO E MÓDULO ===")
    
    x, y := 7.5, 2.5
    
    fmt.Printf("x=%.1f, y=%.1f\n", x, y)
    fmt.Printf("Remainder(x, y) = %.1f\n", math.Remainder(x, y))
    fmt.Printf("Mod(x, y) = %.1f\n", math.Mod(x, y))
    
    // Diferença entre Remainder e Mod
    fmt.Println("\nDiferença Remainder vs Mod:")
    casos := [][2]float64{{7, 3}, {-7, 3}, {7, -3}, {-7, -3}}
    
    for _, caso := range casos {
        x, y := caso[0], caso[1]
        remainder := math.Remainder(x, y)
        mod := math.Mod(x, y)
        fmt.Printf("x=%.0f, y=%.0f: Remainder=%.0f, Mod=%.0f\n", x, y, remainder, mod)
    }
}
```

### Manipulação de Bits Float

```go
package main

import (
    "fmt"
    "math"
)

func exemploFloat() {
    fmt.Println("=== MANIPULAÇÃO DE FLOAT ===")
    
    numero := 3.14159
    
    // Separar em partes
    fracao, expoente := math.Frexp(numero)
    fmt.Printf("%.5f = %.5f × 2^%d\n", numero, fracao, expoente)
    
    // Reconstruir
    reconstruido := math.Ldexp(fracao, expoente)
    fmt.Printf("Reconstruído: %.5f\n", reconstruido)
    
    // Separar parte inteira e fracionária
    inteira, fracionaria := math.Modf(numero)
    fmt.Printf("%.5f = %.0f + %.5f\n", numero, inteira, fracionaria)
    
    // Próximos valores representáveis
    fmt.Printf("Nextafter(3.0, 4.0) = %.17f\n", math.Nextafter(3.0, 4.0))
    fmt.Printf("Nextafter(3.0, 2.0) = %.17f\n", math.Nextafter(3.0, 2.0))
}

func exemploGamma() {
    fmt.Println("=== FUNÇÃO GAMA ===")
    
    // Γ(n) = (n-1)! para inteiros positivos
    for i := 1; i <= 5; i++ {
        gamma := math.Gamma(float64(i))
        fatorial := 1
        for j := 1; j < i; j++ {
            fatorial *= j
        }
        fmt.Printf("Γ(%d) = %.3f, (%d-1)! = %d\n", i, gamma, i, fatorial)
    }
    
    // Logaritmo da função gama para valores grandes
    fmt.Printf("ln(Γ(100)) = %.3f\n", math.Lgamma(100))
}
```

### Aplicações Práticas

#### Calculadora Científica

```go
package main

import (
    "fmt"
    "math"
)

type CalculadoraCientifica struct{}

func (c CalculadoraCientifica) CalcularDistancia(x1, y1, x2, y2 float64) float64 {
    return math.Hypot(x2-x1, y2-y1)
}

func (c CalculadoraCientifica) AreaCirculo(raio float64) float64 {
    return math.Pi * math.Pow(raio, 2)
}

func (c CalculadoraCientifica) VolumeEsfera(raio float64) float64 {
    return (4.0 / 3.0) * math.Pi * math.Pow(raio, 3)
}

func (c CalculadoraCientifica) AnguloEntreVetores(x1, y1, x2, y2 float64) float64 {
    // Produto escalar: v1 · v2 = |v1| |v2| cos(θ)
    produtoEscalar := x1*x2 + y1*y2
    magnitude1 := math.Hypot(x1, y1)
    magnitude2 := math.Hypot(x2, y2)
    
    cosTheta := produtoEscalar / (magnitude1 * magnitude2)
    // Garantir que está no domínio [-1, 1]
    cosTheta = math.Max(-1, math.Min(1, cosTheta))
    
    return math.Acos(cosTheta)
}

func exemploCalculadora() {
    calc := CalculadoraCientifica{}
    
    fmt.Println("=== CALCULADORA CIENTÍFICA ===")
    
    // Distância entre pontos
    dist := calc.CalcularDistancia(0, 0, 3, 4)
    fmt.Printf("Distância entre (0,0) e (3,4): %.2f\n", dist)
    
    // Área e volume
    raio := 5.0
    area := calc.AreaCirculo(raio)
    volume := calc.VolumeEsfera(raio)
    fmt.Printf("Círculo raio %.1f: área = %.2f\n", raio, area)
    fmt.Printf("Esfera raio %.1f: volume = %.2f\n", raio, volume)
    
    // Ângulo entre vetores
    angulo := calc.AnguloEntreVetores(1, 0, 0, 1)
    graus := angulo * 180 / math.Pi
    fmt.Printf("Ângulo entre (1,0) e (0,1): %.2f rad (%.0f°)\n", angulo, graus)
}
```

#### Análise Estatística Básica

```go
package main

import (
    "fmt"
    "math"
)

func calcularMedia(valores []float64) float64 {
    if len(valores) == 0 {
        return 0
    }
    
    soma := 0.0
    for _, v := range valores {
        soma += v
    }
    return soma / float64(len(valores))
}

func calcularDesvioPadrao(valores []float64) float64 {
    if len(valores) <= 1 {
        return 0
    }
    
    media := calcularMedia(valores)
    somaQuadrados := 0.0
    
    for _, v := range valores {
        diff := v - media
        somaQuadrados += diff * diff
    }
    
    variancia := somaQuadrados / float64(len(valores)-1)
    return math.Sqrt(variancia)
}

func exemploEstatistica() {
    fmt.Println("=== ANÁLISE ESTATÍSTICA ===")
    
    dados := []float64{1.2, 2.5, 3.1, 2.8, 4.2, 3.7, 2.9, 3.5, 4.1, 2.7}
    
    media := calcularMedia(dados)
    desvio := calcularDesvioPadrao(dados)
    
    fmt.Printf("Dados: %v\n", dados)
    fmt.Printf("Média: %.3f\n", media)
    fmt.Printf("Desvio padrão: %.3f\n", desvio)
    
    // Normalização Z-score
    fmt.Println("\nZ-scores:")
    for i, valor := range dados {
        zscore := (valor - media) / desvio
        fmt.Printf("%.1f → %.3f\n", valor, zscore)
    }
}
```

#### Conversão de Coordenadas

```go
package main

import (
    "fmt"
    "math"
)

// Cartesiano para Polar
func cartesianoPolar(x, y float64) (r, theta float64) {
    r = math.Hypot(x, y)
    theta = math.Atan2(y, x)
    return
}

// Polar para Cartesiano
func polarCartesiano(r, theta float64) (x, y float64) {
    x = r * math.Cos(theta)
    y = r * math.Sin(theta)
    return
}

func exemploCoordenas() {
    fmt.Println("=== CONVERSÃO DE COORDENADAS ===")
    
    // Cartesiano → Polar
    x, y := 3.0, 4.0
    r, theta := cartesianoPolar(x, y)
    graus := theta * 180 / math.Pi
    
    fmt.Printf("Cartesiano (%.1f, %.1f)\n", x, y)
    fmt.Printf("Polar: r=%.3f, θ=%.3f rad (%.1f°)\n", r, theta, graus)
    
    // Polar → Cartesiano (verificação)
    x2, y2 := polarCartesiano(r, theta)
    fmt.Printf("Volta para cartesiano: (%.3f, %.3f)\n", x2, y2)
    
    fmt.Printf("Diferença: x=%.10f, y=%.10f\n", math.Abs(x-x2), math.Abs(y-y2))
}
```

### Dicas de Performance

```go
package main

import (
    "fmt"
    "math"
    "time"
)

func benchmarkMath() {
    fmt.Println("=== BENCHMARK FUNÇÕES MATH ===")
    
    const iteracoes = 1000000
    valores := make([]float64, iteracoes)
    for i := range valores {
        valores[i] = float64(i) * 0.001
    }
    
    // Teste Sqrt
    inicio := time.Now()
    for _, v := range valores {
        _ = math.Sqrt(v)
    }
    tempoSqrt := time.Since(inicio)
    
    // Teste Pow(v, 0.5) - alternativa menos eficiente
    inicio = time.Now()
    for _, v := range valores {
        _ = math.Pow(v, 0.5)
    }
    tempoPow := time.Since(inicio)
    
    fmt.Printf("Sqrt: %v\n", tempoSqrt)
    fmt.Printf("Pow(x, 0.5): %v\n", tempoPow)
    fmt.Printf("Sqrt é %.1fx mais rápido\n", float64(tempoPow)/float64(tempoSqrt))
}
```

### Recursos Externos

📚 **Documentação e Tutoriais:**
- [Go Math Package Documentation](https://golang.org/pkg/math/)
- [Mathematical Functions in Go](https://gobyexample.com/math)
- [Floating Point Guide](https://floating-point-gui.de/)

🎥 **Vídeos Recomendados:**
- [Go Math Package Tutorial](https://www.youtube.com/watch?v=math_tutorial)
- [Floating Point Numbers Explained](https://www.youtube.com/watch?v=PZRI1IfStY0)

🛠️ **Ferramentas Interativas:**
- [Go Playground](https://play.golang.org/) - Teste funções matemáticas
- [Wolfram Alpha](https://www.wolframalpha.com/) - Verificar cálculos

O pacote math em Go é completo e eficiente para qualquer tipo de cálculo matemático que você precise!
