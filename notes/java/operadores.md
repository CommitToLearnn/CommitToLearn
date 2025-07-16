# Operadores em Java

## Operadores Aritméticos

### Operadores Básicos
```java
public class OperadoresAritmeticos {
    public static void main(String[] args) {
        int a = 10, b = 3;
        
        System.out.println("Soma: " + (a + b));        // 13
        System.out.println("Subtração: " + (a - b));   // 7
        System.out.println("Multiplicação: " + (a * b)); // 30
        System.out.println("Divisão: " + (a / b));     // 3 (divisão inteira)
        System.out.println("Módulo: " + (a % b));      // 1 (resto da divisão)
    }
}
```

### Operadores de Incremento e Decremento
```java
int x = 5;

// Pré-incremento/decremento
int y = ++x; // x vira 6, y recebe 6
int z = --x; // x vira 5, z recebe 5

// Pós-incremento/decremento
int w = x++; // w recebe 5, depois x vira 6
int v = x--; // v recebe 6, depois x vira 5
```

## Operadores de Atribuição

### Atribuição Simples e Composta
```java
int num = 10;

// Atribuição composta
num += 5;  // num = num + 5;  (15)
num -= 3;  // num = num - 3;  (12)
num *= 2;  // num = num * 2;  (24)
num /= 4;  // num = num / 4;  (6)
num %= 3;  // num = num % 3;  (0)
```

## Operadores de Comparação

```java
int a = 10, b = 20;

System.out.println(a == b);  // false (igual)
System.out.println(a != b);  // true (diferente)
System.out.println(a < b);   // true (menor que)
System.out.println(a > b);   // false (maior que)
System.out.println(a <= b);  // true (menor ou igual)
System.out.println(a >= b);  // false (maior ou igual)
```

## Operadores Lógicos

### AND, OR e NOT
```java
boolean x = true, y = false;

System.out.println(x && y);  // false (AND lógico)
System.out.println(x || y);  // true (OR lógico)
System.out.println(!x);      // false (NOT lógico)
System.out.println(!y);      // true (NOT lógico)
```

### Operadores de Curto-Circuito
```java
int a = 5, b = 0;

// && para de avaliar se a primeira condição for false
if (b != 0 && a / b > 2) {
    System.out.println("Divisão segura");
}

// || para de avaliar se a primeira condição for true
if (a > 0 || b / a > 1) {
    System.out.println("Pelo menos uma condição é verdadeira");
}
```

## Operador Ternário

### Sintaxe: `condição ? valorSeVerdadeiro : valorSeFalso`
```java
int idade = 17;
String categoria = (idade >= 18) ? "Adulto" : "Menor";
System.out.println(categoria); // "Menor"

// Exemplo mais complexo
int a = 10, b = 20;
int maior = (a > b) ? a : b;
System.out.println("Maior número: " + maior); // 20
```

## Precedência de Operadores

### Ordem de Avaliação (do maior para menor)
1. `()` - Parênteses
2. `++`, `--`, `!` - Unários
3. `*`, `/`, `%` - Multiplicativos
4. `+`, `-` - Aditivos
5. `<`, `>`, `<=`, `>=` - Relacionais
6. `==`, `!=` - Igualdade
7. `&&` - AND lógico
8. `||` - OR lógico
9. `?:` - Ternário
10. `=`, `+=`, `-=`, etc. - Atribuição

### Exemplo Prático
```java
int resultado = 2 + 3 * 4; // resultado = 14 (não 20)
int resultado2 = (2 + 3) * 4; // resultado2 = 20
```

## Dicas Importantes
- Use parênteses para tornar a precedência clara
- Cuidado com divisão por zero
- Operadores de comparação retornam boolean
- Operador ternário é útil para atribuições condicionais simples
