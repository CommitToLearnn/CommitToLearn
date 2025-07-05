### Pilha (Stack) - A Estrutura de Dados LIFO

**O que é uma Pilha?**

Uma **pilha** é uma estrutura de dados linear que segue o princípio **LIFO** (Last In, First Out - Último a Entrar, Primeiro a Sair). É como uma pilha de pratos: você sempre coloca e remove pratos do topo.

**Analogia:** Imagine uma pilha de livros na sua mesa. Você só pode:
- **Empilhar** (push): Colocar um livro no topo
- **Desempilhar** (pop): Remover o livro do topo
- **Espiar** (peek): Ver qual livro está no topo

### Operações Fundamentais

| Operação | Descrição | Complexidade |
|----------|-----------|--------------|
| **Push** | Adiciona elemento no topo | O(1) |
| **Pop** | Remove elemento do topo | O(1) |
| **Peek/Top** | Visualiza elemento do topo | O(1) |
| **Empty** | Verifica se está vazia | O(1) |
| **Size** | Retorna quantidade de elementos | O(1) |

### Implementação em Python

#### Implementação Simples com Lista
```python
class Pilha:
    def __init__(self):
        self.itens = []
    
    def push(self, item):
        """Adiciona item no topo da pilha"""
        self.itens.append(item)
    
    def pop(self):
        """Remove e retorna item do topo"""
        if self.vazia():
            raise IndexError("Pop de pilha vazia")
        return self.itens.pop()
    
    def peek(self):
        """Retorna item do topo sem remover"""
        if self.vazia():
            raise IndexError("Peek de pilha vazia")
        return self.itens[-1]
    
    def vazia(self):
        """Verifica se a pilha está vazia"""
        return len(self.itens) == 0
    
    def tamanho(self):
        """Retorna o tamanho da pilha"""
        return len(self.itens)
    
    def __str__(self):
        return f"Pilha: {self.itens}"

# Exemplo de uso
pilha = Pilha()
pilha.push(1)
pilha.push(2)
pilha.push(3)
print(pilha)  # Pilha: [1, 2, 3]
print(pilha.pop())  # 3
print(pilha.peek())  # 2
```

#### Implementação com Lista Ligada
```python
class No:
    def __init__(self, dados):
        self.dados = dados
        self.proximo = None

class PilhaLigada:
    def __init__(self):
        self.topo = None
        self._tamanho = 0
    
    def push(self, item):
        novo_no = No(item)
        novo_no.proximo = self.topo
        self.topo = novo_no
        self._tamanho += 1
    
    def pop(self):
        if self.vazia():
            raise IndexError("Pop de pilha vazia")
        
        item = self.topo.dados
        self.topo = self.topo.proximo
        self._tamanho -= 1
        return item
    
    def peek(self):
        if self.vazia():
            raise IndexError("Peek de pilha vazia")
        return self.topo.dados
    
    def vazia(self):
        return self.topo is None
    
    def tamanho(self):
        return self._tamanho
```

### Pilha em Diferentes Linguagens

#### JavaScript
```javascript
class Pilha {
    constructor() {
        this.itens = [];
    }
    
    push(item) {
        this.itens.push(item);
    }
    
    pop() {
        if (this.vazia()) {
            throw new Error("Pilha vazia");
        }
        return this.itens.pop();
    }
    
    peek() {
        if (this.vazia()) {
            throw new Error("Pilha vazia");
        }
        return this.itens[this.itens.length - 1];
    }
    
    vazia() {
        return this.itens.length === 0;
    }
    
    tamanho() {
        return this.itens.length;
    }
}
```

#### Go
```go
package main

import "fmt"

type Pilha struct {
    itens []int
}

func (p *Pilha) Push(item int) {
    p.itens = append(p.itens, item)
}

func (p *Pilha) Pop() (int, error) {
    if len(p.itens) == 0 {
        return 0, fmt.Errorf("pilha vazia")
    }
    
    index := len(p.itens) - 1
    item := p.itens[index]
    p.itens = p.itens[:index]
    return item, nil
}

func (p *Pilha) Peek() (int, error) {
    if len(p.itens) == 0 {
        return 0, fmt.Errorf("pilha vazia")
    }
    
    return p.itens[len(p.itens)-1], nil
}

func (p *Pilha) Vazia() bool {
    return len(p.itens) == 0
}
```

