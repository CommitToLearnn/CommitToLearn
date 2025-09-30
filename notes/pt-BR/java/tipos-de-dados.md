# Tipos de Dados em Java

## Tipos Primitivos

### Tipos Numéricos Inteiros
- **byte**: 8 bits, valor de -128 a 127
- **short**: 16 bits, valor de -32.768 a 32.767
- **int**: 32 bits, valor de -2.147.483.648 a 2.147.483.647
- **long**: 64 bits, valor de -9.223.372.036.854.775.808 a 9.223.372.036.854.775.807

### Tipos Numéricos Decimais
- **float**: 32 bits, precisão simples
- **double**: 64 bits, precisão dupla (padrão para decimais)

### Outros Tipos
- **boolean**: true ou false
- **char**: 16 bits, representa um caractere Unicode

## Exemplos Práticos

```java
public class TiposDados {
    public static void main(String[] args) {
        // Inteiros
        int idade = 25;
        long populacao = 8000000000L; // L no final para long
        
        // Decimais
        double preco = 19.99;
        float temperatura = 23.5f; // f no final para float
        
        // Outros
        boolean ativo = true;
        char inicial = 'J';
        
        System.out.println("Idade: " + idade);
        System.out.println("População: " + populacao);
        System.out.println("Preço: " + preco);
    }
}
```

## Conversão de Tipos (Casting)

### Conversão Implícita (Widening)
```java
int numero = 10;
double decimal = numero; // Automático
```

### Conversão Explícita (Narrowing)
```java
double decimal = 10.99;
int numero = (int) decimal; // Explícito, perde a parte decimal
```

## Dicas Importantes
- Use `int` para números inteiros na maioria dos casos
- Use `double` para números decimais
- `String` não é um tipo primitivo, é uma classe
- Tipos primitivos começam com letra minúscula
- Classes wrapper começam com letra maiúscula (Integer, Double, etc.)
