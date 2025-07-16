# Estruturas de Repetição em Java

## Loop for

### for Tradicional
```java
public class LoopFor {
    public static void main(String[] args) {
        // Estrutura: for (inicialização; condição; incremento)
        for (int i = 0; i < 5; i++) {
            System.out.println("Iteração: " + i);
        }
        
        // Contagem regressiva
        for (int i = 10; i >= 1; i--) {
            System.out.println("Contagem: " + i);
        }
        
        // Incremento personalizado
        for (int i = 0; i <= 20; i += 2) {
            System.out.println("Número par: " + i);
        }
    }
}
```

### for-each (Enhanced for)
```java
public class ForEach {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30, 40, 50};
        
        // for-each para arrays
        for (int numero : numeros) {
            System.out.println("Número: " + numero);
        }
        
        String[] nomes = {"João", "Maria", "Pedro"};
        for (String nome : nomes) {
            System.out.println("Nome: " + nome);
        }
    }
}
```

## Loop while

### while Básico
```java
public class LoopWhile {
    public static void main(String[] args) {
        int contador = 0;
        
        while (contador < 5) {
            System.out.println("Contador: " + contador);
            contador++; // Importante: incrementar para evitar loop infinito
        }
        
        // Exemplo com condição mais complexa
        int numero = 1;
        while (numero <= 100) {
            if (numero % 2 == 0) {
                System.out.println(numero + " é par");
            }
            numero++;
        }
    }
}
```

### do-while
```java
public class DoWhile {
    public static void main(String[] args) {
        int num = 5;
        
        // Executa pelo menos uma vez, mesmo que a condição seja falsa
        do {
            System.out.println("Número: " + num);
            num--;
        } while (num > 0);
        
        // Exemplo: menu que executa pelo menos uma vez
        int opcao;
        do {
            System.out.println("1 - Opção A");
            System.out.println("2 - Opção B");
            System.out.println("0 - Sair");
            opcao = 0; // Simulando entrada do usuário
        } while (opcao != 0);
    }
}
```

## Controle de Fluxo

### break - Sair do Loop
```java
public class ExemploBreak {
    public static void main(String[] args) {
        // Procurar um número específico
        int[] numeros = {1, 5, 3, 8, 2, 9};
        int procurado = 8;
        
        for (int numero : numeros) {
            if (numero == procurado) {
                System.out.println("Número " + procurado + " encontrado!");
                break; // Sai do loop
            }
            System.out.println("Verificando: " + numero);
        }
        
        // break em loop aninhado
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= 3; j++) {
                if (i == 2 && j == 2) {
                    break; // Sai apenas do loop interno
                }
                System.out.println(i + "," + j);
            }
        }
    }
}
```

### continue - Pular Iteração
```java
public class ExemploContinue {
    public static void main(String[] args) {
        // Imprimir apenas números ímpares
        for (int i = 1; i <= 10; i++) {
            if (i % 2 == 0) {
                continue; // Pula o restante da iteração
            }
            System.out.println("Número ímpar: " + i);
        }
        
        // Pular elementos específicos
        String[] palavras = {"casa", "carro", "", "bicicleta", null, "avião"};
        for (String palavra : palavras) {
            if (palavra == null || palavra.isEmpty()) {
                continue; // Pula palavras vazias ou nulas
            }
            System.out.println("Palavra válida: " + palavra);
        }
    }
}
```

## Loops Aninhados

### Exemplo: Tabela de Multiplicação
```java
public class LoopsAninhados {
    public static void main(String[] args) {
        // Tabela de multiplicação
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= 5; j++) {
                System.out.print((i * j) + "\t");
            }
            System.out.println(); // Nova linha
        }
        
        // Padrão de estrelas
        for (int linha = 1; linha <= 5; linha++) {
            for (int estrela = 1; estrela <= linha; estrela++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}
```

## Loops Infinitos e Como Evitar

### Loop Infinito (Cuidado!)
```java
// ❌ EVITAR - Loop infinito
while (true) {
    System.out.println("Isso nunca para!");
    // Sem break ou mudança na condição
}

// ✅ CORRETO - Com condição de saída
Scanner scanner = new Scanner(System.in);
while (true) {
    System.out.print("Digite 'sair' para terminar: ");
    String input = scanner.nextLine();
    if (input.equals("sair")) {
        break; // Condição de saída
    }
}
```

## Comparação entre Tipos de Loop

### Quando Usar Cada Tipo

**for tradicional:**
- Quando você sabe o número de iterações
- Para contadores específicos

**for-each:**
- Para percorrer arrays ou coleções
- Quando não precisa do índice

**while:**
- Quando não sabe quantas iterações serão necessárias
- Condição verificada antes da execução

**do-while:**
- Quando precisa executar pelo menos uma vez
- Menus, validações de entrada

### Exemplo Comparativo
```java
int[] array = {1, 2, 3, 4, 5};

// for tradicional - quando precisa do índice
for (int i = 0; i < array.length; i++) {
    System.out.println("Posição " + i + ": " + array[i]);
}

// for-each - mais simples quando não precisa do índice
for (int valor : array) {
    System.out.println("Valor: " + valor);
}

// while - com condição complexa
int i = 0;
while (i < array.length && array[i] < 4) {
    System.out.println("Menor que 4: " + array[i]);
    i++;
}
```

## Dicas e Melhores Práticas

1. **Sempre garanta uma condição de saída** para evitar loops infinitos
2. **Use for-each** quando possível para maior legibilidade
3. **Prefira for tradicional** quando precisar do índice
4. **Use while** para condições complexas ou indeterminadas
5. **Cuidado com modificações** em arrays durante for-each
6. **Use break e continue** para controle de fluxo mais limpo
