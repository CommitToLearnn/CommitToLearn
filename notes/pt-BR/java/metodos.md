# Métodos em Java

## Conceitos Básicos

### Sintaxe de um Método
```java
modificadorDeAcesso tipoRetorno nomeMetodo(parametros) {
    // corpo do método
    return valor; // se tipoRetorno não for void
}
```

### Exemplo Básico
```java
public class ExemplosMetodos {
    // Método que não retorna valor (void)
    public static void saudar() {
        System.out.println("Olá, mundo!");
    }
    
    // Método que retorna um valor
    public static int somar(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        saudar(); // Chamada do método
        
        int resultado = somar(5, 3); // Chamada com retorno
        System.out.println("Resultado: " + resultado);
    }
}
```

## Tipos de Métodos

### Métodos sem Parâmetros
```java
public class MetodosSemParametros {
    public static void exibirMenu() {
        System.out.println("=== MENU ===");
        System.out.println("1. Opção A");
        System.out.println("2. Opção B");
        System.out.println("0. Sair");
    }
    
    public static double obterPi() {
        return 3.14159;
    }
    
    public static void main(String[] args) {
        exibirMenu();
        double pi = obterPi();
        System.out.println("Pi: " + pi);
    }
}
```

### Métodos com Parâmetros
```java
public class MetodosComParametros {
    // Um parâmetro
    public static void cumprimentar(String nome) {
        System.out.println("Olá, " + nome + "!");
    }
    
    // Múltiplos parâmetros
    public static double calcularArea(double largura, double altura) {
        return largura * altura;
    }
    
    // Diferentes tipos de parâmetros
    public static void exibirPessoa(String nome, int idade, boolean ativo) {
        System.out.println("Nome: " + nome);
        System.out.println("Idade: " + idade);
        System.out.println("Ativo: " + ativo);
    }
    
    public static void main(String[] args) {
        cumprimentar("Maria");
        
        double area = calcularArea(5.0, 3.0);
        System.out.println("Área: " + area);
        
        exibirPessoa("João", 25, true);
    }
}
```

## Métodos com Retorno

### Diferentes Tipos de Retorno
```java
public class MetodosComRetorno {
    // Retorna int
    public static int multiplicar(int x, int y) {
        return x * y;
    }
    
    // Retorna String
    public static String formatarNome(String nome) {
        return nome.trim().toLowerCase();
    }
    
    // Retorna boolean
    public static boolean ehPar(int numero) {
        return numero % 2 == 0;
    }
    
    // Retorna array
    public static int[] criarSequencia(int tamanho) {
        int[] sequencia = new int[tamanho];
        for (int i = 0; i < tamanho; i++) {
            sequencia[i] = i + 1;
        }
        return sequencia;
    }
    
    public static void main(String[] args) {
        int produto = multiplicar(4, 5);
        String nomeFormatado = formatarNome("  PEDRO  ");
        boolean par = ehPar(10);
        int[] numeros = criarSequencia(5);
        
        System.out.println("Produto: " + produto);
        System.out.println("Nome: " + nomeFormatado);
        System.out.println("É par: " + par);
        System.out.print("Sequência: ");
        for (int num : numeros) {
            System.out.print(num + " ");
        }
    }
}
```

## Sobrecarga de Métodos (Overloading)

### Métodos com Mesmo Nome, Parâmetros Diferentes
```java
public class SobrecargaMetodos {
    // Método original
    public static int somar(int a, int b) {
        return a + b;
    }
    
    // Sobrecarga: três parâmetros
    public static int somar(int a, int b, int c) {
        return a + b + c;
    }
    
    // Sobrecarga: tipo diferente
    public static double somar(double a, double b) {
        return a + b;
    }
    
    // Sobrecarga: array
    public static int somar(int[] numeros) {
        int soma = 0;
        for (int num : numeros) {
            soma += num;
        }
        return soma;
    }
    
    public static void main(String[] args) {
        System.out.println("Soma 2 ints: " + somar(2, 3));
        System.out.println("Soma 3 ints: " + somar(2, 3, 4));
        System.out.println("Soma doubles: " + somar(2.5, 3.7));
        System.out.println("Soma array: " + somar(new int[]{1, 2, 3, 4, 5}));
    }
}
```

## Escopo de Variáveis

