# Gerenciadores de Contexto em Python

Gerenciadores de contexto são usados para gerenciar recursos, como arquivos ou conexões, garantindo que sejam corretamente inicializados e liberados.

## Usando `with`

O bloco `with` é usado para gerenciar o contexto automaticamente.

```python
with open("arquivo.txt", "r") as arquivo:
    conteudo = arquivo.read()
    print(conteudo)
# O arquivo é fechado automaticamente
```

## Criando um Gerenciador de Contexto

Podemos criar gerenciadores de contexto personalizados usando classes ou decoradores.

### Com Classes

```python
class MeuGerenciador:
    def __enter__(self):
        print("Entrando no contexto")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("Saindo do contexto")

with MeuGerenciador() as ger:
    print("Dentro do bloco with")
```

### Com Decoradores

```python
from contextlib import contextmanager

@contextmanager
def meu_contexto():
    print("Entrando no contexto")
    yield
    print("Saindo do contexto")

with meu_contexto():
    print("Dentro do bloco with")
```
