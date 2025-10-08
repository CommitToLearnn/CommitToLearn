### **`for`: O Único Loop que Você Precisa**

Pense no `for` de Go como um **canivete suíço para repetições**. Enquanto outras linguagens têm `while`, `do-while`, `for`, `foreach`, Go unifica tudo em uma única e flexível palavra-chave `for`. A partir do Go 1.22, esse canivete ganhou ainda mais lâminas úteis.

**O Problema Resolvido**
O `for` resolve a necessidade de executar um bloco de código repetidamente, seja um número fixo de vezes, enquanto uma condição for verdadeira, ou para cada item de uma coleção.

**As Cinco Faces do `for` em Go:**

1.  **O "for" Clássico (estilo C):** Com inicialização, condição e pós-execução.
    ```go
    for i := 0; i < 5; i++ {
        fmt.Println("Clássico:", i)
    }
    ```

2.  **O "while":** Usando apenas a condição.
    ```go
    n := 0
    for n < 5 {
        fmt.Println("While:", n)
        n++
    }
    ```

3.  **O Loop Infinito:** Sem nenhuma condição (usado com `break` ou em goroutines).
    ```go
    for {
        fmt.Println("Loop infinito! (use break para sair)")
        break
    }
    ```

4.  **O `for...range` sobre Coleções:** Para iterar sobre slices, arrays, maps, strings e channels.
    ```go
    nomes := []string{"Ana", "Bia", "Caio"}
    for indice, nome := range nomes {
        fmt.Printf("Índice: %d, Nome: %s\n", indice, nome)
    }
    ```

5.  **NOVO (Go 1.22+): O `for...range` sobre um Inteiro:** A forma moderna e limpa de contar. Esta é uma adição fantástica para a legibilidade do código. Em vez de escrever o clássico e verboso `for i := 0; i < N; i++`, agora você pode iterar diretamente sobre um número.
    ```go
    // Itera de 0 a 9 (10 vezes no total)
    for i := range 10 {
        fmt.Println("Range sobre inteiro:", i)
    }

    // Se você não precisa do índice, a sintaxe fica ainda mais limpa.
    // Apenas repete a ação 3 vezes.
    for range 3 {
        fmt.Println("Ping!")
    }
    ```
    Esta sintaxe é mais concisa, menos propensa a erros de digitação ou "off-by-one", e expressa melhor a intenção de "fazer algo N vezes".

**Atualização Crucial (Go 1.22+): A Revolução do `for...range`**
O Go 1.22 trouxe **duas melhorias fundamentais** para os loops `for...range`. A que vimos acima (range sobre inteiros) e uma mudança de semântica que corrige uma das armadilhas mais comuns da linguagem.

*   **O Problema Antigo (Antes de Go 1.22):** Ao iterar sobre coleções, as variáveis de iteração (ex: `indice`, `nome`) eram declaradas **uma única vez** para todo o loop. Seus valores eram apenas atualizados a cada iteração. Isso causava bugs sutis ao usar goroutines ou closures, pois todas elas capturavam um ponteiro para a *mesma variável*, que no final do loop continha o valor da *última iteração*.

*   **A Solução (Go 1.22 e posterior):** A cada iteração do loop, uma **nova instância** das variáveis de iteração é criada. Isso significa que closures e goroutines agora capturam a variável correta para aquela iteração específica, como intuitivamente esperado.

**Exemplo Prático (A diferença do Go 1.22):**
```go
import (
    "fmt"
    "time"
)

func main() {
    nomes := []string{"Ana", "Bia", "Caio"}

    for _, nome := range nomes {
        go func() {
            // Em Go 1.21 ou anterior: Imprimiria "Caio" 3 vezes (bug comum).
            // Em Go 1.22 ou posterior: Imprime "Ana", "Bia", "Caio" (em ordem não garantida).
            fmt.Println("Olá,", nome)
        }()
    }
    time.Sleep(1 * time.Second) // Espera as goroutines terminarem.
}
```
**Esta mudança de semântica, junto com o range sobre inteiros, torna o `for` em Go 1.22+ significativamente mais seguro, legível e poderoso.**