### Variáveis Locais vs Parâmetros
```java
public class EscopoVariaveis {
    // Variável de classe
    static int contadorGlobal = 0;
    
    public static void exemploEscopo(int parametro) {
        // Variável local
        int variavelLocal = 10;
        
        // Parâmetro é acessível em todo o método
        System.out.println("Parâmetro: " + parametro);
        System.out.println("Variável local: " + variavelLocal);
        System.out.println("Contador global: " + contadorGlobal);
        
        contadorGlobal++; // Modificando variável de classe
    }
    
    public static void outroMetodo() {
        // contadorGlobal é acessível
        System.out.println("Contador em outro método: " + contadorGlobal);
        
        // parametro e variavelLocal NÃO são acessíveis aqui
    }
    
    public static void main(String[] args) {
        exemploEscopo(5);
        outroMetodo();
    }
}
```

## Métodos Recursivos

### Conceito e Exemplo
```java
public class MetodosRecursivos {
    // Fatorial recursivo
    public static int fatorial(int n) {
        // Caso base
        if (n <= 1) {
            return 1;
        }
        // Chamada recursiva
        return n * fatorial(n - 1);
    }
    
    // Fibonacci recursivo
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    // Soma de array recursiva
    public static int somarArray(int[] array, int indice) {
        // Caso base
        if (indice >= array.length) {
            return 0;
        }
        // Chamada recursiva
        return array[indice] + somarArray(array, indice + 1);
    }
    
    public static void main(String[] args) {
        System.out.println("Fatorial de 5: " + fatorial(5));
        System.out.println("Fibonacci de 7: " + fibonacci(7));
        
        int[] numeros = {1, 2, 3, 4, 5};
        System.out.println("Soma do array: " + somarArray(numeros, 0));
    }
}
```

## Passagem de Parâmetros

### Passagem por Valor vs Referência
```java
public class PassagemParametros {
    // Primitivos são passados por valor
    public static void modificarPrimitivo(int numero) {
        numero = 100; // Não afeta a variável original
    }
    
    // Arrays são passados por referência
    public static void modificarArray(int[] array) {
        array[0] = 999; // Modifica o array original
    }
    
    // Strings são imutáveis
    public static void modificarString(String texto) {
        texto = "Novo texto"; // Não modifica a string original
    }
    
    public static void main(String[] args) {
        // Testando primitivos
        int numero = 10;
        modificarPrimitivo(numero);
        System.out.println("Número após método: " + numero); // 10 (inalterado)
        
        // Testando arrays
        int[] array = {1, 2, 3};
        modificarArray(array);
        System.out.println("Array[0] após método: " + array[0]); // 999 (modificado)
        
        // Testando strings
        String texto = "Texto original";
        modificarString(texto);
        System.out.println("Texto após método: " + texto); // "Texto original" (inalterado)
    }
}
```

## Boas Práticas

### Exemplo de Métodos Bem Estruturados
```java
public class BoasPraticas {
    // ✅ Nome descritivo, uma responsabilidade
    public static boolean ehEmailValido(String email) {
        return email != null && email.contains("@") && email.contains(".");
    }
    
    // ✅ Parâmetros claros, retorno óbvio
    public static double calcularDescontoComImposto(double preco, double percentualDesconto, double imposto) {
        double precoComDesconto = preco * (1 - percentualDesconto / 100);
        return precoComDesconto * (1 + imposto / 100);
    }
    
    // ✅ Método pequeno e focado
    public static void imprimirLinhaSeparadora() {
        System.out.println("=====================================");
    }
    
    // ✅ Validação de parâmetros
    public static double dividir(double dividendo, double divisor) {
        if (divisor == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero");
        }
        return dividendo / divisor;
    }
    
    public static void main(String[] args) {
        System.out.println("Email válido: " + ehEmailValido("user@example.com"));
        
        imprimirLinhaSeparadora();
        
        double precoFinal = calcularDescontoComImposto(100.0, 10.0, 5.0);
        System.out.println("Preço final: " + precoFinal);
        
        try {
            double resultado = dividir(10, 2);
            System.out.println("Divisão: " + resultado);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
        }
    }
}
```

## Dicas Importantes

1. **Nomes descritivos**: Use nomes que expliquem o que o método faz
2. **Uma responsabilidade**: Cada método deve fazer apenas uma coisa
3. **Parâmetros necessários**: Não passe parâmetros desnecessários
4. **Validação**: Valide parâmetros quando necessário
5. **Tamanho**: Mantenha métodos pequenos e legíveis
6. **Retorno consistente**: Se um método pode falhar, considere exceções
7. **Documentação**: Use comentários para métodos complexos
8. **Reutilização**: Crie métodos que possam ser reutilizados
