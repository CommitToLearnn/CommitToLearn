# Trabalhando com JSON em Go: O Tradutor Universal

Pense em **JSON (JavaScript Object Notation)** como o **inglês dos sistemas de computador**: um idioma universal que quase todos entendem. Seu aplicativo Go pode falar "português" (usando suas `structs` e tipos nativos), mas quando ele precisa conversar com um serviço web (uma API), um aplicativo de celular ou um sistema em outra linguagem, ele precisa "traduzir" suas informações para esse idioma comum.

*   **`Marshal` (Codificar):** É o ato de **traduzir** seus dados Go (uma `struct`) para o idioma universal (JSON). Você está "empacotando" suas informações para viagem.
*   **`Unmarshal` (Decodificar):** É o ato de **receber** uma mensagem em JSON e **traduzi-la** de volta para uma estrutura que seu aplicativo Go entende (uma `struct`). Você está "desempacotando" as informações que chegaram.

O pacote `encoding/json` da biblioteca padrão de Go é o seu tradutor profissional para fazer esse trabalho.

### O Conceito em Detalhes

A forma mais comum de trabalhar com JSON em Go é através de **structs**. Uma `struct` define a estrutura dos seus dados em Go, e o pacote `json` a utiliza como um molde para codificar e decodificar.

#### `Marshal`: De Struct para JSON

`json.Marshal` pega um objeto Go (geralmente um ponteiro para uma struct) e retorna sua representação em JSON como um slice de bytes (`[]byte`).

```go
jsonData, err := json.Marshal(meuObjeto)
```

#### `Unmarshal`: De JSON para Struct

`json.Unmarshal` pega um slice de bytes contendo dados JSON e um **ponteiro** para um objeto Go, e preenche o objeto com os dados do JSON.

```go
err := json.Unmarshal(jsonData, &meuObjeto)
```
É crucial passar um ponteiro para que a função possa **modificar** o objeto original.

#### `Struct Tags`: Controlando a Tradução

As `tags` de struct são anotações especiais que você coloca ao lado dos campos de uma struct para dar instruções ao "tradutor". A tag mais comum é `json:"nome_do_campo"`.

```go
type Usuario struct {
    // No Go, o campo é 'NomeCompleto', mas no JSON será 'full_name'.
    NomeCompleto string `json:"full_name"`

    // O campo 'Senha' não terá a tag 'json', então não aparecerá no JSON final.
    // (Isso é porque ele começa com letra maiúscula, mas a boa prática é ser explícito)
    Senha string `json:"-"` // A tag "-" ignora o campo completamente.

    // Se a idade for 0, o campo não será incluído no JSON.
    Idade int `json:"age,omitempty"`
}
```

### Por Que Isso Importa?

JSON é a espinha dorsal da web moderna. Você vai usá-lo para:
*   **Consumir APIs:** Buscar dados de serviços de terceiros.
*   **Criar APIs:** Oferecer dados do seu sistema para outros consumirem.
*   **Arquivos de Configuração:** Salvar e carregar configurações de aplicativos.
*   **Comunicação entre Microsserviços:** Trocar informações entre diferentes partes da sua arquitetura.

Dominar o pacote `json` é fundamental para qualquer desenvolvedor Go que trabalhe com sistemas conectados.

### Exemplos Práticos

#### Exemplo 1: Codificando (Marshal) uma Struct para JSON

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

// Pessoa define a estrutura dos nossos dados em Go.
type Pessoa struct {
    // A tag `json:"nome"` diz ao Marshal para usar "nome" como a chave no JSON.
    Nome  string `json:"nome"`
    Idade int    `json:"idade"`
    // A tag `json:"-"` garante que este campo NUNCA seja incluído no JSON.
    cpf   string `json:"-"` // Campo não exportado (minúsculo) também seria ignorado.
}

