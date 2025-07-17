# Anotações em Java

Anotações são metadados que fornecem informações adicionais ao compilador ou em tempo de execução. Elas são precedidas pelo símbolo `@`.

## Exemplos de Anotações

- `@Override`: Indica que um método sobrescreve outro.
- `@Deprecated`: Marca um elemento como obsoleto.
- `@SuppressWarnings`: Suprime avisos do compilador.

## Criando uma Anotação Personalizada

```java
import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface MinhaAnotacao {
    String valor();
}

public class ExemploAnotacao {
    @MinhaAnotacao(valor = "Teste")
    public void meuMetodo() {
        System.out.println("Método anotado");
    }
}
```
