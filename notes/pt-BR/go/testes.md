# Testes em Go: Garantindo que seu Código Funciona

Escrever código sem testes é como construir uma ponte e só descobrir se ela aguenta peso quando o primeiro caminhão passar por cima. Pode funcionar, ou pode ser um desastre.

**Testes automatizados** são como a equipe de engenharia que, antes de inaugurar a ponte, realiza uma série de **testes de estresse controlados**:
*   Colocam pesos definidos (`entrada`).
*   Medem a deformação da estrutura (`saída`).
*   Comparam o resultado com os cálculos do projeto (`esperado`).
*   Se a deformação for diferente do esperado (`saída != esperado`), eles registram um **erro** e a ponte não é aprovada.

Em Go, o pacote `testing` e a ferramenta `go test` são sua equipe de engenharia integrada, prontos para verificar a solidez do seu código.

### O Conceito em Detalhes

Testar em Go é uma prática de primeira classe, incentivada pela própria linguagem e suas ferramentas. A convenção é simples e poderosa.

#### O Arquivo de Teste

Para cada arquivo `meu_arquivo.go` que você quer testar, você cria um arquivo `meu_arquivo_test.go` no **mesmo pacote**. A ferramenta `go test` automaticamente encontra e executa esses arquivos.

#### A Função de Teste

Uma função de teste segue regras rígidas:
*   Deve começar com o prefixo `Test`.
*   O nome deve ser `Test` seguido por um nome descritivo com a primeira letra maiúscula (ex: `TestSoma`, `TestCalculaImposto`).
*   Deve aceitar um único argumento: `t *testing.T`.

O parâmetro `t` é o seu "engenheiro de testes". É através dele que você sinaliza falhas.

#### A Estrutura "Arrange, Act, Assert" (AAA)

Um bom teste geralmente segue três passos:
1.  **Arrange (Organizar):** Prepare os dados de entrada e o resultado esperado.
2.  **Act (Agir):** Chame a função que você está testando com os dados de entrada.
3.  **Assert (Verificar):** Compare o resultado obtido com o resultado esperado. Se forem diferentes, falhe o teste.

### Por Que Isso Importa?

*   **Confiança:** Testes te dão confiança para fazer alterações e refatorar seu código. Se você quebrar algo, os testes vão te avisar imediatamente.
*   **Documentação Viva:** Testes são uma excelente forma de documentar como uma função deve ser usada e quais são seus casos extremos.
*   **Melhor Design:** Escrever código testável muitas vezes te força a criar funções menores, mais focadas e com responsabilidades claras.
*   **Redução de Bugs:** Encontrar bugs durante o desenvolvimento é muito mais barato e rápido do que quando o código já está em produção.

### Exemplos Práticos

Vamos criar uma função simples e testá-la.

**Arquivo 1: A função a ser testada**

```go
// arquivo: calculadora.go
package calculadora

// Soma retorna a soma de dois inteiros.
func Soma(a, b int) int {
    return a + b
}
```

**Arquivo 2: O teste para a função**

```go
// arquivo: calculadora_test.go
package calculadora

import "testing"

// TestSoma é a nossa função de teste para a função Soma.
func TestSoma(t *testing.T) {
    // --- Arrange (Organizar) ---
    // Definimos as entradas para nossa função.
    a, b := 2, 3
    // Definimos o resultado que esperamos receber.
    esperado := 5

    // --- Act (Agir) ---
    // Chamamos a função que estamos testando.
    resultado := Soma(a, b)

    // --- Assert (Verificar) ---
    // Comparamos o resultado com o esperado.
    if resultado != esperado {
        // Se forem diferentes, usamos o 'engenheiro t' para registrar um erro.
        // t.Errorf formata uma mensagem de erro e marca o teste como falho.
        t.Errorf("Soma(%d, %d) = %d; esperado %d", a, b, resultado, esperado)
    }
}
```

#### Executando os Testes

No terminal, no diretório do pacote `calculadora`, basta executar:

```bash
go test
```

**Saída em caso de sucesso:**
```
ok      meu_projeto/calculadora 0.001s
```

**Saída em caso de falha (se `esperado` fosse `6`, por exemplo):**
```
--- FAIL: TestSoma (0.00s)
    calculadora_test.go:21: Soma(2, 3) = 5; esperado 6
FAIL
exit status 1
FAIL    meu_projeto/calculadora 0.001s
```

#### Testando com Múltiplos Casos (Table-Driven Tests)

Repetir o código para cada novo caso de teste é ineficiente. O padrão idiomático em Go é usar "Table-Driven Tests" (testes orientados a tabelas).

```go
// arquivo: calculadora_test.go
package calculadora

import "testing"

func TestSomaComTabela(t *testing.T) {
    // 1. Crie uma slice de structs, onde cada struct representa um caso de teste.
    casos := []struct {
        nome     string // Um nome descritivo para o caso de teste
        a, b     int
        esperado int
    }{
        {"soma de positivos", 2, 3, 5},
        {"soma com zero", 10, 0, 10},
        {"soma com negativo", 5, -3, 2},
        {"soma de negativos", -1, -1, -2},
    }

    // 2. Itere sobre a slice de casos de teste.
    for _, tt := range casos {
        // t.Run() cria um sub-teste, o que organiza a saída e permite focar em falhas específicas.
        t.Run(tt.nome, func(t *testing.T) {
            resultado := Soma(tt.a, tt.b)
            if resultado != tt.esperado {
                t.Errorf("resultado %d, esperado %d", resultado, tt.esperado)
            }
        })
    }
}
```

### Armadilhas Comuns

1.  **Testes Dependentes de Ordem:** Cada teste deve ser independente. Se o Teste B só passa se o Teste A rodar primeiro, há um problema de design. A ferramenta `go test` pode rodar testes em paralelo, quebrando essa dependência.

2.  **Ignorar Casos Extremos (Edge Cases):** Não testar apenas o "caminho feliz". Teste com zeros, números negativos, strings vazias, `nil`, etc. É nesses extremos que os bugs se escondem.

3.  **Testes Lentos:** Testes que dependem de rede, banco de dados ou disco podem ser lentos e frágeis. Para esses casos, use "test doubles" (mocks, stubs) para simular essas dependências externas.

### Boas Práticas

1.  **Use Table-Driven Tests:** É o padrão da comunidade Go. Torna a adição de novos casos de teste trivial e mantém o código limpo.

2.  **Nomes de Teste Descritivos:** `TestSomaComNegativos` é melhor que `TestSoma2`. O nome deve explicar o que está sendo testado.

3.  **Use `t.Helper()`:** Se você criar uma função auxiliar para seus testes (por exemplo, para verificar erros repetidamente), chame `t.Helper()` no início dela. Isso faz com que, em caso de falha, o `go test` reporte a linha do seu teste que chamou a função, e não a linha dentro da função auxiliar.

4.  **Mire na Cobertura, mas não se Obsedie:** A ferramenta `go test -cover` mostra qual porcentagem do seu código é coberta por testes. É uma métrica útil, mas 100% de cobertura não significa ausência de bugs. Foco em testar a lógica crítica.

### Resumo Rápido

*   Testes em Go vivem em arquivos `*_test.go`.
*   Funções de teste começam com `Test...` e recebem `t *testing.T`.
*   Use `t.Errorf()` para sinalizar uma falha.
*   O comando `go test` executa todos os testes no pacote.
*   **Table-Driven Tests** é a forma idiomática de estruturar múltiplos casos de teste.
*   Testes garantem confiança, documentam o código e melhoram o design. Construa a ponte e teste-a antes de abri-la para o tráfego!
