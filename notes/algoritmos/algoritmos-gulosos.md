# Algoritmos Gulosos (Greedy Algorithms)

Um algoritmo guloso é uma abordagem para resolver problemas de otimização. A ideia é tomar a decisão que parece ser a melhor no momento, sem se preocupar com as consequências futuras. Em cada passo, o algoritmo faz uma escolha localmente ótima na esperança de que essa escolha leve a uma solução globalmente ótima.

## Características

- **Escolha localmente ótima:** Em cada etapa, o algoritmo escolhe a opção que parece melhor naquele momento.
- **Não reconsidera:** Uma vez que uma escolha é feita, ela não é desfeita.
- **Simplicidade e eficiência:** Geralmente são mais simples de implementar e mais rápidos do que outras abordagens, como a programação dinâmica.

## Quando funcionam?

Algoritmos gulosos funcionam bem para problemas que possuem duas propriedades:

1.  **Subestrutura ótima:** Uma solução ótima para o problema contém soluções ótimas para subproblemas.
2.  **Propriedade da escolha gulosa:** Uma escolha localmente ótima leva a uma solução globalmente ótima.

## Exemplo Clássico: Problema do Troco

Imagine que você precisa dar troco para um determinado valor usando o menor número possível de moedas. Um algoritmo guloso para este problema seria sempre escolher a moeda de maior valor que seja menor ou igual ao valor restante.

Por exemplo, para dar um troco de R$ 0,36 com moedas de R$ 0,25, R$ 0,10, R$ 0,05 e R$ 0,01:

1.  Pega uma moeda de R$ 0,25 (restam R$ 0,11).
2.  Pega uma moeda de R$ 0,10 (resta R$ 0,01).
3.  Pega uma moeda de R$ 0,01 (resta R$ 0,00).

Neste caso, a abordagem gulosa funciona e encontra a solução ótima (3 moedas).

**Atenção:** A abordagem gulosa nem sempre garante a solução ótima para todos os conjuntos de moedas.

### Exemplo onde a estratégia gulosa falha

Agora, imagine um sistema monetário diferente, com moedas de R$ 0,01, R$ 0,07 e R$ 0,10.

Problema: Dar um troco de R$ 0,15.

**A Estratégia Gulosa:**

- Pega a maior moeda possível: R$ 0,10.
- Restante: R$ 0,05.
- Não pode usar R$ 0,10 nem R$ 0,07. Pega a de R$ 0,01.
- ...e continua pegando moedas de R$ 0,01.
- Solução Gulosa: 1x 0,10 + 5x 0,01 = 6 moedas.

**A Solução Ótima:**

- 1x 0,07 + 1x 0,07 + 1x 0,01 = 3 moedas!

Este exemplo mostra a principal característica dos algoritmos gulosos: eles são simples e rápidos, mas não garantem a melhor solução global para todos os problemas. A escolha "gulosa" de pegar a moeda de 10 centavos no início impediu de chegar à solução ótima.

## Onde são usados?

- **Algoritmo de Dijkstra:** Para encontrar o caminho mais curto em um grafo.
- **Algoritmo de Prim e Kruskal:** Para encontrar a árvore geradora mínima em um grafo.
- **Compressão de Huffman:** Para compressão de dados.
