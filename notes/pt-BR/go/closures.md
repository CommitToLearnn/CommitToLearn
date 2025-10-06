### **Closures: Funções com Memória**

Pense em uma closure como uma **função que carrega uma "mochila"**. Essa mochila contém as variáveis do ambiente onde a função foi criada. Mesmo que o ambiente original deixe de existir, a função ainda tem acesso à sua mochila.

**Ideia Central:**
Uma closure é uma função anônima que "fecha sobre" (ou referencia) variáveis de um escopo externo ao seu. A função pode ler e modificar essas variáveis, e o estado delas é preservado entre as chamadas à função.

**Sintaxe e Regras Chave:**
*   Não é uma sintaxe nova, mas um **comportamento** que emerge quando uma função acessa variáveis de um escopo superior.
*   Cada instância da closure mantém seu próprio estado isolado.

**Exemplo Prático (o clássico contador):**
```go
package main

import "fmt"

// 'gerarIncrementador' é uma função que RETORNA outra função.
// A função retornada é uma closure.
func gerarIncrementador() func() int {
    // 'contador' é a variável "da mochila". Ela está no escopo de gerarIncrementador.
    contador := 0 
    
    // Esta função anônima é a closure. Ela "fecha sobre" a variável 'contador'.
    return func() int {
        contador++
        return contador
    }
}

func main() {
    // Cada chamada a 'gerarIncrementador' cria uma nova "mochila" (um novo escopo).
    incrementadorA := gerarIncrementador()
    incrementadorB := gerarIncrementador()
    
    // 'incrementadorA' tem sua própria variável 'contador'
    fmt.Println("A:", incrementadorA()) // A: 1
    fmt.Println("A:", incrementadorA()) // A: 2
    
    // 'incrementadorB' também tem sua própria variável 'contador', completamente independente
    fmt.Println("B:", incrementadorB()) // B: 1
    
    fmt.Println("A:", incrementadorA()) // A: 3
}
```

**Caso de Uso Comum:**
Usado para emular encapsulamento ou estado privado, como em programação orientada a objetos. Ideal para criar "fábricas de funções" que geram funções pré-configuradas.