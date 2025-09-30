### Funções em Go - Chamando com e sem Parâmetros

**O Que é uma Função em Go?**

Uma função é um **bloco de código nomeado** que realiza uma tarefa específica. Elas são a principal forma de organizar o código em Go, tornando-o mais legível, reutilizável e fácil de manter.

Pense em uma função como uma receita: você a define uma vez e pode "executá-la" (chamá-la) quantas vezes quiser, com diferentes "ingredientes" (parâmetros).

A sintaxe básica de uma função em Go é:

```go
func nomeDaFuncao(parametros) tipoDeRetorno {
    // Corpo da função - o que ela faz
}
```

Vamos explorar os dois casos principais: funções sem e com parâmetros.


### Funções Sem Parâmetros

Este é o tipo mais simples de função. Ela é um bloco de código autônomo que sempre executa a mesma tarefa, pois não recebe nenhuma informação externa para modificar seu comportamento.

**Analogia:** Pense em um interruptor de luz. A função dele é "acender a luz". Você não precisa dar nenhuma informação extra a ele; você apenas o "chama" (aperta), e ele faz o seu trabalho.

#### Definindo uma Função Sem Parâmetros

Você define a função usando a palavra-chave `func`, seguida por um nome e parênteses vazios `()`.

```go
// arquivo: main.go
package main

import "fmt"

// Esta função sempre imprime a mesma saudação.
// Não precisa de nenhuma informação de fora.
func saudacaoSimples() {
    fmt.Println("Olá! Esta é uma função simples.")
}
```

#### Chamando uma Função Sem Parâmetros

Para executar a função, você simplesmente escreve o nome dela seguido por parênteses vazios.

```go
// Dentro da função main ou de outra função:
saudacaoSimples()
```

**Exemplo Completo:**

```go
package main

import "fmt"

// Definição da função
func saudacaoSimples() {
    fmt.Println("Olá! Esta é uma função simples.")
}

// Ponto de entrada do programa
func main() {
    fmt.Println("Vou chamar a função agora...")
    
    // Chamada da função
    saudacaoSimples()
    
    fmt.Println("A função foi executada!")
}
```

**Saída:**
```
Vou chamar a função agora...
Olá! Esta é uma função simples.
A função foi executada!
```

### Funções Com Parâmetros

Estas funções são mais flexíveis e poderosas. Elas podem receber dados (os **parâmetros**) quando são chamadas, e usar esses dados para realizar sua tarefa.

**Analogia:** Pense em uma máquina de café. Ela pode fazer café, mas sua ação depende do que você pede (o parâmetro). Se você pedir "espresso", ela faz um espresso. Se pedir "cappuccino", ela faz um cappuccino. A função é a mesma ("fazer café"), mas o resultado muda com base na informação que você fornece.

#### Definindo uma Função Com Parâmetros

Dentro dos parênteses, você declara os parâmetros, especificando um **nome** e um **tipo** para cada um.

```go
// arquivo: main.go
package main

import "fmt"

// Esta função recebe um parâmetro chamado 'nome' do tipo 'string'.
func saudacaoPersonalizada(nome string) {
    // Ela usa o valor do parâmetro 'nome' para customizar a saudação.
    fmt.Println("Olá,", nome, "! Bem-vindo(a).")
}

// Função com múltiplos parâmetros
func apresentar(nome string, idade int) {
    fmt.Printf("Meu nome é %s e eu tenho %d anos.\n", nome, idade)
}
```
**Ponto importante em Go:** A sintaxe é `nomeDoParametro tipoDoParametro`.

#### Chamando uma Função Com Parâmetros

Ao chamar a função, você passa os valores (os **argumentos**) dentro dos parênteses, na mesma ordem em que os parâmetros foram definidos.

```go
// Dentro da função main ou de outra função:
saudacaoPersonalizada("Alice")
saudacaoPersonalizada("Beto")
apresentar("Carlos", 30)
```
*   **Parâmetro:** É a variável na definição da função (ex: `nome string`).
*   **Argumento:** É o valor que você passa na chamada da função (ex: `"Alice"`).

**Exemplo Completo:**

```go
package main

import "fmt"

// Definição da função com um parâmetro
func saudacaoPersonalizada(nome string) {
    fmt.Println("Olá,", nome, "! Bem-vindo(a).")
}

// Definição da função com dois parâmetros
func apresentar(nome string, idade int) {
    fmt.Printf("Meu nome é %s e eu tenho %d anos.\n", nome, idade)
}

func main() {
    // Chamando a função com diferentes argumentos
    saudacaoPersonalizada("Alice")
    saudacaoPersonalizada("Beto")
    
    fmt.Println("---")
    
    apresentar("Carlos", 30)
}
```

**Saída:**
```
Olá, Alice ! Bem-vindo(a).
Olá, Beto ! Bem-vindo(a).
---
Meu nome é Carlos e eu tenho 30 anos.
```

### Bônus: Funções que Retornam Valores

Além de receber parâmetros, as funções podem **retornar** um resultado. Você especifica o tipo do valor de retorno após a lista de parâmetros.

```go
package main

import "fmt"

// Esta função recebe dois inteiros e retorna um inteiro.
func somar(a int, b int) int {
    // A palavra-chave 'return' envia o resultado de volta.
    return a + b
}

func main() {
    // Chamamos a função e armazenamos o valor retornado em uma variável.
    resultado := somar(5, 3)
    
    fmt.Println("O resultado da soma é:", resultado)
}
```

**Saída:**
```
O resultado da soma é: 8
```