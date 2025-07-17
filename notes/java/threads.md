# Threads em Java

Threads são unidades de execução que permitem a execução paralela de código em Java. Elas são úteis para melhorar o desempenho de aplicações.

## Criando uma Thread

Podemos criar uma thread estendendo a classe `Thread` ou implementando a interface `Runnable`.

### Exemplo com `Thread`

```java
class MinhaThread extends Thread {
    public void run() {
        System.out.println("Thread executada");
    }
}

public class ExemploThread {
    public static void main(String[] args) {
        MinhaThread t = new MinhaThread();
        t.start();
    }
}
```

### Exemplo com `Runnable`

```java
class MinhaRunnable implements Runnable {
    public void run() {
        System.out.println("Runnable executado");
    }
}

public class ExemploRunnable {
    public static void main(String[] args) {
        Thread t = new Thread(new MinhaRunnable());
        t.start();
    }
}
```
