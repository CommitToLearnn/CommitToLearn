# Pesquisa Binária em Go

A pesquisa binária é um algoritmo clássico e eficiente para encontrar um elemento em uma **fatia (slice) ordenada**. Go, com seu sistema de tipos forte e foco em desempenho, é uma ótima linguagem para implementar e entender este algoritmo.

A lógica é a mesma do conceito geral: dividir a fatia de busca pela metade a cada iteração até que o elemento seja encontrado ou a busca falhe.

## Implementação em Go

Aqui está uma implementação comum e idiomática da pesquisa binária em Go.

```go
package main

import "fmt"

// binarySearch implementa a pesquisa binária.
// Retorna o índice do elemento se encontrado, ou -1 se não estiver na fatia.
func binarySearch(data []int, target int) int {
    low := 0
    high := len(data) - 1

    for low <= high {
        // Evita overflow que poderia ocorrer com (low + high) / 2
        mid := low + (high-low)/2
        
        if data[mid] == target {
            return mid // Encontrado!
        }
        
        if data[mid] < target {
            low = mid + 1 // O alvo está na metade direita
        } else {
            high = mid - 1 // O alvo está na metade esquerda
        }
    }

    return -1 // Não encontrado
}

func main() {
    // A fatia DEVE estar ordenada para a pesquisa binária funcionar.
    sortedSlice := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
    
    targetFound := 23
    targetNotFound := 40

    indexFound := binarySearch(sortedSlice, targetFound)
    if indexFound != -1 {
        fmt.Printf("Elemento %d encontrado no índice %d.\n", targetFound, indexFound)
    } else {
        fmt.Printf("Elemento %d não encontrado na fatia.\n", targetFound)
    }

    indexNotFound := binarySearch(sortedSlice, targetNotFound)
    if indexNotFound != -1 {
        fmt.Printf("Elemento %d encontrado no índice %d.\n", targetNotFound, indexNotFound)
    } else {
        fmt.Printf("Elemento %d não encontrado na fatia.\n", targetNotFound)
    }
}
```

### Pontos Importantes na Implementação

**Fatia Ordenada:** A pré-condição mais crucial para a pesquisa binária é que a coleção de dados (a fatia, no caso de Go) esteja **ordenada**. Se não estiver, o algoritmo não funcionará corretamente.

**Cálculo do Meio:** A linha `mid := low + (high-low)/2` é uma forma segura de calcular o índice do meio. A forma mais simples `mid := (low + high) / 2` pode, em teoria, causar um *integer overflow* em linguagens de baixo nível se `low` e `high` forem números muito grandes. Em Go, é uma boa prática usar a forma mais segura.

**Condição de Parada:** O loop `for low <= high` continua enquanto ainda houver uma sub-fatia válida para pesquisar. Quando `low` se torna maior que `high`, significa que o elemento não foi encontrado.
