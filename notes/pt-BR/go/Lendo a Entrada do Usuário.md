# Lendo a Entrada do Usuário em Go

Ler a entrada do teclado é como **conversar com alguém pelo telefone**.

1.  **A Conexão (`os.Stdin`)**: É a linha telefônica em si. É o canal bruto por onde os dados (a voz) chegam.

2.  **O Problema do "Ruído" (`bufio`)**: Falar diretamente pela linha pode ser ineficiente e cheio de ruído. Você pode pegar palavras cortadas ou ter que pedir para a pessoa repetir várias vezes. O pacote `bufio` (buffered I/O) age como um **secretário inteligente** na linha. Ele ouve um trecho da conversa, anota tudo em um bloco de notas (o *buffer*) e, quando você pede, ele te entrega a frase completa e limpa. Isso é muito mais eficiente do que processar cada som individualmente.

3.  **As Ferramentas de Leitura (`Scanner` e `Reader`)**:
    *   **`bufio.Scanner`**: É como pedir ao secretário: "Me dê a próxima frase que a pessoa disser". É simples, direto e já vem formatado. Ideal para conversas normais (ler linha por linha).
    *   **`bufio.Reader`**: É como pedir: "Leia tudo até a pessoa dizer a palavra 'câmbio'". É mais flexível e te dá mais controle sobre *onde* a leitura deve parar.

### O Conceito em Detalhes

Para ler dados do terminal, Go nos oferece o pacote `bufio`, que fornece mecanismos de I/O (Entrada/Saída) com buffer. A fonte de dados do teclado é representada por `os.Stdin`.

O `bufio` é essencial porque ler dados diretamente do sistema operacional caractere por caractere é ineficiente. O `bufio` otimiza isso lendo um grande bloco de dados de uma vez para um buffer na memória e, em seguida, entregando os dados a partir desse buffer rápido para o seu programa.

As duas principais ferramentas para isso são `bufio.Scanner` e `bufio.Reader`.

### `bufio.Scanner`: A Abordagem Recomendada

O `Scanner` é a forma mais simples e idiomática de ler entradas sequenciais, como linhas de um terminal ou de um arquivo.

**Como funciona:**
1.  Cria-se um `scanner` associado a `os.Stdin`.
2.  Usa-se `scanner.Scan()` dentro de uma estrutura de controle (como `if` ou `for`) para avançar para o próximo "token" (por padrão, uma linha).
3.  `scanner.Text()` retorna o token lido como uma string limpa (sem o `\n`).
4.  `scanner.Err()` é verificado no final para capturar qualquer erro que tenha ocorrido durante o processo.

#### Exemplo Prático com `Scanner`

```go
package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	fmt.Println("Qual é o seu nome?")
	fmt.Print("-> ")

	// 1. Criar um novo scanner que lê da entrada padrão.
	scanner := bufio.NewScanner(os.Stdin)

	// 2. scanner.Scan() lê a próxima linha e retorna 'true' se for bem-sucedido.
	if scanner.Scan() {
		// 3. scanner.Text() obtém a linha lida como uma string limpa.
		nome := scanner.Text()
		fmt.Printf("Olá, %s! Bem-vindo ao mundo de Go.\n", nome)
	}

	// 4. É uma boa prática verificar se ocorreram erros durante o escaneamento.
	if err := scanner.Err(); err != nil {
		fmt.Fprintln(os.Stderr, "Erro ao ler a entrada:", err)
	}
}
```

### `bufio.Reader`: A Abordagem Flexível

O `Reader` oferece mais controle, permitindo que você leia até um delimitador específico de sua escolha.

**Como funciona:**
1.  Cria-se um `reader` associado a `os.Stdin`.
2.  Usa-se `reader.ReadString(delimitador)`, onde `delimitador` é o `byte` que sinaliza o fim da leitura (geralmente `'\n'` para uma linha).
3.  O método retorna a string lida **incluindo** o delimitador.
4.  Você precisa tratar o erro retornado e, geralmente, remover o delimitador da string resultante.

#### Exemplo Prático com `Reader`

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func main() {
	fmt.Println("Qual é a sua cidade?")
	fmt.Print("-> ")

	// 1. Criar um novo reader.
	reader := bufio.NewReader(os.Stdin)

	// 2. Ler até o caractere de nova linha.
	cidade, err := reader.ReadString('\n')
	if err != nil {
		fmt.Fprintln(os.Stderr, "Erro ao ler a entrada:", err)
		return
	}

	// 3. A string 'cidade' contém o '\n' no final. Precisamos removê-lo.
	// strings.TrimSpace é uma forma robusta de fazer isso.
	cidadeLimpa := strings.TrimSpace(cidade)

	fmt.Printf("Belo lugar para se estar, %s!\n", cidadeLimpa)
}
```

### Armadilhas Comuns

1.  **Esquecer de Tratar o Erro:** Operações de I/O podem falhar. Sempre verifique o `err` retornado pelo `Reader` ou o `scanner.Err()` no final.

2.  **Não Limpar a String do `Reader`:** Um erro clássico é usar a string de `ReadString('\n')` diretamente. Isso deixará um caractere de nova linha invisível no final, o que pode quebrar comparações de strings e formatação.

### `Scanner` vs. `Reader`: Qual Usar?

| Característica      | `bufio.Scanner`                                       | `bufio.Reader` com `ReadString`                               |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| **Caso de Uso Ideal** | Ler linha por linha ou palavra por palavra.           | Ler até um delimitador customizado, lidar com dados binários. |
| **Simplicidade**      | **Muito Alta.** Abstrai os detalhes.                  | Média. Requer mais trabalho manual.                           |
| **Resultado**       | Retorna texto limpo via `.Text()`.                    | Retorna texto com o delimitador, que precisa ser removido.    |
| **Recomendação**    | **Use `Scanner` para ler input do usuário no terminal.** | Use `Reader` para tarefas de I/O mais complexas e específicas.  |

### Resumo Rápido

*   **Fonte de Dados**: `os.Stdin` representa o teclado.
*   **Otimização**: `bufio` minimiza chamadas de sistema caras usando um buffer.
*   **`bufio.Scanner`**: A ferramenta **preferida** para ler linhas de texto. É mais simples e segura.
*   **`bufio.Reader`**: Uma ferramenta mais flexível, útil para casos de uso avançados onde você precisa de mais controle.
*   **Regra de Ouro**: Sempre verifique por erros e limpe sua entrada!