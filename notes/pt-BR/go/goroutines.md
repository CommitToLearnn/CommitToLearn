# Goroutines: Os Trabalhadores Leves e Concorrentes de Go

Imagine que você é o gerente de uma grande cozinha (`main`) e precisa preparar vários pratos ao mesmo tempo: picar vegetais, cozinhar o arroz e grelhar a carne.

*   **Abordagem Sequencial (Sem Goroutines):** Você, o gerente, faz tudo sozinho, uma tarefa após a outra. Você pica todos os vegetais, depois cozinha todo o arroz e, por fim, grelha toda a carne. Se uma tarefa for demorada (cozinhar o arroz), todo o resto fica parado esperando.

*   **Abordagem Concorrente (Com Goroutines):** Você contrata três chefs assistentes (as **goroutines**). Você simplesmente diz:
    *   "Chef A, pique os vegetais!" (`go picarVegetais()`)
    *   "Chef B, cozinhe o arroz!" (`go cozinharArroz()`)
    *   "Chef C, grelhe a carne!" (`go grelharCarne()`)

Você, o gerente, não espera por eles. Você entrega a instrução e eles começam a trabalhar **simultaneamente** e de forma independente. Isso é concorrência.

**Goroutines** são os "trabalhadores" que Go usa para executar tarefas de forma concorrente. Elas são extremamente leves em comparação com as *threads* tradicionais dos sistemas operacionais, e Go pode gerenciar milhares (ou milhões) delas facilmente.

### O Conceito em Detalhes

Uma goroutine é simplesmente uma função ou método que é executado de forma concorrente com o resto do programa.

#### Criando uma Goroutine

A sintaxe para iniciar uma goroutine é uma das mais elegantes de Go: basta usar a palavra-chave `go` antes de uma chamada de função.

```go
// Uma função normal
func tarefaDemorada() {
    time.Sleep(2 * time.Second)
    fmt.Println("Tarefa demorada concluída.")
}

// Para executá-la de forma concorrente, fazemos:
go tarefaDemorada()

// O programa NÃO espera aqui. Ele continua a execução da próxima linha imediatamente.
fmt.Println("Instrução entregue. A tarefa está rodando em segundo plano.")
```

#### O Problema da Goroutine Principal (`main`)

Um ponto crucial: se a goroutine `main` (seu programa principal) terminar, **todas as outras goroutines são encerradas abruptamente**, não importa se terminaram seu trabalho ou não.

É como o gerente da cozinha que vai embora e apaga as luzes no meio do expediente. Todos os chefs param o que estão fazendo e vão para casa.

```go
package main

import "fmt"

func digaOla() {
    fmt.Println("Olá de outra goroutine!")
}

func main() {
    go digaOla()
    // A função main não espera. Ela inicia a goroutine e termina.
    // É muito provável que a mensagem "Olá..." NUNCA seja impressa.
}
```

Para resolver isso, precisamos de uma forma de **sincronizar** e esperar que as goroutines terminem.

### Por Que Isso Importa?

Goroutines são a base da famosa capacidade de Go de lidar com alta concorrência, o que é essencial para:
*   **Servidores Web:** Atender milhares de requisições de clientes simultaneamente. Cada requisição pode ser tratada em sua própria goroutine.
*   **Processamento de Dados em Paralelo:** Dividir um grande volume de dados e processar os pedaços em paralelo para acelerar o trabalho.
*   **Aplicações Responsivas:** Manter a interface do usuário responsiva enquanto tarefas pesadas rodam em segundo plano.

Elas tornam a programação concorrente, um tópico notoriamente complexo em outras linguagens, muito mais acessível.

### Exemplos Práticos

#### Exemplo 1: O Problema da `main` e a Solução "Ruim" (`time.Sleep`)

Aqui, forçamos a `main` a esperar usando `time.Sleep`. **Esta não é uma boa prática**, pois você não sabe exatamente quanto tempo a outra goroutine levará.

