### **`defer`: O Agendador de Limpeza Confiável**

Pense no `defer` como colocar uma nota de **"fazer isso antes de sair"** na porta de um quarto. Não importa como ou quando você saia do quarto (retornando normalmente, por uma porta lateral de erro, ou até mesmo sendo jogado pela janela em um pânico), a tarefa na nota será executada.

**O Problema Resolvido**
`defer` garante que certas ações de "limpeza" – como fechar arquivos, liberar travas (mutexes) ou fechar conexões de banco de dados – sejam executadas ao final de uma função, independentemente de como a função termine. Isso torna o código muito mais robusto e evita vazamento de recursos.

**Regras Fundamentais:**

1.  **Execução no Final da Função:** A chamada da função adiada é executada logo antes de a função que a contém retornar.

2.  **Argumentos Avaliados Imediatamente:** Os argumentos de uma chamada `defer` são avaliados no momento em que o `defer` é encontrado, não quando a chamada é executada. Esta é uma nuance crucial!

3.  **Ordem LIFO (Last-In, First-Out):** Se houver múltiplos `defer`s em uma função, eles são executados na ordem inversa em que foram declarados (como uma pilha).

**Exemplo Prático (LIFO e Avaliação de Argumentos):**
```go
func exemploDefer() {
    fmt.Println("Iniciando a função.")

    // O valor de 'i' (0) é lido e guardado AGORA.
    for i := 0; i < 3; i++ {
        defer fmt.Println("Defer na iteração:", i)
    }

    fmt.Println("Função prestes a terminar.")
}
// Saída:
// Iniciando a função.
// Função prestes a terminar.
// Defer na iteração: 2  <-- Último a ser declarado, primeiro a ser executado
// Defer na iteração: 1
// Defer na iteração: 0  <-- Primeiro a ser declarado, último a ser executado
```
O `defer` é perfeito para ser colocado logo após a alocação de um recurso, garantindo que sua liberação nunca seja esquecida. Ex: `arquivo, err := os.Open(...)` seguido imediatamente por `defer arquivo.Close()`.