# Streams em Java

Streams são uma abstração para processar coleções de dados de forma funcional. Elas foram introduzidas no Java 8 e fazem parte do pacote `java.util.stream`.

## Operações em Streams

- **Intermediárias**: Retornam um novo stream (ex.: `filter`, `map`).
- **Finais**: Produzem um resultado (ex.: `collect`, `forEach`).

## Exemplo de Uso

```java
import java.util.*;
import java.util.stream.*;

public class ExemploStreams {
    public static void main(String[] args) {
        List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos", "Amanda");

        List<String> filtrados = nomes.stream()
            .filter(nome -> nome.startsWith("A"))
            .map(String::toUpperCase)
            .collect(Collectors.toList());

        filtrados.forEach(System.out::println);
    }
}
```
