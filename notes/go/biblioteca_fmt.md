### Biblioteca fmt

O pacote `fmt` (abreviação de "format") é um dos pacotes mais fundamentais e amplamente utilizados na biblioteca padrão do Go. Ele implementa funcionalidades para **entrada e saída (I/O) formatada**, o que significa que ele te ajuda a:

**Exibir dados** no console (saída padrão) ou em outros fluxos de saída (como arquivos) de uma maneira legível e controlada.

**Ler dados** do console (entrada padrão) ou de outros fluxos de entrada, interpretando-os de acordo com formatos esperados.

**Formatar dados em strings**, sem necessariamente imprimi-los, para que você possa usar essas strings formatadas em outras partes do seu programa.

Para usá-lo, você precisa importá-lo no seu arquivo Go:
```go
import "fmt"
```

Vamos explorar suas principais funcionalidades:

### Imprimindo na Saída Padrão (Console)

Estas são provavelmente as funções que você mais usará inicialmente.

* **`fmt.Print(a ...interface{}) (n int, err error)`**:
    * Imprime seus argumentos formatando-os de uma maneira padrão.
    * Os argumentos são separados por espaços se nenhum deles for uma string.
    * **Não adiciona uma nova linha automaticamente** ao final.
    * Retorna o número de bytes escritos e um erro, se houver.

    ```go
    nome := "Mundo"
    fmt.Print("Olá, ", nome, "!") // Saída: Olá, Mundo!
    fmt.Print("Outra linha.")      // Saída na mesma linha: Olá, Mundo!Outra linha.
    ```

* **`fmt.Println(a ...interface{}) (n int, err error)`**:
    * Similar ao `Print`, mas **adiciona espaços entre os argumentos** (se não forem strings) e **sempre adiciona uma nova linha** ao final da saída.
    * É muito conveniente para imprimir mensagens rápidas ou valores de variáveis, cada um em sua própria linha.

    ```go
    idade := 30
    fmt.Println("Olá", "Go")    // Saída: Olá Go
    fmt.Println("Idade:", idade) // Saída: Idade: 30
    fmt.Println("Fim.")         // Saída: Fim. (e o cursor vai para a próxima linha)
    ```

* **`fmt.Printf(format string, a ...interface{}) (n int, err error)`**:
    * Permite imprimir dados formatados usando uma **string de formato** e "verbos de formatação".
    * A string de formato contém texto literal e verbos (que começam com `%`) que especificam como os argumentos subsequentes devem ser formatados.
    * **Não adiciona uma nova linha automaticamente** (você precisa incluir `\n` na string de formato se quiser uma).

    ```go
    nome := "Alice"
    pontos := 95.5
    fmt.Printf("Nome: %s, Pontuação: %.1f\n", nome, pontos) // Saída: Nome: Alice, Pontuação: 95.5
    fmt.Printf("Em hexadecimal, 255 é %X\n", 255)          // Saída: Em hexadecimal, 255 é FF
    ```

    **Verbos de Formatação Comuns para `Printf`**:
    * `%v`: O valor em um formato padrão (geralmente bom para começar). Para structs, imprime `{campo1:valor1 ...}`.
    * `%+v`: Ao imprimir structs, adiciona os nomes dos campos.
    * `%#v`: Uma representação Go-syntax do valor.
    * `%T`: O tipo do valor.
    * `%t`: A palavra `true` ou `false` (para booleanos).
    * `%d`: Inteiro decimal.
    * `%b`: Inteiro binário.
    * `%o`: Inteiro octal.
    * `%x`, `%X`: Inteiro hexadecimal (minúsculas ou maiúsculas).
    * `%f`, `%.2f`: Ponto flutuante (com precisão, ex: `%.2f` para duas casas decimais).
    * `%e`, `%E`: Notação científica.
    * `%s`: String.
    * `%p`: Ponteiro (endereço de memória em hexadecimal).
    * `%%`: Um sinal literal de porcentagem (`%`).

### Lendo da Entrada Padrão (Teclado)

Estas funções são usadas para obter entrada do usuário.

* **`fmt.Scan(a ...interface{}) (n int, err error)`**:
    * Lê texto da entrada padrão, esperando valores separados por espaço.
    * Armazena os valores sucessivos nos argumentos fornecidos, que **devem ser ponteiros**.
    * Trata a nova linha (`\n`) como espaço. Para de escanear quando encontra um erro de tipo ou o final da entrada.
    * Retorna o número de itens lidos com sucesso e um erro.

    ```go
    var nome string
    var idade int
    fmt.Print("Digite seu nome e idade: ")
    n, err := fmt.Scan(&nome, &idade) // &nome e &idade são ponteiros
    if err != nil {
        fmt.Println("Erro ao ler:", err)
    } else {
        fmt.Printf("Itens lidos: %d. Nome: %s, Idade: %d\n", n, nome, idade)
    }
    ```

* **`fmt.Scanln(a ...interface{}) (n int, err error)`**:
    * Similar ao `Scan`, mas para de escanear na nova linha (`\n`) e exige que todos os argumentos sejam preenchidos antes da nova linha.

    ```go
    var cidade string
    fmt.Print("Digite sua cidade: ")
    fmt.Scanln(&cidade) // Lê até o Enter
    fmt.Println("Cidade:", cidade)
    ```

