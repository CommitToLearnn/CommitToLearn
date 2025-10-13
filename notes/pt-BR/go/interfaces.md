# Interfaces em Go: Definindo Comportamentos, Não Coisas.

Imagine que você está montando uma equipe. Você precisa de alguém para uma função específica, digamos, "Aprovador de Despesas".

O que te importa? Te importa se a pessoa é um Gerente, um Diretor ou um Coordenador? Não. O que importa é que essa pessoa **seja capaz de executar a ação de "aprovar despesa"**.

Uma **interface** em Go é exatamente isso: um **contrato de trabalho**.

O contrato não diz *quem* você é (seus dados, como em uma `struct`). Ele apenas define *o que você deve ser capaz de fazer* (quais métodos você deve ter).

- **Contrato "AprovadorDeDespesas":**
  - *Requisito 1:* Deve ter um método `Aprovar(valor float64)`.

Qualquer tipo (`struct`) que "assine" este contrato, ou seja, que implemente o método `Aprovar(valor float64)`, pode ser tratado como um "AprovadorDeDespesas", não importa quais outros dados ou métodos ele tenha.

`Struct = A pessoa (Gerente, Diretor).`
`Interface = A função ou o papel (AprovadorDeDespesas).`

### O Conceito em Detalhes

Vamos seguir o processo de usar uma interface.

**Passo 1: Definir a Interface (O Contrato)**

Você define uma interface com a palavra-chave `interface`. Dentro dela, você lista apenas as **assinaturas dos métodos**.

```go
// Nosso contrato. Qualquer um que quiser ser um Notificador
// DEVE ter um método Enviar que recebe uma string.
type Notificador interface {
    Enviar(mensagem string)
}
```

**Passo 2: Criar os Tipos Concretos (As Pessoas)**

Agora, criamos nossas `structs` que vão "assinar" o contrato.

```go
type Email struct {
    Endereco string
}

type SMS struct {
    NumeroTelefone string
}
```

**Passo 3: Implementar o Contrato (Assinar o Contrato)**

Para cada `struct`, nós implementamos o método exigido pela interface `Notificador`. A implementação é **implícita**. Se um tipo tem todos os métodos que a interface exige, ele automaticamente satisfaz essa interface.

```go
func (e Email) Enviar(mensagem string) {
    fmt.Printf("Enviando email para %s: '%s'\n", e.Endereco, mensagem)
}

func (s SMS) Enviar(mensagem string) {
    fmt.Printf("Enviando SMS para %s: '%s'\n", s.NumeroTelefone, mensagem)
}
```

**Passo 4: Usar a Interface (Contratar Alguém para a Função)**

Agora, podemos criar uma função que não se importa com o tipo concreto. Ela só exige receber algo que cumpra o contrato de `Notificador`.

```go
func EnviarNotificacao(n Notificador, msg string) {
    n.Enviar(msg) // Funciona, pois o contrato garante que 'n' TEM um método Enviar.
}
```

### Por Que Isso Importa?

Interfaces são a chave para escrever código **flexível**, **desacoplado** e **testável**.

- **Desacoplamento:** A função `EnviarNotificacao` não sabe nada sobre `Email` ou `SMS`. Amanhã, você pode adicionar notificações via `Slack`, e a função `EnviarNotificacao` não precisará ser alterada.
- **Flexibilidade:** Permite criar funções que operam em uma ampla gama de tipos, contanto que eles compartilhem um comportamento em comum.
- **Testes:** Facilita a criação de "mocks" (implementações falsas) para testar sua lógica de negócio sem depender de sistemas externos, como um servidor de email real.
- **Generalização (O Tipo `any`):** Permitem criar funções que aceitam literalmente qualquer tipo de dado, como veremos a seguir.

### Exemplo Prático (Completo)

Vamos juntar tudo em um programa que você pode rodar.

```go
package main

import "fmt"

type Notificador interface {
    Enviar(mensagem string)
}

type Email struct { Endereco string }
type SMS struct { NumeroTelefone string }

func (e Email) Enviar(mensagem string) { /* ... */ }
func (s SMS) Enviar(mensagem string) { /* ... */ }

func MandarAlertaDeSistema(n Notificador, alerta string) {
    fmt.Println("Disparando alerta importante!")
    n.Enviar(alerta)
}

func (r Retangulo) Perimetro() float64 {
    return 2 * (r.Largura + r.Altura)
}

var f Forma = Retangulo{Largura: 10, Altura: 5}
fmt.Println(f.Area())
fmt.Println(f.Perimetro())
```