```go
package main

import (
    "fmt"
    "time"
)

func mostrarNumeros() {
    for i := 1; i <= 5; i++ {
        time.Sleep(250 * time.Millisecond)
        fmt.Printf("%d ", i)
    }
}

func main() {
    fmt.Println("Iniciando goroutine...")
    go mostrarNumeros() // Inicia a contagem em segundo plano.

    fmt.Println("Main esperando...")
    // Solução ruim: "chutar" um tempo de espera.
    time.Sleep(2 * time.Second)

    fmt.Println("\nMain terminando.")
}
```
**Output:**
```
Iniciando goroutine...
Main esperando...
1 2 3 4 5 
Main terminando.
```

#### Exemplo 2: A Solução Correta com `sync.WaitGroup`

Um `sync.WaitGroup` é a ferramenta idiomática para esperar por um conjunto de goroutines. Pense nele como uma lista de chamada.

*   `wg.Add(N)`: O gerente diz: "Estou esperando por **N** chefs terminarem".
*   `wg.Done()`: Um chef, ao terminar seu prato, grita: "Terminei!". (Decrementa o contador).
*   `wg.Wait()`: O gerente espera na porta até que todos os chefs tenham gritado "Terminei!".

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// A função agora aceita um WaitGroup para sinalizar quando terminar.
func trabalhador(id int, wg *sync.WaitGroup) {
    // Garante que wg.Done() seja chamado quando a função retornar.
    defer wg.Done()

    fmt.Printf("Trabalhador %d começando\n", id)
    time.Sleep(1 * time.Second) // Simula trabalho
    fmt.Printf("Trabalhador %d terminando\n", id)
}

func main() {
    // 1. Cria um WaitGroup.
    var wg sync.WaitGroup

    // 2. Inicia 3 goroutines.
    for i := 1; i <= 3; i++ {
        fmt.Printf("Main: iniciando trabalhador %d\n", i)
        // 3. Incrementa o contador do WaitGroup para cada goroutine.
        wg.Add(1)
        // 4. Passa o ponteiro do WaitGroup para a goroutine.
        go trabalhador(i, &wg)
    }

    fmt.Println("Main: esperando as goroutines terminarem...")
    // 5. Bloqueia a execução da main até que o contador do WaitGroup chegue a zero.
    wg.Wait()

    fmt.Println("Main: todas as goroutines terminaram. Fim do programa.")
}
```

### Armadilhas Comuns

1.  **Esquecer de Sincronizar:** Como no primeiro exemplo, iniciar goroutines e deixar a `main` terminar antes delas, perdendo o trabalho.

2.  **Condições de Corrida (Race Conditions):** Duas ou mais goroutines acessando e modificando a mesma variável ao mesmo tempo, levando a resultados imprevisíveis.
    ```go
    var contador int
    go func() { contador++ }() // Lê, incrementa, escreve
    go func() { contador++ }() // Lê, incrementa, escreve
    // O resultado final de 'contador' pode ser 1 ou 2!
    ```
    Para detectar isso, use o "race detector" do Go: `go run -race main.go`. Para resolver, use **canais** ou **mutexes**.

### Boas Práticas

1.  **Use `sync.WaitGroup` para Esperar:** É a forma padrão e segura de garantir que um grupo de goroutines conclua seu trabalho.

2.  **Não Comunique Compartilhando Memória; Compartilhe Memória Comunicando:** Este é o mantra de Go. Em vez de usar travas (`mutexes`) para proteger o acesso a dados compartilhados, prefira usar **canais (`channels`)** para passar os dados de uma goroutine para outra de forma segura.

3.  **Goroutines são Baratas, mas não Gratuitas:** Embora você possa criar milhares delas, cada uma ainda consome um pouco de memória. Evite criar goroutines em um loop infinito sem controle.

### Resumo Rápido

*   **Goroutines** são funções executadas de forma **concorrente**.
*   Crie uma com a palavra-chave `go`.
*   São extremamente **leves** e gerenciadas pelo runtime de Go.
*   Se a `main` termina, todas as goroutines morrem.
*   Use `sync.WaitGroup` para esperar que um grupo de goroutines termine seu trabalho.
*   Goroutines são a base da alta performance e concorrência em Go, tornando simples o que é complexo em muitas outras linguagens.