### Aplicações Práticas da Pilha

#### Verificação de Parênteses Balanceados
```python
def parenteses_balanceados(expressao):
    pilha = []
    pares = {')': '(', '}': '{', ']': '['}
    
    for char in expressao:
        if char in '({[':
            pilha.append(char)
        elif char in ')}]':
            if not pilha or pilha.pop() != pares[char]:
                return False
    
    return len(pilha) == 0

# Testes
print(parenteses_balanceados("()[]{}"))  # True
print(parenteses_balanceados("([)]"))    # False
print(parenteses_balanceados("{[()]}"))  # True
```

#### Avaliação de Expressão Pós-fixa (RPN)
```python
def avaliar_pos_fixa(expressao):
    pilha = []
    tokens = expressao.split()
    
    for token in tokens:
        if token.isdigit():
            pilha.append(int(token))
        else:
            # Operador
            b = pilha.pop()
            a = pilha.pop()
            
            if token == '+':
                pilha.append(a + b)
            elif token == '-':
                pilha.append(a - b)
            elif token == '*':
                pilha.append(a * b)
            elif token == '/':
                pilha.append(a // b)
    
    return pilha[0]

# Exemplo: "3 4 + 2 *" = (3 + 4) * 2 = 14
print(avaliar_pos_fixa("3 4 + 2 *"))  # 14
```

#### Conversão Infixa para Pós-fixa
```python
def infixa_para_pos_fixa(expressao):
    precedencia = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    pilha = []
    resultado = []
    
    for token in expressao.replace(' ', ''):
        if token.isalnum():
            resultado.append(token)
        elif token == '(':
            pilha.append(token)
        elif token == ')':
            while pilha and pilha[-1] != '(':
                resultado.append(pilha.pop())
            pilha.pop()  # Remove '('
        else:
            while (pilha and pilha[-1] != '(' and
                   pilha[-1] in precedencia and
                   precedencia[pilha[-1]] >= precedencia[token]):
                resultado.append(pilha.pop())
            pilha.append(token)
    
    while pilha:
        resultado.append(pilha.pop())
    
    return ' '.join(resultado)

# Exemplo
print(infixa_para_pos_fixa("A+B*C"))  # A B C * +
```

#### Histórico de Navegação (Undo/Redo)
```python
class HistoricoNavegacao:
    def __init__(self):
        self.historico = []
        self.posicao_atual = -1
    
    def visitar_pagina(self, url):
        # Remove páginas à frente se estivermos no meio do histórico
        self.historico = self.historico[:self.posicao_atual + 1]
        self.historico.append(url)
        self.posicao_atual += 1
    
    def voltar(self):
        if self.posicao_atual > 0:
            self.posicao_atual -= 1
            return self.historico[self.posicao_atual]
        return None
    
    def avancar(self):
        if self.posicao_atual < len(self.historico) - 1:
            self.posicao_atual += 1
            return self.historico[self.posicao_atual]
        return None
    
    def pagina_atual(self):
        if self.posicao_atual >= 0:
            return self.historico[self.posicao_atual]
        return None
```

### Pilha na Programação

#### Call Stack (Pilha de Chamadas)
```python
def funcao_a():
    print("Entrada em funcao_a")
    funcao_b()
    print("Saída de funcao_a")

def funcao_b():
    print("Entrada em funcao_b")
    funcao_c()
    print("Saída de funcao_b")

def funcao_c():
    print("Entrada em funcao_c")
    print("Saída de funcao_c")

funcao_a()
```

**Call Stack:**
```
[funcao_c] ← Topo
[funcao_b]
[funcao_a]
[main]     ← Base
```

#### Pilha e Recursão
```python
def fatorial(n):
    if n <= 1:
        return 1
    return n * fatorial(n - 1)

# fatorial(4) cria esta pilha:
# [fatorial(1)] ← Topo
# [fatorial(2)]
# [fatorial(3)]  
# [fatorial(4)]  ← Base
```

