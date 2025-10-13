# Slices em Go

Pense em um **Array** como uma **caixa de ovos de papelão**. Ela tem um tamanho fixo (6, 12, 18 ovos) e não pode ser alterada. Se você precisa de mais espaço, tem que comprar uma caixa nova e maior. Passar a caixa para um amigo significa dar a ele uma cópia exata, com os mesmos ovos.

Um **Slice**, por outro lado, é como uma **moldura de visualização sobre uma esteira de ovos na fábrica**.

*   **A Esteira (Array Subjacente)**: É uma longa sequência de ovos (dados) na memória.
*   **A Moldura (Slice)**: É uma janela leve e ajustável que você posiciona sobre a esteira. A moldura tem três propriedades:
    1.  **Ponteiro**: Onde a moldura começa na esteira.
    2.  **Comprimento (`len`)**: Quantos ovos você está vendo *dentro* da moldura agora.
    3.  **Capacidade (`cap`)**: Quantos ovos existem na esteira desde o início da sua moldura até o final da esteira. É o potencial de crescimento sem precisar de uma nova esteira.

Você pode deslizar ou redimensionar a moldura (criar um novo slice) para ver diferentes partes da mesma esteira, e isso é muito rápido. Se você precisar adicionar mais ovos e não houver mais espaço na esteira, a fábrica automaticamente move tudo para uma esteira maior (`append` alocando um novo array).

### O Conceito em Detalhes

Um slice é a forma mais comum e flexível de se trabalhar com listas de dados em Go. Ele é um tipo de referência que "aponta" para uma seção de um array.

**A Estrutura Interna de um Slice:**
Um slice é, na verdade, uma pequena `struct` que contém:
1.  Um **ponteiro** para o primeiro elemento do array subjacente que o slice pode acessar.
2.  O **comprimento (`len`)**: o número de elementos no slice.
3.  A **capacidade (`cap`)**: o número de elementos no array subjacente a partir do ponteiro do slice.

Entender a relação entre `len`, `cap` e o array subjacente é a chave para dominar os slices.

### Por Que Isso Importa?

*   **Flexibilidade**: Slices têm tamanho dinâmico, crescendo e encolhendo conforme a necessidade.
*   **Performance**: Passar um slice para uma função é barato, pois você está apenas copiando a pequena struct do slice (ponteiro, len, cap), e não todos os dados do array subjacente.
*   **Poder**: Permitem criar "visões" de um mesmo conjunto de dados sem a necessidade de cópias, através da operação de "fatiamento" (slicing).

### Exemplos Práticos

#### Exemplo 1: Criando e Usando Slices

```go
package main

import "fmt"

func main() {
    // 1. Criando com um slice literal (forma mais comum)
    // len=4, cap=4
    frutas := []string{"Maçã", "Banana", "Laranja", "Uva"}
    fmt.Printf("Frutas: %v, len: %d, cap: %d\n", frutas, len(frutas), cap(frutas))

    // 2. Usando make() para pré-alocar
    // len=0, cap=5. Ótimo para quando você sabe que vai adicionar itens.
    numeros := make([]int, 0, 5)
    fmt.Printf("Números: %v, len: %d, cap: %d\n", numeros, len(numeros), cap(numeros))

    // 3. Adicionando elementos com append()
    // A função append retorna um NOVO slice. É crucial reatribuir!
    numeros = append(numeros, 10)
    numeros = append(numeros, 20)
    fmt.Printf("Números: %v, len: %d, cap: %d\n", numeros, len(numeros), cap(numeros))
}
```

#### Exemplo 2: Fatiando (Slicing) e o Array Subjacente

```go
package main

import "fmt"

func main() {
    // Array subjacente original
    planetas := []string{"Mercúrio", "Vênus", "Terra", "Marte", "Júpiter", "Saturno"}

    // Criando "visões" (slices) do array original
    // Sintaxe: slice[inicio:fim] (o 'fim' é exclusivo)
    planetasRochosos := planetas[0:4] // len=4, cap=6
    gigantesGasosos := planetas[4:6] // len=2, cap=2

    fmt.Println("Planetas Rochosos:", planetasRochosos)
    fmt.Println("Gigantes Gasosos:", gigantesGasosos)

    // Modificando um elemento no slice...
    planetasRochosos[2] = "Planeta Água (Terra)"

    // ...afeta o slice original e qualquer outro slice que compartilhe o mesmo array!
    fmt.Println("\nApós modificação:")
    fmt.Println("Slice Original:", planetas) // O original foi modificado!
}
```

### Armadilhas Comuns

1.  **Esquecer de Reatribuir o `append`**: A função `append` pode precisar criar um novo array subjacente e, portanto, retorna um novo slice. Se você não fizer `meuSlice = append(meuSlice, ...)`, pode perder os elementos adicionados.

2.  **Modificação Inesperada**: Modificar um elemento em um slice pode afetar outros slices que foram criados a partir do mesmo array subjacente. Para criar uma cópia independente, use a função `copy()`.
    ```go
    sliceOriginal := []int{1, 2, 3}
    sliceCopia := make([]int, len(sliceOriginal))
    copy(sliceCopia, sliceOriginal)
    
    sliceCopia[0] = 99 // Não afeta o sliceOriginal
    ```

### Boas Práticas

1.  **Use `make` com Capacidade**: Se você tem uma estimativa de quantos elementos seu slice terá, use `make([]T, 0, capacidadeEstimada)`. Isso evita múltiplas realocações do array subjacente, melhorando a performance.

2.  **Slice Nulo é Válido**: Um slice `nil` (não inicializado) é perfeitamente funcional. Você pode usar `append` nele sem problemas.
    ```go
    var s []int // s é nil
    s = append(s, 10) // Agora s é []int{10}
    ```

3.  **Passe Slices por Valor**: Sempre passe slices para funções por valor (`func minhaFuncao(s []int)`). Como o slice é um tipo de referência (uma pequena struct), a cópia é barata e a função ainda poderá modificar os elementos do array subjacente.

### Resumo Rápido

*   **Slice**: Uma visão flexível e dinâmica sobre um **array subjacente**.
*   **Estrutura**: Contém um **ponteiro**, um **comprimento (`len`)** e uma **capacidade (`cap`)**.
*   **Criação**: Use literais `[]T{...}` para simplicidade ou `make([]T, len, cap)` para performance.
*   **`append`**: A função para adicionar elementos. **Sempre reatribua o resultado**.
*   **Fatiamento**: Cria novos slices que **compartilham** o mesmo array subjacente.
*   **Cópia**: Use a função `copy()` para criar um slice verdadeiramente independente.