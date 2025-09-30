# Type Hints em Python

Type hints são anotações que indicam os tipos de variáveis, parâmetros e retornos de funções. Elas foram introduzidas no Python 3.5.

## Sintaxe Básica

```python
def soma(a: int, b: int) -> int:
    return a + b

x: str = "Olá"
```

## Usando `typing`

O módulo `typing` fornece tipos avançados.

```python
from typing import List, Dict

def processa_lista(lista: List[int]) -> Dict[str, int]:
    return {"soma": sum(lista)}

print(processa_lista([1, 2, 3]))
```
