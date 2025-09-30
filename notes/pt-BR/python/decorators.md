# Decoradores em Python

Decoradores são funções que modificam o comportamento de outras funções ou métodos. Eles são amplamente usados para adicionar funcionalidades de forma elegante e reutilizável.

## Criando um Decorador

Um decorador é uma função que recebe outra função como argumento e retorna uma nova função.

```python
def meu_decorador(func):
    def wrapper():
        print("Antes da função")
        func()
        print("Depois da função")
    return wrapper

@meu_decorador
def minha_funcao():
    print("Função executada")

minha_funcao()
```

## Decoradores com Argumentos

Podemos criar decoradores que aceitam argumentos.

```python
def decorador_com_args(arg):
    def decorador(func):
        def wrapper():
            print(f"Argumento do decorador: {arg}")
            func()
        return wrapper
    return decorador

@decorador_com_args("Teste")
def outra_funcao():
    print("Outra função executada")

outra_funcao()
```