### Vantagens e Desvantagens

#### Vantagens
| Vantagem | Descrição |
|----------|-----------|
| **Simplicidade** | Operações simples e eficientes |
| **Velocidade** | Todas as operações são O(1) |
| **Controle de Fluxo** | Ideal para backtracking |
| **Gerenciamento de Memória** | Automático em linguagens modernas |

#### Desvantagens
| Desvantagem | Descrição |
|-------------|-----------|
| **Acesso Limitado** | Só acessa o topo |
| **Overflow** | Pode estourar se crescer muito |
| **Não é Pesquisável** | Não pode buscar no meio |

### Variações da Pilha

#### Pilha com Mínimo
```python
class PilhaComMinimo:
    def __init__(self):
        self.pilha_principal = []
        self.pilha_minimos = []
    
    def push(self, item):
        self.pilha_principal.append(item)
        
        if not self.pilha_minimos or item <= self.pilha_minimos[-1]:
            self.pilha_minimos.append(item)
    
    def pop(self):
        if not self.pilha_principal:
            raise IndexError("Pilha vazia")
        
        item = self.pilha_principal.pop()
        if item == self.pilha_minimos[-1]:
            self.pilha_minimos.pop()
        
        return item
    
    def get_min(self):
        if not self.pilha_minimos:
            raise IndexError("Pilha vazia")
        return self.pilha_minimos[-1]
```

#### Duas Pilhas em um Array
```python
class DuasPilhas:
    def __init__(self, tamanho):
        self.arr = [None] * tamanho
        self.topo1 = -1
        self.topo2 = tamanho
    
    def push1(self, item):
        if self.topo1 < self.topo2 - 1:
            self.topo1 += 1
            self.arr[self.topo1] = item
        else:
            raise OverflowError("Pilha cheia")
    
    def push2(self, item):
        if self.topo1 < self.topo2 - 1:
            self.topo2 -= 1
            self.arr[self.topo2] = item
        else:
            raise OverflowError("Pilha cheia")
    
    def pop1(self):
        if self.topo1 >= 0:
            item = self.arr[self.topo1]
            self.topo1 -= 1
            return item
        else:
            raise IndexError("Pilha 1 vazia")
    
    def pop2(self):
        if self.topo2 < len(self.arr):
            item = self.arr[self.topo2]
            self.topo2 += 1
            return item
        else:
            raise IndexError("Pilha 2 vazia")
```

### Exercícios Práticos

**Calculadora:** Implemente uma calculadora usando pilhas
**Tower of Hanoi:** Resolva usando pilhas
**Desfazer/Refazer:** Sistema de undo/redo para editor de texto
**Browser History:** Histórico de navegação
**Syntax Checker:** Verificador de sintaxe para código

### Quando Usar Pilhas

✅ **Use pilhas quando:**
- Precisar de acesso LIFO
- Implementar recursão iterativamente
- Fazer backtracking
- Avaliar expressões matemáticas
- Implementar undo/redo

❌ **Não use pilhas quando:**
- Precisar de acesso aleatório aos elementos
- Quiser buscar elementos específicos
- Precisar de acesso FIFO (use fila)

### Recursos Externos

📚 **Documentação e Tutoriais:**
- [Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/)
- [Stack Implementation - Python Documentation](https://docs.python.org/3/tutorial/datastructures.html)
- [Stack and Queue in Computer Science](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))

🎥 **Vídeos Recomendados:**
- [Stack Data Structure Explained](https://www.youtube.com/watch?v=F1F2imiOJfk)
- [Stack Implementation Tutorial](https://www.youtube.com/watch?v=wjI1WNcIntg)

🛠️ **Ferramentas Interativas:**
- [VisuAlgo - Stack](https://visualgo.net/en/list) - Visualização de operações em pilha
- [LeetCode](https://leetcode.com/) - Problemas práticos com pilhas

A pilha é uma das estruturas de dados mais fundamentais e úteis na programação!
