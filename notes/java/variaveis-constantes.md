# Variáveis e Constantes em Java

## Declaração de Variáveis

### Sintaxe Básica
```java
tipo nomeVariavel = valor;
```

### Exemplos
```java
public class Variaveis {
    public static void main(String[] args) {
        // Declaração e inicialização
        int idade = 30;
        String nome = "João";
        double salario = 5000.50;
        
        // Declaração sem inicialização
        boolean ativo;
        ativo = true;
        
        // Múltiplas variáveis do mesmo tipo
        int a = 10, b = 20, c = 30;
    }
}
```

## Constantes

### Usando `final`
```java
public class Constantes {
    // Constante de classe
    public static final double PI = 3.14159;
    public static final String EMPRESA = "MinhaEmpresa";
    
    public static void main(String[] args) {
        // Constante local
        final int MAXIMO_TENTATIVAS = 3;
        final double TAXA_JUROS = 0.05;
        
        System.out.println("PI: " + PI);
        System.out.println("Máximo tentativas: " + MAXIMO_TENTATIVAS);
    }
}
```

## Regras de Nomenclatura

### Convenções para Variáveis
- Começar com letra minúscula
- Usar camelCase
- Nomes descritivos

```java
// Bom
int idadeUsuario;
String nomeCompleto;
double valorTotal;

// Evitar
int x;
String n;
double v;
```

### Convenções para Constantes
- Todas as letras maiúsculas
- Separar palavras com underscore (_)

```java
public static final int IDADE_MINIMA = 18;
public static final String MENSAGEM_ERRO = "Erro no sistema";
```

## Escopo de Variáveis

### Variáveis Locais
```java
public class Escopo {
    public static void main(String[] args) {
        int x = 10; // Variável local ao método main
        
        if (x > 5) {
            int y = 20; // Variável local ao bloco if
            System.out.println(x + y);
        }
        // y não existe aqui
    }
}
```

### Variáveis de Instância
```java
public class Pessoa {
    private String nome; // Variável de instância
    private int idade;   // Variável de instância
    
    public void setNome(String nome) {
        this.nome = nome; // this.nome refere-se à variável de instância
    }
}
```

## Dicas Importantes
- Sempre inicialize variáveis locais antes de usar
- Use nomes descritivos para melhor legibilidade
- Constantes devem ser declaradas como `final`
- Evite usar palavras reservadas como nomes de variáveis
