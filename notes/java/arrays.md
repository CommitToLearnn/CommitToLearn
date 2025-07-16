# Arrays em Java

## Declaração e Inicialização

### Formas de Declarar Arrays
```java
public class DeclaracaoArrays {
    public static void main(String[] args) {
        // Forma 1: Declaração e depois inicialização
        int[] numeros;
        numeros = new int[5]; // Array de 5 inteiros (0, 0, 0, 0, 0)
        
        // Forma 2: Declaração e inicialização juntas
        int[] idades = new int[10];
        
        // Forma 3: Declaração com valores iniciais
        int[] notas = {85, 90, 78, 92, 88};
        
        // Forma 4: Inicialização explícita
        String[] nomes = new String[]{"João", "Maria", "Pedro"};
        
        // Sintaxe alternativa (menos comum)
        double valores[] = new double[3];
    }
}
```

### Inicializando com Valores
```java
public class InicializacaoArrays {
    public static void main(String[] args) {
        // Array de inteiros
        int[] numeros = {1, 2, 3, 4, 5};
        
        // Array de strings
        String[] frutas = {"maçã", "banana", "laranja"};
        
        // Array de booleans
        boolean[] flags = {true, false, true, false};
        
        // Array de chars
        char[] vogais = {'a', 'e', 'i', 'o', 'u'};
    }
}
```

## Acessando Elementos

### Índices e Acesso
```java
public class AcessoArrays {
    public static void main(String[] args) {
        int[] numeros = {10, 20, 30, 40, 50};
        
        // Acessar elementos (índice começa em 0)
        System.out.println("Primeiro elemento: " + numeros[0]); // 10
        System.out.println("Último elemento: " + numeros[4]);   // 50
        
        // Modificar elementos
        numeros[2] = 35; // Mudança: 30 → 35
        
        // Tamanho do array
        System.out.println("Tamanho do array: " + numeros.length);
        
        // Último elemento usando length
        System.out.println("Último: " + numeros[numeros.length - 1]);
    }
}
```

## Percorrendo Arrays

### Loop Tradicional
```java
public class PercorrerArrays {
    public static void main(String[] args) {
        int[] notas = {85, 90, 78, 92, 88};
        
        // for tradicional
        for (int i = 0; i < notas.length; i++) {
            System.out.println("Nota " + (i + 1) + ": " + notas[i]);
        }
        
        // for-each (mais limpo)
        for (int nota : notas) {
            System.out.println("Nota: " + nota);
        }
        
        // while
        int i = 0;
        while (i < notas.length) {
            System.out.println("Nota: " + notas[i]);
            i++;
        }
    }
}
```

## Operações Comuns

### Encontrar Elementos
```java
public class OperacoesArrays {
    public static void main(String[] args) {
        int[] numeros = {15, 23, 8, 42, 16};
        
        // Encontrar o maior elemento
        int maior = numeros[0];
        for (int numero : numeros) {
            if (numero > maior) {
                maior = numero;
            }
        }
        System.out.println("Maior número: " + maior);
        
        // Calcular a soma
        int soma = 0;
        for (int numero : numeros) {
            soma += numero;
        }
        System.out.println("Soma: " + soma);
        
        // Calcular a média
        double media = (double) soma / numeros.length;
        System.out.println("Média: " + media);
        
        // Procurar um elemento
        int procurado = 23;
        boolean encontrado = false;
        for (int numero : numeros) {
            if (numero == procurado) {
                encontrado = true;
                break;
            }
        }
        System.out.println(procurado + " encontrado: " + encontrado);
    }
}
```

## Arrays Multidimensionais

### Array Bidimensional (Matriz)
```java
public class ArraysBidimensionais {
    public static void main(String[] args) {
        // Declaração e inicialização
        int[][] matriz = {
            {1, 2, 3},
            {4, 5, 6},
            {7, 8, 9}
        };
        
        // Ou criando com tamanho definido
        int[][] tabela = new int[3][4]; // 3 linhas, 4 colunas
        
        // Acessar elementos
        System.out.println("Elemento [1][2]: " + matriz[1][2]); // 6
        
        // Modificar elemento
        matriz[0][0] = 10;
        
        // Percorrer matriz
        for (int i = 0; i < matriz.length; i++) {
            for (int j = 0; j < matriz[i].length; j++) {
                System.out.print(matriz[i][j] + " ");
            }
            System.out.println(); // Nova linha
        }
        
        // For-each para matrizes
        for (int[] linha : matriz) {
            for (int elemento : linha) {
                System.out.print(elemento + " ");
            }
            System.out.println();
        }
    }
}
```

## Métodos Úteis da Classe Arrays

### Utilizando java.util.Arrays
```java
import java.util.Arrays;

public class MetodosArrays {
    public static void main(String[] args) {
        int[] numeros = {5, 2, 8, 1, 9};
        
        // Ordenar array
        Arrays.sort(numeros);
        System.out.println("Ordenado: " + Arrays.toString(numeros));
        
        // Busca binária (array deve estar ordenado)
        int indice = Arrays.binarySearch(numeros, 8);
        System.out.println("Índice do 8: " + indice);
        
        // Comparar arrays
        int[] outroArray = {1, 2, 5, 8, 9};
        boolean iguais = Arrays.equals(numeros, outroArray);
        System.out.println("Arrays iguais: " + iguais);
        
        // Preencher array
        int[] zeros = new int[5];
        Arrays.fill(zeros, 7);
        System.out.println("Preenchido: " + Arrays.toString(zeros));
        
        // Copiar array
        int[] copia = Arrays.copyOf(numeros, numeros.length);
        System.out.println("Cópia: " + Arrays.toString(copia));
    }
}
```

## Problemas Comuns e Soluções

### ArrayIndexOutOfBoundsException
```java
public class ErrosComuns {
    public static void main(String[] args) {
        int[] array = {1, 2, 3};
        
        // ❌ ERRO: Tentativa de acessar índice inexistente
        try {
            System.out.println(array[5]); // Erro!
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Índice inválido!");
        }
        
        // ✅ CORRETO: Verificar antes de acessar
        int indice = 5;
        if (indice >= 0 && indice < array.length) {
            System.out.println(array[indice]);
        } else {
            System.out.println("Índice inválido!");
        }
    }
}
```

### Copiando Arrays Corretamente
```java
public class CopiaArrays {
    public static void main(String[] args) {
        int[] original = {1, 2, 3, 4, 5};
        
        // ❌ ERRO: Cópia de referência (não cria novo array)
        int[] copia1 = original;
        copia1[0] = 99; // Modifica o array original também!
        
        // ✅ CORRETO: Cópia real dos elementos
        int[] copia2 = Arrays.copyOf(original, original.length);
        int[] copia3 = original.clone();
        
        // Cópia manual
        int[] copia4 = new int[original.length];
        for (int i = 0; i < original.length; i++) {
            copia4[i] = original[i];
        }
    }
}
```

## Dicas e Melhores Práticas

1. **Arrays têm tamanho fixo** - não podem ser redimensionados
2. **Índices começam em 0** e vão até length-1
3. **Use Arrays.toString()** para imprimir arrays facilmente
4. **Prefira for-each** quando não precisar do índice
5. **Sempre verifique limites** para evitar exceções
6. **Use Collections** (ArrayList) quando precisar de tamanho dinâmico
7. **Arrays de objetos** são inicializados com null por padrão
8. **Arrays de primitivos** são inicializados com valores padrão (0, false, etc.)
