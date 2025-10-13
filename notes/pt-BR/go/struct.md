# Structs em Go: Criando Seus Próprios Tipos de Dados

Imagine que você precisa guardar informações sobre livros em uma biblioteca. Para cada livro, você precisa do Título, do Autor e do Ano de Publicação.

Você poderia usar variáveis separadas:
`titulo1 := "O Hobbit"`
`autor1 := "J.R.R. Tolkien"`
`ano1 := 1937`

Funciona, mas... e para 100 livros? Seria um caos de variáveis!

Uma **`struct`** resolve isso. Pense nela como uma **ficha cadastral em branco**, um molde. Você define os campos que toda ficha precisa ter:

- **Campo "Título":** (deve ser um texto)
- **Campo "Autor":** (deve ser um texto)
- **Campo "Ano":** (deve ser um número)

Uma vez que você tem esse molde (`struct`), você pode "preencher" quantas fichas (`instâncias`) quiser, uma para cada livro. Todos os dados de um mesmo livro ficam bem organizados em um único lugar.

`Struct = O molde (a ficha cadastral)`
`Instância da Struct = A ficha preenchida`

### O Conceito em Detalhes

Vamos detalhar o processo em três passos simples.

**Passo 1: Definir o Molde (`struct`)**

Usamos as palavras-chave `type` e `struct` para criar nosso novo tipo de dado.

```go
// Definindo nosso molde para um Livro
type Livro struct {
    Titulo string
    Autor  string
    Ano    int
}
```
Isso não cria nenhum livro. Apenas ensinamos ao Go o que é um "Livro". A partir de agora, `Livro` é um tipo tão válido quanto `string` ou `int`.

**Passo 2: Criar uma Instância (Preencher a Ficha)**

Agora, vamos usar nosso molde para criar uma variável que representa um livro de verdade.

```go
// Criando uma variável 'meuLivro' do tipo Livro
meuLivro := Livro{
    Titulo: "O Hobbit",
    Autor:  "J.R.R. Tolkien",
    Ano:    1937,
}
```
`meuLivro` é agora uma "unidade" que contém todos os dados de forma organizada.

**Passo 3: Acessar os Campos (Ler a Ficha)**

Para ler ou modificar os dados dentro da nossa instância, usamos o ponto (`.`).

```go
fmt.Println(meuLivro.Titulo) // Saída: O Hobbit

// Podemos também alterar um campo
meuLivro.Ano = 1938 // Oops, errei o ano, vamos corrigir.
fmt.Println(meuLivro.Ano)    // Saída: 1938
```

### Por Que Isso Importa?

Structs são a espinha dorsal para organizar dados em Go.

- **Agrupamento Lógico:** Elas juntam dados que pertencem uns aos outros. Sem elas, seu código seria uma sopa de variáveis soltas.
- **Clareza:** É muito mais fácil entender o que sua função faz quando ela recebe um `Livro` em vez de receber um `string`, outro `string` e um `int`.
- **Fundação para o Comportamento:** Depois de ter seus dados organizados em uma `struct`, o próximo passo é dar a ela "ações" (o que chamamos de métodos). A `struct` é o primeiro passo essencial.

### Exemplos Práticos

Vamos ver um pequeno programa que define e usa uma `struct`.

```go
package main

import "fmt"

// Nosso molde
type Produto struct {
    Nome     string
    Preco    float64
    EmEstoque bool
}

func main() {
    // Criando uma instância para um "Café"
    cafe := Produto{
        Nome:     "Café Especial",
        Preco:    25.50,
        EmEstoque: true,
    }

    // Criando outra instância para um "Açúcar"
    acucar := Produto{
        Nome:     "Açúcar Orgânico",
        Preco:    8.00,
        EmEstoque: false,
    }

    fmt.Printf("Produto: %s, Preço: R$%.2f\n", cafe.Nome, cafe.Preco)
    // Saída: Produto: Café Especial, Preço: R$25.50

    fmt.Printf("Produto: %s, Em estoque? %t\n", acucar.Nome, acucar.EmEstoque)
    // Saída: Produto: Açúcar Orgânico, Em estoque? false
}
```
Viu como o mesmo molde `Produto` foi usado para criar dois itens completamente diferentes? Isso é reutilização!

### Armadilhas Comuns

- **O "Valor Zero":** Se você criar uma `struct` sem preencher os campos, Go não dará erro. Ele preencherá cada campo com seu "valor zero" padrão.
  - `string` vira `""` (string vazia)
  - `int` e `float` viram `0`
  - `bool` vira `false`
  ```go
  var produtoVazio Produto
  fmt.Println(produtoVazio.Nome) // Saída: "" (uma string vazia)
  ```
  Isso é útil, mas pode pegar iniciantes de surpresa.

- **Letras Maiúsculas vs. Minúsculas:** Em Go, a primeira letra do nome de um campo é MUITO importante.
  - **`Nome string` (Maiúscula):** O campo é "público" (exportado). Pode ser acessado por outros pacotes do seu programa.
  - **`nome string` (Minúscula):** O campo é "privado". Só pode ser acessado por código dentro do mesmo pacote.

### Boas Práticas

- **Use Funções "Construtoras" (ou Fábricas):** É uma ótima prática criar uma função para construir suas structs. Isso garante que elas sejam sempre inicializadas corretamente.
  ```go
  func NewProduto(nome string, preco float64) Produto {
      return Produto{
          Nome:     nome,
          Preco:    preco,
          EmEstoque: true, // Todo produto novo começa em estoque
      }
  }

  // Uso:
  // cha := NewProduto("Chá Verde", 15.00)
  ```

- **Composição em vez de Herança:** Em vez de uma `struct` "herdar" de outra, em Go nós colocamos uma `struct` dentro de outra. Isso é chamado de composição.
  ```go
  type Dimensoes struct {
      Altura float64
      Largura float64
  }

  type Caixa struct {
      Material string
      Tamanho  Dimensoes // Uma struct dentro de outra!
  }
  ```

### Resumo Rápido
- **`struct`**: É um molde que agrupa campos de dados. É como criar seu próprio tipo de dado.
- **Instância**: Uma variável criada a partir de um molde `struct`, com os dados preenchidos.
- **Acesso**: Use o ponto (`.`) para ler ou escrever nos campos de uma instância.
- **Valor Zero**: Campos não inicializados recebem um valor padrão (`0`, `""`, `false`).
- **Capitalização**: A primeira letra do nome do campo define se ele é público (acessível de fora) ou privado.
- **Próximo Passo**: Agora que sabemos como guardar os dados, vamos aprender a dar ações a eles com os **métodos**.