* **`fmt.Scanf(format string, a ...interface{}) (n int, err error)`**:
    * Lê texto da entrada padrão de acordo com uma string de formato especificada (similar ao `scanf` da linguagem C).
    * Os argumentos também devem ser ponteiros.

    ```go
    var dia int
    var mes string
    fmt.Print("Digite o dia e o mês (ex: 25 Dezembro): ")
    _, err := fmt.Scanf("%d %s", &dia, &mes)
    if err != nil {
        fmt.Println("Erro no formato:", err)
    } else {
        fmt.Printf("Dia: %d, Mês: %s\n", dia, mes)
    }
    ```
    *Nota:* Para leitura de linhas inteiras ou entradas mais complexas, o pacote `bufio` (ex: `bufio.NewScanner(os.Stdin)`) costuma ser mais robusto e flexível do que as funções `Scan` do `fmt`.

### Formatando em Strings (sem imprimir)

Às vezes, você quer criar uma string formatada para usá-la depois, em vez de imprimi-la imediatamente.

* **`fmt.Sprint(a ...interface{}) string`**:
    * Similar ao `Print`, mas retorna a string resultante em vez de imprimi-la.

    ```go
    s1 := fmt.Sprint("Valor:", 42, true) // s1 será "Valor:42true"
    fmt.Println(s1)
    ```

* **`fmt.Sprintln(a ...interface{}) string`**:
    * Similar ao `Println`, mas retorna a string resultante (com espaços e nova linha no final).

    ```go
    s2 := fmt.Sprintln("Item1", "Item2") // s2 será "Item1 Item2\n"
    fmt.Print(s2) // Print para não adicionar outra nova linha
    ```

* **`fmt.Sprintf(format string, a ...interface{}) string`**:
    * Similar ao `Printf`, mas retorna a string formatada resultante.

    ```go
    erroCodigo := 500
    mensagemErro := fmt.Sprintf("Ocorreu um erro - Código: %d", erroCodigo)
    // mensagemErro será "Ocorreu um erro - Código: 500"
    fmt.Println(mensagemErro)
    ```

### Escrevendo em `io.Writer`s (ex: arquivos)

O pacote `fmt` também pode escrever dados formatados em qualquer destino que implemente a interface `io.Writer` (como arquivos, buffers de rede, etc.).

* **`fmt.Fprint(w io.Writer, a ...interface{}) (n int, err error)`**
* **`fmt.Fprintln(w io.Writer, a ...interface{}) (n int, err error)`**
* **`fmt.Fprintf(w io.Writer, format string, a ...interface{}) (n int, err error)`**

Elas funcionam de forma análoga às suas contrapartes `Print`, `Println`, e `Printf`, mas recebem um `io.Writer` como primeiro argumento, indicando onde a saída deve ser escrita. `os.Stdout` (saída padrão) é um `io.Writer`.

```go
import (
	"fmt"
	"os"
)

func main() {
	// Escrevendo no console (os.Stdout é um io.Writer)
	fmt.Fprintln(os.Stdout, "Olá do Fprintln para o console!")

	// Escrevendo em um arquivo
	arquivo, err := os.Create("saida.txt")
	if err != nil {
		fmt.Println("Erro ao criar arquivo:", err)
		return
	}
	defer arquivo.Close() // Garante que o arquivo será fechado

	fmt.Fprintf(arquivo, "Nome: %s, Idade: %d\n", "Carlos", 40)
	fmt.Fprintln(arquivo, "Este é um log para o arquivo.")
}
```

### Lendo de `io.Reader`s

De forma similar, existem funções para ler de qualquer fonte que implemente `io.Reader`.

* **`fmt.Fscan(r io.Reader, a ...interface{}) (n int, err error)`**
* **`fmt.Fscanln(r io.Reader, a ...interface{}) (n int, err error)`**
* **`fmt.Fscanf(r io.Reader, format string, a ...interface{}) (n int, err error)`**

```go
import (
	"fmt"
	"strings"
)

func main() {
	leitor := strings.NewReader("usuário123 99") // strings.Reader é um io.Reader
	var username string
	var score int
	_, err := fmt.Fscan(leitor, &username, &score)
	if err != nil {
		fmt.Println("Erro ao ler do leitor:", err)
	} else {
		fmt.Printf("Lido do leitor: Usuário: %s, Score: %d\n", username, score)
	}
}
```

### Formatando Erros

* **`fmt.Errorf(format string, a ...interface{}) error`**:
    * Formata uma string de erro usando a mesma lógica de `Sprintf` e retorna um valor que satisfaz a interface `error`. É a maneira idiomática de criar novos erros com mensagens dinâmicas.

    ```go
    func dividir(a, b float64) (float64, error) {
        if b == 0 {
            return 0, fmt.Errorf("não é possível dividir %f por zero", a)
        }
        return a / b, nil
    }

    res, err := dividir(10, 0)
    if err != nil {
        fmt.Println(err) // Saída: não é possível dividir 10.000000 por zero
    } else {
        fmt.Println("Resultado:", res)
    }
    ```

**Em resumo:**

O pacote `fmt` é seu principal aliado para interagir com o usuário (entrada e saída no console), formatar dados para exibição ou armazenamento em strings, e trabalhar com fluxos de dados de forma formatada. Dominar `Printf` e seus verbos de formatação é especialmente útil para ter controle fino sobre como seus dados são apresentados. Lembre-se sempre de verificar os erros retornados pelas funções de `Scan` e ao trabalhar com arquivos.