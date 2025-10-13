# Pesquisa Binária (Binary Search) em Go: O Detetive Eficiente

Pense na **pesquisa binária** como a forma mais rápida de encontrar uma palavra em um **dicionário físico**.

Você não começa pela primeira página e lê palavra por palavra (isso seria uma *pesquisa linear*). Em vez disso, você:
1.  Abre o dicionário exatamente no **meio**.
2.  Olha a palavra naquela página. A palavra que você procura vem **antes** ou **depois**?
3.  Se vem **antes**, você ignora toda a segunda metade do dicionário e repete o processo com a primeira metade.
4.  Se vem **depois**, você ignora a primeira metade e se concentra na segunda.

A cada passo, você descarta metade do problema. É um método de divisão e conquista extremamente eficiente. A única condição é que o dicionário (ou, no nosso caso, a coleção de dados) esteja **ordenado**.

### O Conceito em Detalhes

A pesquisa binária é um algoritmo para encontrar a posição de um valor alvo dentro de um **array ou slice ordenado**.

A lógica é sempre a mesma:
1.  Defina dois ponteiros: `low` (início da fatia de busca) e `high` (fim da fatia de busca).
2.  Enquanto `low` for menor ou igual a `high`:
    a. Calcule o índice do meio: `mid = low + (high - low) / 2`.
    b. Compare o valor em `mid` com seu alvo.
    c. Se for igual, você encontrou! Retorne `mid`.
    d. Se o alvo for menor, ele só pode estar na metade esquerda. Descarte a direita: `high = mid - 1`.
    e. Se o alvo for maior, ele só pode estar na metade direita. Descarte a esquerda: `low = mid + 1`.
3.  Se o loop terminar (`low` ultrapassar `high`), significa que o alvo não está na coleção.

### Por Que Isso Importa?

A pesquisa binária é drasticamente mais rápida que a pesquisa linear para grandes volumes de dados.

*   **Pesquisa Linear (verificar um por um):** Se você tem 1 milhão de itens, no pior caso, fará 1 milhão de comparações.
*   **Pesquisa Binária (dividir e conquistar):** Para 1 milhão de itens, você fará no máximo **20 comparações**.

Essa eficiência (complexidade de **O(log n)**) é crucial em aplicações que precisam de respostas rápidas em grandes conjuntos de dados, como:
*   Busca em bancos de dados indexados.
*   Funções de autocompletar.
*   Verificar se um item existe em uma grande lista de configuração.

### Exemplos Práticos

#### Implementação Idiomática em Go

```go
package main

import "fmt"

// binarySearch implementa a pesquisa binária em uma fatia de inteiros.
// Retorna o índice do elemento se encontrado, ou -1 se não estiver na fatia.
func binarySearch(data []int, target int) int {
    // 1. Define os limites da busca.
    low := 0
    high := len(data) - 1

    // 2. Loop enquanto a fatia de busca for válida.
    for low <= high {
        // 3. Calcula o meio de forma segura para evitar overflow com números gigantes.
        mid := low + (high-low)/2
        guess := data[mid]

        // 4. Compara o "chute" com o alvo.
        if guess == target {
            return mid // Encontrado!
        }

        // 5. Se o chute foi muito alto, descarte a metade direita.
        if guess > target {
            high = mid - 1
        } else { // 6. Se o chute foi muito baixo, descarte a metade esquerda.
            low = mid + 1
        }
    }

    // 7. Se o loop terminar, o elemento não existe.
    return -1
}

func main() {
    // A PRÉ-CONDIÇÃO MAIS IMPORTANTE: a fatia DEVE estar ordenada.
    numerosOrdenados := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}

    alvo1 := 23
    alvo2 := 100 // Um valor que não existe na fatia.

    indice1 := binarySearch(numerosOrdenados, alvo1)
    indice2 := binarySearch(numerosOrdenados, alvo2)

    if indice1 != -1 {
        fmt.Printf("O alvo %d foi encontrado no índice %d.\n", alvo1, indice1)
    } else {
        fmt.Printf("O alvo %d não foi encontrado.\n", alvo1)
    }

    if indice2 != -1 {
        fmt.Printf("O alvo %d foi encontrado no índice %d.\n", alvo2, indice2)
    } else {
        fmt.Printf("O alvo %d não foi encontrado.\n", alvo2)
    }
}
```
**Output:**
```
O alvo 23 foi encontrado no índice 5.
O alvo 100 não foi encontrado.
```

### Armadilhas Comuns

1.  **Esquecer de Ordenar os Dados:** A armadilha número um. Aplicar a pesquisa binária em dados não ordenados produzirá resultados incorretos e imprevisíveis. O algoritmo assume a ordenação para poder descartar metades do conjunto de dados.

2.  **Erro "Off-by-One":** Errar na atualização dos limites `low` e `high`. É crucial usar `high = mid - 1` e `low = mid + 1` para garantir que o elemento do meio seja excluído da próxima iteração e o loop eventualmente termine.

3.  **Overflow no Cálculo do Meio:** A forma `mid := (low + high) / 2` funciona para a maioria dos casos, mas pode, teoricamente, estourar o limite de um inteiro se `low` e `high` forem extremamente grandes. A forma `mid := low + (high-low)/2` é matematicamente equivalente e evita esse risco, sendo considerada mais robusta.

### Boas Práticas

1.  **Use a Biblioteca Padrão:** Go já tem uma implementação otimizada de pesquisa binária no pacote `sort`. Em vez de reescrever a sua, use-a!
    *   `sort.SearchInts(slice, alvo)`: Faz a busca em um slice de `int`.
    *   `sort.Search(n, f)`: Uma versão mais genérica onde você fornece o tamanho e uma função de comparação.

    ```go
    import "sort"

    func exemploComSort() {
        numeros := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}
        alvo := 23

        // sort.SearchInts retorna o índice onde o alvo está ou deveria ser inserido
        // para manter a ordem. Por isso, precisamos verificar se o valor no índice é o alvo.
        indice := sort.SearchInts(numeros, alvo)

        if indice < len(numeros) && numeros[indice] == alvo {
            fmt.Printf("Encontrado com sort.SearchInts no índice %d\n", indice)
        } else {
            fmt.Println("Não encontrado com sort.SearchInts")
        }
    }
    ```

2.  **Garanta a Ordenação:** Antes de chamar a pesquisa, certifique-se de que os dados estão ordenados, usando `sort.Ints()`, `sort.Strings()`, etc.

### Resumo Rápido

*   **Pesquisa Binária** é um algoritmo de busca para dados **ordenados**.
*   Funciona **dividindo o problema pela metade** a cada passo.
*   É extremamente **eficiente** (complexidade **O(log n)**).
*   A principal condição é que a coleção de dados **deve estar ordenada**.
*   A implementação envolve ajustar os ponteiros `low` e `high` para estreitar a janela de busca.
*   Para código de produção, prefira as funções otimizadas e seguras do pacote `sort` da biblioteca padrão de Go.
