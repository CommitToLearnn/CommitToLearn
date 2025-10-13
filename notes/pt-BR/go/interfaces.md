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

Você define uma interface com a palavra-chave `interface`. Dentro dela, você lista apenas as **assinaturas dos métodos** (o nome, os parâmetros e os retornos). Não há código, não há implementação.

```go
// Nosso contrato. Qualquer um que quiser ser um Notificador
// DEVE ter um método Enviar que recebe uma string.
type Notificador interface {
    Enviar(mensagem string)
}
```

**Passo 2: Criar os Tipos Concretos (As Pessoas)**

Agora, criamos nossas `structs` que vão "assinar" o contrato. Note que elas são diferentes entre si.

```go
type Email struct {
    Endereco string
    Assunto  string
}

type SMS struct {
    NumeroTelefone string
}
```

**Passo 3: Implementar o Contrato (Assinar o Contrato)**

Agora, para cada `struct`, nós implementamos o método exigido pela interface `Notificador`.

```go
// Email implementa o método Enviar
func (e Email) Enviar(mensagem string) {
    fmt.Printf("Enviando email para %s: '%s'\n", e.Endereco, mensagem)
}

// SMS também implementa o método Enviar
func (s SMS) Enviar(mensagem string) {
    fmt.Printf("Enviando SMS para %s: '%s'\n", s.NumeroTelefone, mensagem)
}
```
**Ponto Mágico de Go:** Note que em nenhum momento dissemos `type Email implements Notificador`. A implementação é **implícita**. Se um tipo tem todos os métodos que a interface exige, ele automaticamente satisfaz essa interface. Simples assim.

**Passo 4: Usar a Interface (Contratar Alguém para a Função)**

Agora o grande final. Podemos criar uma função que não se importa se receberá um `Email` ou um `SMS`. Ela só exige receber algo que cumpra o contrato de `Notificador`.

```go
// Esta função aceita QUALQUER tipo que seja um Notificador
func EnviarNotificacao(n Notificador, msg string) {
    fmt.Println("Iniciando envio de notificação...")
    n.Enviar(msg) // Funciona, pois sabemos que 'n' TEM um método Enviar.
}
```

### Por Que Isso Importa?

Interfaces são a chave para escrever código **flexível**, **desacoplado** e **testável** em Go.

- **Desacoplamento:** A função `EnviarNotificacao` não sabe nada sobre `Email` ou `SMS`. Ela só conhece o contrato `Notificador`. Isso significa que você pode mudar completamente como `Email` funciona internamente, e a função `EnviarNotificacao` não precisa ser alterada.
- **Flexibilidade:** Amanhã, você pode querer adicionar notificações via `Slack` ou `WhatsApp`. Você só precisa criar uma nova `struct` (`SlackNotificacao`), implementar o método `Enviar()`, e ela funcionará instantaneamente com sua função `EnviarNotificacao` existente, sem precisar mudar uma linha de código nela.
- **Testes:** Para testar sua função, você não precisa enviar um email de verdade. Você pode criar um `NotificadorMock` (um notificador de mentira) que apenas imprime a mensagem na tela, e usá-lo para verificar se sua lógica está funcionando.

### Exemplo Prático (Completo)

Vamos juntar tudo em um programa que você pode rodar.

```go
package main

import "fmt"

// 1. O Contrato
type Notificador interface {
    Enviar(mensagem string)
}

// 2. Os Tipos Concretos
type Email struct {
    Endereco string
}

type SMS struct {
    NumeroTelefone string
}

// 3. A Implementação (assinatura do contrato)
func (e Email) Enviar(mensagem string) {
    fmt.Printf("--- Email para %s: %s\n", e.Endereco, mensagem)
}

func (s SMS) Enviar(mensagem string) {
    fmt.Printf("--- SMS para %s: %s\n", s.NumeroTelefone, mensagem)
}

// 4. A Função que usa a interface
func MandarAlertaDeSistema(n Notificador, alerta string) {
    fmt.Println("Disparando alerta importante!")
    n.Enviar(alerta)
}

func main() {
    // Criando nossas instâncias concretas
    emailDoAdmin := Email{Endereco: "admin@corp.com"}
    smsDoPlantao := SMS{NumeroTelefone: "+5511999998888"}

    // Usando a mesma função com tipos diferentes!
    MandarAlertaDeSistema(emailDoAdmin, "Servidor principal está offline!")
    MandarAlertaDeSistema(smsDoPlantao, "Servidor principal está offline!")
}
```

### Armadilhas Comuns

- **Receptor de Ponteiro vs. Receptor de Valor:** Essa é a principal fonte de bugs com interfaces.
  - Se você implementa o método com um **receptor de ponteiro** (`func (s *SMS) ...`), então apenas um **ponteiro para a struct** (`&SMS{}`) satisfará a interface, não a struct diretamente (`SMS{}`).
  - **Exemplo que quebra:**
    ```go
    // O método espera um ponteiro
    func (s *SMS) Enviar(mensagem string) { ... }
    
    // O código principal
    sms := SMS{...}
    MandarAlertaDeSistema(sms) // ERRO! 'sms' não é um Notificador.
    MandarAlertaDeSistema(&sms) // CORRETO! '&sms' (o ponteiro) é um Notificador.
    ```
  - Fique muito atento a isso!

- **A Interface Vazia (`interface{}`):**
  - Você verá `interface{}` em Go. Significa "um tipo que não exige nenhum método". Ou seja, **qualquer tipo** satisfaz a interface vazia.
  - É poderosa, mas perigosa. Você perde a segurança de tipos do compilador. Use com moderação e prefira interfaces específicas sempre que possível.

### Boas Práticas

- **Interfaces Pequenas:** O mantra em Go é "quanto menor a interface, melhor". Interfaces com um único método são muito comuns e extremamente reutilizáveis (como `io.Reader` e `io.Writer` da biblioteca padrão).
- **"Aceite Interfaces, Retorne Structs":** Esta é uma famosa convenção em Go.
  - Suas funções devem aceitar interfaces como parâmetros para serem mais flexíveis.
  - Suas funções devem retornar tipos concretos (`structs`) para que quem as chama tenha o máximo de informação e controle sobre o tipo retornado.
- **Defina a Interface Onde Ela é Usada:** Diferente de outras linguagens, a convenção em Go é que o pacote que **consome** a interface é quem a define, não o pacote que a implementa. Isso reforça o desacoplamento.

### Resumo Rápido
- **Interface**: É um contrato que define um conjunto de comportamentos (métodos).
- **Implementação Implícita**: Um tipo satisfaz uma interface automaticamente se ele tiver todos os métodos que ela exige. Não existe a palavra-chave `implements`.
- **Poder Principal**: Permite escrever funções genéricas que operam sobre comportamentos, não sobre tipos concretos, levando a um código flexível e desacoplado.
- **Armadilha Principal**: Cuidado com a diferença entre um valor (`SMS`) e um ponteiro (`&SMS`) na hora de satisfazer uma interface.
- **Boa Prática**: Mantenha suas interfaces pequenas e focadas.