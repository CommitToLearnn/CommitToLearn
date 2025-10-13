# Métodos em Go: Dando Superpoderes às Suas Structs.

Na nota anterior, criamos uma `struct` para ser a "ficha cadastral" de um personagem de RPG. Ela guarda os dados: Nome, HP, Mana, etc.

Mas o personagem não é só um monte de números. Ele precisa **fazer coisas**: atacar, se curar, falar.

Um **método** é exatamente isso: uma **ação** que está diretamente ligada a uma `struct`.

Se a `struct` é o **substantivo** (o `Jogador`), o `método` é o **verbo** (o que o `Jogador` *faz*).

Em vez de uma função solta chamada `AtacarInimigo(jogador, inimigo)`, você terá uma ação que o próprio jogador executa: `jogador.Atacar(inimigo)`. A ação pertence a ele!

`Struct = Quem você é (seus atributos)`
`Método = O que você pode fazer (suas ações)`

### O Conceito em Detalhes

Um método é, na prática, uma função com um "dono". Esse dono é chamado de **receptor** (receiver).

**Passo 1: Comece com uma `struct`**

Você não pode ter um método sem uma `struct` para ele pertencer. Vamos usar uma `struct` de Retângulo.

```go
type Retangulo struct {
    Largura float64
    Altura  float64
}
```

**Passo 2: Defina o Método com um Receptor**

A sintaxe é quase igual à de uma função, mas com uma parte extra antes do nome: `(r Retangulo)`.

```go
// A parte (r Retangulo) é o receptor.
// Ela "conecta" a função Area à struct Retangulo.
func (r Retangulo) Area() float64 {
    return r.Largura * r.Altura
}
```
Isso diz ao Go: "Qualquer variável do tipo `Retangulo` agora tem uma ação chamada `Area`". Dentro do método, `r` é o apelido para a instância específica de Retângulo que chamou a ação.

**Passo 3: Chame o Método a partir de uma Instância**

Crie uma instância da sua `struct` e use o ponto (`.`) para invocar a ação.

```go
meuRetangulo := Retangulo{Largura: 10, Altura: 5}

// Chamando o método que pertence a 'meuRetangulo'
areaDoRetangulo := meuRetangulo.Area()

fmt.Println(areaDoRetangulo) // Saída: 50
```

### Por Que Isso Importa?

- **Intuitividade:** O código se torna mais legível e se parece mais com o mundo real. `carro.Acelerar()` faz mais sentido do que `AcelerarUmCarro(carro)`.
- **Organização (Encapsulamento):** Toda a lógica relacionada a um tipo de dado fica junto dele. Se você precisa mudar como a área de um retângulo é calculada, você sabe exatamente onde ir: no método `Area()` da `struct` `Retangulo`.
- **É o jeito Go de ser:** Go não tem "classes". A combinação de `structs` (para os dados) e `métodos` (para o comportamento) é a forma idiomática de se programar de maneira organizada em Go.

### Exemplos Práticos: A Grande Pegadinha

Vamos criar uma `struct` `ContaBancaria` com métodos para depositar e ver o saldo. E aqui vamos encontrar a armadilha mais comum.

```go
package main

import "fmt"

type ContaBancaria struct {
    Titular string
    Saldo   float64
}

// Método para ver o saldo (só lê dados)
func (c ContaBancaria) VerSaldo() {
    fmt.Printf("Saldo de %s: R$%.2f\n", c.Titular, c.Saldo)
}

// Método para depositar (tenta modificar dados)
func (c ContaBancaria) Depositar(valor float64) {
    c.Saldo += valor
    fmt.Printf("Depositando R$%.2f... Novo saldo (temporário): R$%.2f\n", valor, c.Saldo)
}

func main() {
    minhaConta := ContaBancaria{Titular: "Ana", Saldo: 1000.0}
    minhaConta.VerSaldo() // Saída: Saldo de Ana: R$1000.00

    // Vamos depositar 200
    minhaConta.Depositar(200.0) // Saída: Depositando R$200.00... Novo saldo (temporário): R$1200.00

    // Vamos verificar o saldo final...
    minhaConta.VerSaldo() // Saída: Saldo de Ana: R$1000.00  <-- UÉ?! O SALDO NÃO MUDOU!
}
```
Por que o depósito não funcionou?

### Armadilhas Comuns

- **Receptor de Valor (A Fotocópia):**
  - Quando você define um método com `(c ContaBancaria)`, Go passa uma **CÓPIA** da sua `struct` para dentro do método.
  - O método `Depositar` adicionou R$ 200 ao saldo da **cópia**, não da `minhaConta` original. Quando o método terminou, a cópia foi jogada fora.
  - Pense nisso como editar uma fotocópia de um documento. O original permanece intacto.

- **Nomeando o Receptor:**
  - A convenção em Go é usar um nome curto e de uma letra, geralmente a primeira letra do tipo (`c` para `ContaBancaria`, `r` para `Retangulo`).

### Boas Práticas

- **Use um Receptor de Ponteiro para Modificar:**
  - Para realmente modificar a `struct` original, você precisa passar seu "endereço na memória", não uma cópia. Fazemos isso com um asterisco (`*`), criando um **receptor de ponteiro**.

  **Exemplo Corrigido:**
  ```go
  // O asterisco em *ContaBancaria é a chave!
  func (c *ContaBancaria) Depositar(valor float64) {
      c.Saldo += valor // Agora 'c' aponta para a conta original.
  }

  // Se você rodar o main() de novo com este método corrigido,
  // o saldo final será 1200.00. Agora funciona!
  ```

- **A Regra de Ouro da Consistência:**
  - **Pergunta:** O método precisa **modificar** a `struct`?
    - **Sim:** Use um receptor de ponteiro (`*Tipo`).
    - **Não (só precisa ler):** Um receptor de valor (`Tipo`) tecnicamente funciona.
  - **MAS, a melhor prática é:** Se **qualquer** método de uma `struct` precisa de um receptor de ponteiro, por consistência, **faça todos os métodos daquela `struct` usarem um receptor de ponteiro**. Isso evita confusão e bugs sutis.

### Resumo Rápido
- **Método**: Uma função que pertence a uma `struct`.
- **Receptor**: A parte `(variavel Tipo)` que conecta a função à `struct`.
- **Receptor de Valor (`c ContaBancaria`)**: Opera em uma **cópia**. Ideal para métodos que apenas **leem** dados.
- **Receptor de Ponteiro (`c *ContaBancaria`)**: Opera na `struct` **original**. **Necessário** para métodos que **modificam** dados.
- **Chamada**: A sintaxe é a mesma para ambos (`instancia.Metodo()`), Go cuida da mágica para você.
- **Regra Prática**: Precisa alterar a `struct`? Use ponteiro. Para ser consistente, use ponteiros em todos os métodos daquele tipo.