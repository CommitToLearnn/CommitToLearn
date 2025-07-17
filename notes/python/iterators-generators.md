# Iteradores e Geradores em Python

Iteradores e geradores são usados para iterar sobre coleções de dados de forma eficiente.

## Iteradores

Um iterador é um objeto que implementa os métodos `__iter__()` e `__next__()`.

```python
class MeuIterador:
    def __init__(self, max):
        self.max = max
        self.atual = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.atual < self.max:
            self.atual += 1
            return self.atual
        raise StopIteration

for i in MeuIterador(5):
    print(i)
```

## Geradores

Geradores são uma forma simplificada de criar iteradores usando a palavra-chave `yield`.

```python
def meu_gerador():
    for i in range(5):
        yield i

for i in meu_gerador():
    print(i)
```
