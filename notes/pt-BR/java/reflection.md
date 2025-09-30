# Reflection em Java

Reflection é a capacidade de inspecionar e manipular classes, métodos e atributos em tempo de execução. Ele faz parte do pacote `java.lang.reflect`.

## Obtendo Informações de uma Classe

```java
import java.lang.reflect.*;

public class ExemploReflection {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> clazz = Class.forName("java.util.ArrayList");

        System.out.println("Nome da Classe: " + clazz.getName());

        Method[] methods = clazz.getMethods();
        for (Method method : methods) {
            System.out.println("Método: " + method.getName());
        }
    }
}
```
