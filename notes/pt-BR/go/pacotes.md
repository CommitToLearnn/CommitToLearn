# Pacotes em Go: As Caixas de Ferramentas do seu Código

Pense em **pacotes** como **caixas de ferramentas especializadas**.

*   Você tem uma caixa de ferramentas para **eletricidade** (`package eletrica`) com alicates e testadores de voltagem.
*   Você tem outra para **hidráulica** (`package hidraulica`) com chaves de grifo e veda-rosca.
*   Seu projeto principal é **montar um banheiro** (`package main`).

Quando você precisa instalar uma torneira, você não reinventa a chave de grifo. Você simplesmente pega a caixa `hidraulica`, abre e usa a ferramenta que precisa. Se depois precisa instalar uma tomada, você pega a caixa `eletrica`.

Pacotes em Go funcionam da mesma forma: eles agrupam código relacionado (funções, tipos, variáveis) em unidades lógicas e reutilizáveis.

### O Conceito em Detalhes

Em Go, todo arquivo de código-fonte pertence a um pacote. Um pacote é simplesmente um conjunto de arquivos no mesmo diretório que são declarados com a mesma cláusula `package`.

#### `package main`: O Pacote Especial

Todo programa executável em Go **deve** ter um pacote chamado `main`. Este pacote é especial porque diz ao compilador: "Este é o ponto de partida, compile isso em um programa que eu possa rodar". Dentro do `package main`, a função `main()` é o local exato onde a execução começa.

#### Pacotes de Biblioteca (Qualquer outro nome)

Qualquer pacote que **não** se chama `main` é uma **biblioteca**. Seu propósito é fornecer funcionalidades para serem usadas por outros pacotes (sejam outras bibliotecas ou um pacote `main`).

*   `package strings`: Fornece funções para manipular strings.
*   `package fmt`: Fornece funções para formatação de entrada e saída.
*   `package calculadora`: Um pacote que **você** cria para agrupar funções de cálculo.

#### Visibilidade: Letras Maiúsculas e Minúsculas

A regra de visibilidade em Go é elegantemente simples e está ligada aos nomes:

*   **Começa com Letra Maiúscula (Exportado):** Se um identificador (nome de função, tipo, variável) começa com uma letra maiúscula, ele é **público** ou **exportado**. Isso significa que outros pacotes podem vê-lo e usá-lo. `fmt.Println` é um exemplo.

*   **Começa com Letra Minúscula (Não Exportado):** Se começa com letra minúscula, ele é **privado** ou **não exportado**. Apenas o código dentro do mesmo pacote pode acessá-lo. É uma ferramenta interna da sua "caixa de ferramentas".

### Por Que Isso Importa?

Pacotes são a espinha dorsal da organização de código em Go. Eles permitem:
*   **Reutilização:** Escreva uma função útil uma vez e use-a em vários projetos.
*   **Organização:** Evita que seu `main` se torne um arquivo gigante e ilegível. Você separa as responsabilidades em pacotes lógicos.
*   **Namespace:** Evita conflitos de nomes. Você pode ter uma função `Calcular()` no pacote `juros` e outra `Calcular()` no pacote `distancia` sem problemas. Você as chama como `juros.Calcular()` e `distancia.Calcular()`.
*   **Manutenção:** É muito mais fácil corrigir ou melhorar uma funcionalidade quando ela está bem encapsulada em seu próprio pacote.

### Exemplos Práticos

Vamos criar um projeto simples com nosso próprio pacote.

**Estrutura de Arquivos:**
```
meu_projeto/
├── go.mod
├── main.go
└── util/
    └── strings.go
```

**Passo 1: Criar o Módulo Go**
No terminal, dentro da pasta `meu_projeto`:
```bash
go mod init meu_projeto
```
Isso cria o arquivo `go.mod`, que gerencia as dependências do seu projeto. O nome `meu_projeto` se torna o "caminho base" para seus pacotes.

**Passo 2: Criar o Pacote de Biblioteca `util`**

```go
// arquivo: util/strings.go

// Declaramos que este arquivo pertence ao pacote 'util'.
package util

// 'Reverter' começa com 'R' maiúsculo, então é EXPORTADA.
// Outros pacotes poderão chamar util.Reverter().
func Reverter(s string) string {
    // converte a string para um slice de runas para lidar com caracteres multibyte (como acentos)
    runas := []rune(s)
    // i e j são os ponteiros do início e do fim
    for i, j := 0, len(runas)-1; i < j; i, j = i+1, j-1 {
        // troca os elementos de lugar
        runas[i], runas[j] = runas[j], runas[i]
    }
    return string(runas)
}

// 'mensagemSecreta' começa com 'm' minúsculo, então é NÃO EXPORTADA.
// Apenas outras funções dentro do pacote 'util' podem chamá-la.
func mensagemSecreta() string {
    return "isso é interno"
}
```

**Passo 3: Usar o Pacote `util` no `main`**

```go
// arquivo: main.go

// Este é o nosso programa executável.
package main

import (
    "fmt"
    // Importamos nosso pacote usando o caminho do módulo + nome do pacote.
    "meu_projeto/util"
)

func main() {
    frase := "Olá, mundo"
    fraseRevertida := util.Reverter(frase)

    fmt.Printf("Original: %s\n", frase)
    fmt.Printf("Revertida: %s\n", fraseRevertida)

    // A linha abaixo causaria um ERRO de compilação, pois 'mensagemSecreta' não é exportada.
    // fmt.Println(util.mensagemSecreta())
}
```

**Para rodar:**
No terminal, na raiz do projeto (`meu_projeto/`), execute:
```bash
go run main.go
```
**Output:**
```
Original: Olá, mundo
Revertida: odnum ,álO
```

### Armadilhas Comuns

1.  **Esquecer a Letra Maiúscula:** Tentar chamar uma função de outro pacote e receber um erro de "undefined" (não definido). Quase sempre o problema é que a função no pacote de origem foi declarada com letra minúscula.

2.  **Caminho de Importação Errado:** O caminho no `import` deve corresponder ao nome do módulo no `go.mod` seguido pelo caminho do subdiretório.

3.  **Dependências Circulares:** O Pacote A importa o Pacote B, e o Pacote B importa o Pacote A. Go não permite isso e vai gerar um erro de compilação. Isso geralmente indica um mau design da arquitetura do seu código.

### Boas Práticas

1.  **Nomes de Pacotes Curtos e Descritivos:** Use nomes como `http`, `strings`, `util`, `models`. Evite `_` (underline) ou letras maiúsculas nos nomes dos pacotes.

2.  **Agrupe por Responsabilidade:** Coloque funcionalidades relacionadas no mesmo pacote. Funções que lidam com o banco de dados podem ir para um pacote `db` ou `storage`.

3.  **O Pacote `main` deve ser Mínimo:** A função `main` deve ser um ponto de entrada que orquestra chamadas para outros pacotes. Evite colocar muita lógica de negócio diretamente nela.

### Resumo Rápido

*   **Pacotes** organizam o código Go em unidades reutilizáveis.
*   `package main` cria um programa **executável**.
*   Qualquer outro nome de pacote cria uma **biblioteca**.
*   **Letra Maiúscula = Público/Exportado.** Outros pacotes podem usar.
*   **Letra Minúscula = Privado/Não Exportado.** Uso interno ao pacote.
*   Use `import` para trazer a funcionalidade de outros pacotes para o seu escopo.
*   O caminho de importação é baseado no nome do seu módulo (`go.mod`).