func main() {
    // 1. Crie uma instância da sua struct.
    p1 := Pessoa{
        Nome:  "Ana Silva",
        Idade: 32,
        cpf:   "123.456.789-00", // Este valor não vai aparecer.
    }

    // 2. Chame json.Marshal para converter a struct em JSON.
    // A função retorna um slice de bytes e um erro.
    jsonData, err := json.Marshal(p1)
    if err != nil {
        fmt.Println("Erro ao codificar JSON:", err)
        os.Exit(1)
    }

    // 3. O resultado é um []byte, então convertemos para string para imprimir.
    fmt.Println("JSON Resultante:")
    fmt.Println(string(jsonData)) // Saída: {"nome":"Ana Silva","idade":32}
}
```

#### Exemplo 2: Decodificando (Unmarshal) JSON para uma Struct

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Carro struct {
    Modelo string `json:"modelo"`
    Ano    int    `json:"ano_fabricacao"`
    Usado  bool   `json:"usado"`
}

func main() {
    // 1. Imagine que recebemos esta string JSON de uma API.
    jsonString := `{"modelo":"Fusca","ano_fabricacao":1978,"usado":true}`

    // Unmarshal espera um slice de bytes, então convertemos a string.
    jsonData := []byte(jsonString)

    // 2. Crie uma variável do tipo da struct para receber os dados.
    var meuCarro Carro

    // 3. Chame json.Unmarshal, passando os dados e um PONTEIRO para a variável.
    // O ponteiro (&meuCarro) permite que a função modifique 'meuCarro'.
    err := json.Unmarshal(jsonData, &meuCarro)
    if err != nil {
        fmt.Println("Erro ao decodificar JSON:", err)
        os.Exit(1)
    }

    // 4. Agora a struct 'meuCarro' está preenchida!
    fmt.Printf("Struct preenchida: %+v\n", meuCarro)
    // Saída: Struct preenchida: {Modelo:Fusca Ano:1978 Usado:true}
}
```

### Armadilhas Comuns

1.  **Campos Não Exportados (Letra Minúscula):** O pacote `json` só consegue "ver" e trabalhar com campos de uma struct que começam com **letra maiúscula**. Campos privados (minúsculos) são sempre ignorados, não importa a tag.

2.  **Esquecer o Ponteiro no `Unmarshal`:** Passar a variável diretamente para `json.Unmarshal` em vez de um ponteiro a ela. O `Unmarshal` não conseguirá alterar a variável e seus dados não serão preenchidos. O compilador não pega esse erro, o que o torna perigoso!

3.  **Não Tratar o Erro:** As funções `Marshal` e `Unmarshal` retornam um erro. Ignorá-lo pode fazer seu programa continuar com dados inválidos ou vazios, causando bugs difíceis de rastrear.

### Boas Práticas

1.  **Seja Explícito com as `Tags`:** Sempre adicione `json` tags a todos os campos exportados da sua struct. Isso desacopla os nomes dos campos no seu código Go dos nomes no formato JSON, permitindo que você mude um sem quebrar o outro.

2.  **Use `omitempty` para Campos Opcionais:** Adicionar `,omitempty` à tag (`json:"campo,omitempty"`) faz com que o campo seja omitido do JSON final se ele tiver seu "valor zero" (0 para números, `""` para strings, `false` para booleanos, `nil` para ponteiros/slices/maps).

3.  **Use `json:"-"` para Dados Sensíveis:** Exclua explicitamente campos que nunca devem ser expostos, como senhas ou dados internos.

### Resumo Rápido

*   **JSON** é o formato padrão para comunicação entre sistemas.
*   **`json.Marshal`** converte uma `struct` Go para `[]byte` (JSON).
*   **`json.Unmarshal`** converte `[]byte` (JSON) para uma `struct` Go (precisa de um **ponteiro**).
*   **Campos de struct devem ser exportados** (letra maiúscula) para serem visíveis ao pacote `json`.
*   **`Struct Tags` (`json:"..."`)** são essenciais para controlar como seus dados são representados em JSON. Use-as sempre!
*   Sempre, sempre, **verifique o `err`** retornado pelas funções do pacote.
