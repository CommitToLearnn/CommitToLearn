# Dataclasses em Python

As dataclasses foram introduzidas no Python 3.7 para simplificar a criação de classes que armazenam dados.

## Criando uma Dataclass

Use o decorador `@dataclass` para criar uma dataclass.

```python
from dataclasses import dataclass

@dataclass
class Pessoa:
    nome: str
    idade: int

p = Pessoa(nome="João", idade=30)
print(p)
```

## Recursos Adicionais

- Valores padrão:

```python
@dataclass
class Pessoa:
    nome: str
    idade: int = 18
```

- Métodos gerados automaticamente:

```python
from dataclasses import field

@dataclass
class Pessoa:
    nome: str
    idade: int
    ativo: bool = field(default=True)

p = Pessoa("Ana", 25)
print(p)
```
