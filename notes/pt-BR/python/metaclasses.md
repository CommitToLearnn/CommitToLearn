# Metaclasses em Python

Metaclasses são classes de classes. Elas definem como as classes se comportam e são criadas.

## Criando uma Metaclasse

```python
class MinhaMeta(type):
    def __new__(cls, name, bases, dct):
        print(f"Criando a classe {name}")
        return super().__new__(cls, name, bases, dct)

class MinhaClasse(metaclass=MinhaMeta):
    pass

# Saída: Criando a classe MinhaClasse
```

## Usos de Metaclasses

- Validação de atributos.
- Registro automático de classes.
- Modificação de comportamento de classes.

```python
class RegistroMeta(type):
    registro = []

    def __new__(cls, name, bases, dct):
        cls.registro.append(name)
        return super().__new__(cls, name, bases, dct)

class ClasseA(metaclass=RegistroMeta):
    pass

class ClasseB(metaclass=RegistroMeta):
    pass

print(RegistroMeta.registro)  # ['ClasseA', 'ClasseB']
```
