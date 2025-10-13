# Reflection em Go: O Código que se Autoexamina

Pense em **Reflection** como ter um **espelho mágico** para suas variáveis em Go. Em vez de apenas usar a variável, você a coloca na frente do espelho e pode perguntar coisas sobre ela:

*   "Espelho, espelho meu, qual é o **tipo** desta variável?" (E o espelho responde: `int`, `string`, `main.MinhaStruct`).
*   "E qual é o **valor** que ela guarda?" (E o espelho responde: `42`, `"olá"`, `{Nome: "Ana", Idade: 30}`).
*   "Posso **mudar** o valor que você está refletindo para `99`?" (E o espelho, se tiver permissão, altera o valor da variável original).

Reflection é a capacidade de um programa inspecionar e manipular seus próprios objetos (variáveis, structs, etc.) em tempo de execução.

### O Conceito em Detalhes

O pacote `reflect` é a porta de entrada para a reflection em Go. Ele introduz dois conceitos centrais: `Type` e `Value`.

1.  **`reflect.TypeOf(interface{})`**: Retorna o **tipo** de uma variável.
    *   É como perguntar "O que você é?". A resposta é um `reflect.Type`, que contém metadados como o nome do tipo, os campos de uma struct, os parâmetros de uma função, etc.

2.  **`reflect.ValueOf(interface{})`**: Retorna o **valor** de uma variável.
    *   É como perguntar "O que você contém?". A resposta é um `reflect.Value`, que permite ler o valor atual e, em certas condições, modificá-lo.

Uma variável em Go é como uma caixa com uma etiqueta. O `TypeOf` lê a etiqueta (o tipo estático), e o `ValueOf` olha dentro da caixa (o valor dinâmico).

```go
var x float64 = 3.4

// Olhando a etiqueta
t := reflect.TypeOf(x) // t é um reflect.Type que representa 'float64'

// Olhando dentro da caixa
v := reflect.ValueOf(x) // v é um reflect.Value que contém '3.4'
```

### Por Que Isso Importa? (E Quando Usar com Cuidado)

Reflection é uma ferramenta extremamente poderosa, mas que vem com um custo.

**Onde é útil:**
*   **Codificação/Decodificação de Dados:** O pacote `json` usa reflection extensivamente. Ele inspeciona os campos de uma struct (nomes, tipos, tags) para saber como converter de/para JSON sem que você precise escrever essa lógica manualmente.
*   **Frameworks e Bibliotecas Genéricas:** Ferramentas que precisam operar sobre tipos de dados que não conhecem em tempo de compilação, como ORMs (Object-Relational Mappers) para bancos de dados ou frameworks de injeção de dependência.
*   **Ferramentas de Teste:** Para inspecionar e comparar estruturas de dados complexas de forma genérica.

**Por que usar com cuidado?**
*   **Performance:** Operações de reflection são significativamente mais lentas do que o acesso direto. O compilador não pode otimizar o código que usa reflection.
*   **Segurança de Tipos:** Você perde a segurança de tipos que o compilador de Go oferece. Um erro de tipo que seria pego em tempo de compilação só aparecerá como um `panic` em tempo de execução.
*   **Legibilidade:** Código com reflection é geralmente mais complexo e mais difícil de entender e manter.

**Regra de ouro:** Evite reflection no seu código de aplicação do dia a dia. Prefira interfaces para criar abstrações. Use reflection apenas quando estiver construindo bibliotecas ou ferramentas que precisam de um alto grau de generalização.

### Exemplos Práticos

#### Exemplo 1: Inspecionando Tipo e Valor

