# Coleções em Java

As coleções em Java são estruturas de dados que permitem armazenar e manipular grupos de objetos. Elas fazem parte do pacote `java.util`.

## Principais Interfaces

- **List**: Uma coleção ordenada que permite elementos duplicados.
- **Set**: Uma coleção que não permite elementos duplicados.
- **Map**: Uma coleção que mapeia chaves para valores.

## Exemplo de Uso

```java
import java.util.*;

public class ExemploColecoes {
    public static void main(String[] args) {
        List<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("A");

        Set<String> conjunto = new HashSet<>(lista);

        Map<Integer, String> mapa = new HashMap<>();
        mapa.put(1, "Um");
        mapa.put(2, "Dois");

        System.out.println("Lista: " + lista);
        System.out.println("Conjunto: " + conjunto);
        System.out.println("Mapa: " + mapa);
    }
}
```
