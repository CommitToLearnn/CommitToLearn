# Expressões Lambda em Java

As expressões lambda foram introduzidas no Java 8 e permitem escrever código mais conciso e funcional.

## Sintaxe Básica

```java
(parametros) -> expressao
```

## Exemplo de Uso

```java
import java.util.*;

public class ExemploLambda {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");

        nomes.forEach(nome -> System.out.println(nome));
    }
}
```
