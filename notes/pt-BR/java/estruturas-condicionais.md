# Estruturas Condicionais em Java

## if, else if, else

### Sintaxe Básica
```java
if (condição) {
    // código executado se condição for verdadeira
}
```

### Exemplo Completo
```java
public class EstruturaCondicional {
    public static void main(String[] args) {
        int nota = 85;
        
        if (nota >= 90) {
            System.out.println("Conceito A");
        } else if (nota >= 80) {
            System.out.println("Conceito B");
        } else if (nota >= 70) {
            System.out.println("Conceito C");
        } else if (nota >= 60) {
            System.out.println("Conceito D");
        } else {
            System.out.println("Conceito F");
        }
    }
}
```

### if Simples sem Chaves
```java
int idade = 17;

// Para uma única instrução, as chaves são opcionais
if (idade >= 18)
    System.out.println("Maior de idade");
else
    System.out.println("Menor de idade");
```

## switch-case

### Sintaxe Básica
```java
switch (variavel) {
    case valor1:
        // código
        break;
    case valor2:
        // código
        break;
    default:
        // código padrão
        break;
}
```

### Exemplo com Dias da Semana
```java
public class ExemploSwitch {
    public static void main(String[] args) {
        int diaSemana = 3;
        String nomeDia;
        
        switch (diaSemana) {
            case 1:
                nomeDia = "Domingo";
                break;
            case 2:
                nomeDia = "Segunda-feira";
                break;
            case 3:
                nomeDia = "Terça-feira";
                break;
            case 4:
                nomeDia = "Quarta-feira";
                break;
            case 5:
                nomeDia = "Quinta-feira";
                break;
            case 6:
                nomeDia = "Sexta-feira";
                break;
            case 7:
                nomeDia = "Sábado";
                break;
            default:
                nomeDia = "Dia inválido";
                break;
        }
        
        System.out.println("Hoje é: " + nomeDia);
    }
}
```

### Switch com String (Java 7+)
```java
public class SwitchString {
    public static void main(String[] args) {
        String mes = "Janeiro";
        
        switch (mes.toLowerCase()) {
            case "janeiro":
            case "março":
            case "maio":
                System.out.println("Este mês tem 31 dias");
                break;
            case "abril":
            case "junho":
            case "setembro":
                System.out.println("Este mês tem 30 dias");
                break;
            case "fevereiro":
                System.out.println("Este mês tem 28 ou 29 dias");
                break;
            default:
                System.out.println("Mês inválido");
        }
    }
}
```

## Switch Expressions (Java 14+)

### Nova Sintaxe
```java
public class SwitchExpression {
    public static void main(String[] args) {
        int dia = 3;
        
        String tipoDia = switch (dia) {
            case 1, 7 -> "Final de semana";
            case 2, 3, 4, 5, 6 -> "Dia útil";
            default -> "Dia inválido";
        };
        
        System.out.println(tipoDia);
    }
}
```

## Condições Aninhadas

### if Aninhado
```java
public class CondicoesAninhadas {
    public static void main(String[] args) {
        int idade = 20;
        boolean temCarteira = true;
        
        if (idade >= 18) {
            if (temCarteira) {
                System.out.println("Pode dirigir");
            } else {
                System.out.println("Precisa tirar carteira");
            }
        } else {
            System.out.println("Muito jovem para dirigir");
        }
    }
}
```

## Operadores Lógicos em Condições

### Combinando Condições
```java
public class OperadoresLogicos {
    public static void main(String[] args) {
        int idade = 25;
        double salario = 3000.0;
        boolean temCPF = true;
        
        // AND (&&)
        if (idade >= 18 && salario > 2000 && temCPF) {
            System.out.println("Aprovado para o cartão");
        }
        
        // OR (||)
        if (idade < 18 || salario < 1000) {
            System.out.println("Não aprovado");
        }
        
        // NOT (!)
        if (!temCPF) {
            System.out.println("CPF obrigatório");
        }
    }
}
```

## Dicas e Melhores Práticas

### Evitar if-else Longos
```java
// ❌ Evitar
if (nota >= 90) {
    return "A";
} else if (nota >= 80) {
    return "B";
} else if (nota >= 70) {
    return "C";
} else {
    return "F";
}

// ✅ Melhor
if (nota >= 90) return "A";
if (nota >= 80) return "B";
if (nota >= 70) return "C";
return "F";
```

### Usar switch para Múltiplos Valores
```java
// ❌ Evitar para muitos valores
if (dia == 1 || dia == 7) {
    // final de semana
} else if (dia >= 2 && dia <= 6) {
    // dia útil
}

// ✅ Melhor
switch (dia) {
    case 1:
    case 7:
        // final de semana
        break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
        // dia útil
        break;
}
```

## Importante Lembrar
- Sempre use `break` no switch-case (exceto quando quiser fall-through)
- Para uma única instrução, as chaves são opcionais no if
- switch funciona com: int, char, String, enum
- Condições devem retornar boolean
