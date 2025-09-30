# Tratamento de Exceções em Java

Exceções são eventos que ocorrem durante a execução de um programa e interrompem o fluxo normal. O Java fornece mecanismos para tratar essas exceções.

## Blocos Try-Catch

```java
try {
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Erro: " + e.getMessage());
}
```

## Lançando Exceções

```java
public void verificaIdade(int idade) throws Exception {
    if (idade < 18) {
        throw new Exception("Idade insuficiente");
    }
}
```
