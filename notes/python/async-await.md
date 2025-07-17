# Async e Await em Python

O Python suporta programação assíncrona usando as palavras-chave `async` e `await`. Isso é útil para tarefas de I/O ou operações que podem ser realizadas em paralelo.

## Funções Assíncronas

Uma função assíncrona é definida com `async def`.

```python
import asyncio

async def minha_funcao():
    print("Início")
    await asyncio.sleep(1)
    print("Fim")

asyncio.run(minha_funcao())
```

## Trabalhando com Múltiplas Tarefas

```python
async def tarefa(nome, tempo):
    await asyncio.sleep(tempo)
    print(f"Tarefa {nome} concluída")

async def main():
    await asyncio.gather(
        tarefa("A", 2),
        tarefa("B", 1)
    )

asyncio.run(main())
```