```go
package main

import (
    "fmt"
    "reflect"
)

type Pedido struct {
    ID    int
    Total float64
}

func main() {
    p := Pedido{ID: 123, Total: 99.50}

    // Usamos reflect.ValueOf para obter o objeto Value
    v := reflect.ValueOf(p)
    // E a partir do Value, podemos obter o Type
    t := v.Type()

    fmt.Printf("A variável 'p' é do tipo '%s' (nome do tipo: %s)\n", t.Kind(), t.Name())

    // Kind vs. Name:
    // Name() é o nome que você deu ao tipo ('Pedido').
    // Kind() é a categoria fundamental do tipo ('struct').

    fmt.Println("--- Campos da Struct ---")
    // NumField() retorna o número de campos na struct.
    for i := 0; i < t.NumField(); i++ {
        // Field(i) nos dá informações sobre o campo no índice i.
        campo := t.Field(i)
        // v.Field(i) nos dá o valor do campo no índice i.
        valor := v.Field(i)

        fmt.Printf("Campo: %s, Tipo: %s, Valor: %v\n",
            campo.Name, campo.Type, valor.Interface())
    }
}
```
**Output:**
```
A variável 'p' é do tipo 'struct' (nome do tipo: Pedido)
--- Campos da Struct ---
Campo: ID, Tipo: int, Valor: 123
Campo: Total, Tipo: float64, Valor: 99.5
```

#### Exemplo 2: Modificando um Valor com Reflection

Para modificar um valor, o `reflect.Value` precisa ser **endereçável** (`CanSet() == true`). Isso significa que você deve passar um **ponteiro** para a função `reflect.ValueOf`.

```go
package main

import (
    "fmt"
    "reflect"
)

func main() {
    var x float64 = 3.4
    fmt.Println("Valor inicial de x:", x)

    // 1. Passamos um PONTEIRO para ValueOf.
    v := reflect.ValueOf(&x)
    fmt.Println("v é endereçável?", v.CanSet()) // false, v é um ponteiro

    // 2. Para obter o valor para o qual o ponteiro aponta, usamos Elem().
    elem := v.Elem()
    fmt.Println("elem é endereçável?", elem.CanSet()) // true!

    // 3. Agora podemos modificar o valor.
    if elem.CanSet() {
        // Usamos SetFloat porque sabemos que o tipo subjacente é float64.
        elem.SetFloat(7.1)
    }

    fmt.Println("Novo valor de x:", x) // O valor original foi modificado!
}
```

### Armadilhas Comuns

1.  **Tentar Modificar um Valor Não Endereçável:** A causa mais comum de `panic`. Acontece quando você passa uma variável diretamente para `reflect.ValueOf` e depois tenta usar `.Set...()` nela. Lembre-se: para modificar, passe um ponteiro e use `.Elem()`.

2.  **Tipo Incorreto na Modificação:** Chamar `v.SetFloat(7.1)` em um `reflect.Value` que representa um `int` causará um `panic`. Você deve sempre verificar o tipo (`.Kind()`) antes de tentar modificar.

3.  **`Interface()` em um Valor Zero:** Chamar `.Interface()` em um `reflect.Value` inválido (zero) também causa `panic`.

### Boas Práticas

1.  **Verifique Antes de Agir:** Sempre use os métodos de verificação como `CanSet()`, `IsValid()`, e verifique o `Kind()` antes de tentar operações de escrita ou leitura arriscadas.

2.  **Encapsule a Lógica de Reflection:** Se precisar usar reflection, tente isolá-la em um pacote ou função específica. Isso mantém o resto do seu código limpo, seguro e performático.

3.  **Considere Alternativas Primeiro:** Antes de recorrer à reflection, pergunte-se: "Posso resolver isso com uma interface? Ou com uma função de ordem superior? Ou com geração de código?". Na maioria das vezes, a resposta é sim.

### Resumo Rápido

*   **Reflection** permite que o código inspecione e manipule a si mesmo em **tempo de execução**.
*   O pacote `reflect` é a chave, com seus tipos `reflect.Type` (metadados do tipo) e `reflect.Value` (o valor dinâmico).
*   É uma ferramenta **poderosa**, mas **lenta** e que **burla a segurança de tipos** do compilador.
*   Para **modificar** um valor, você precisa passar um **ponteiro** para `reflect.ValueOf()` e usar `.Elem()` para obter um `Value` endereçável.
*   **Evite em código de aplicação normal.** É uma ferramenta para construir ferramentas.
*   O pacote `json` é o exemplo mais famoso do poder da reflection em Go.
