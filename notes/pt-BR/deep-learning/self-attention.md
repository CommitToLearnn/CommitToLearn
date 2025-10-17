# Self-Attention: A Reunião de Brainstorming das Palavras

Imagine que cada palavra em uma frase é um membro de uma equipe em uma reunião de brainstorming. Para que a palavra "ela" na frase "Ela comeu a maçã porque estava com fome" entenda seu próprio papel, ela precisa saber com quem está se relacionando.

O mecanismo de **Self-Attention** (Autoatenção) permite que "ela" faça três perguntas a cada outra palavra na sala (incluindo a si mesma):

1.  **Query (Consulta):** "Eu sou um pronome. O que estou procurando?" (No caso, um verbo ou um sujeito).
2.  **Key (Chave):** Cada outra palavra responde com sua "etiqueta". "Maçã" diz: "Eu sou um substantivo, o objeto da ação". "Comeu" diz: "Eu sou um verbo, a ação".
3.  **Value (Valor):** Com base na relevância (a combinação Query-Key), "ela" decide quanta "atenção" dar a cada palavra e pega um pouco do "significado" (Valor) de cada uma.

No final, a palavra "ela" cria uma nova representação de si mesma que é uma mistura ponderada de todas as outras palavras, entendendo que sua conexão mais forte é com "comeu" (a ação que ela pratica) e "fome" (a razão da ação).

### O que é e por que usar?

**Self-Attention** é o mecanismo que permite a um modelo de linguagem, como o Transformer, pesar a importância de diferentes palavras em uma sequência ao processar cada uma delas. Em vez de processar a frase palavra por palavra em ordem (como nas RNNs), a autoatenção permite que cada palavra "olhe" para todas as outras palavras na frase simultaneamente.

A representação de cada palavra é atualizada com base em uma soma ponderada de todas as outras palavras. Os pesos são calculados dinamicamente com base na compatibilidade entre a palavra atual (Query) e as outras (Keys).

**Por que isso é um divisor de águas?**
-   **Paralelismo Total:** Como cada palavra é processada em relação a todas as outras de uma só vez, o cálculo pode ser massivamente paralelizado em GPUs, tornando o treinamento muito mais rápido que o das RNNs sequenciais.
-   **Dependências de Longo Alcance:** Resolve um problema crônico das RNNs. Uma palavra no final de um parágrafo pode se conectar diretamente a uma palavra no início, sem que a informação se perca no caminho.
-   **Contexto Rico:** Cria representações de palavras que são profundamente contextuais, pois são literalmente construídas a partir das outras palavras na sequência.

### Exemplos Práticos

Vamos ver a mágica acontecer com a famosa fórmula: `Attention(Q, K, V) = softmax( (Q @ K.T) / sqrt(d_k) ) @ V`.

```python
import torch
import torch.nn.functional as F
import math

# Frase de entrada com 3 tokens.
# Cada token tem um embedding de dimensão 4.
seq_len = 3
d_model = 4
x = torch.randn(seq_len, d_model) # Shape: [3, 4]

# Matrizes de peso para gerar Q, K, V (normalmente aprendidas)
W_q = torch.randn(d_model, d_model)
W_k = torch.randn(d_model, d_model)
W_v = torch.randn(d_model, d_model)

# 1. Gerar Queries, Keys e Values a partir dos embeddings de entrada
Q = x @ W_q
K = x @ W_k
V = x @ W_v
print(f"Shape de Q, K, V: {Q.shape}")

# 2. Calcular os Scores de Atenção (a compatibilidade entre Q e K)
# (Q @ K.T) -> [3, 4] @ [4, 3] = [3, 3]
d_k = K.shape[-1]
scores = (Q @ K.transpose(0, 1)) / math.sqrt(d_k)
print("\nMatriz de Scores (antes do softmax):\n", scores.detach().round(2))
# scores[i, j] é a atenção que o token i presta ao token j.

# 3. Aplicar Softmax para obter os Pesos de Atenção
# As linhas da matriz agora somam 1.
attention_weights = F.softmax(scores, dim=-1)
print("\nMatriz de Pesos de Atenção (depois do softmax):\n", attention_weights.detach().round(2))

# 4. Calcular a Saída (os novos embeddings contextuais)
# (weights @ V) -> [3, 3] @ [3, 4] = [3, 4]
output = attention_weights @ V
print("\nShape da Saída (novos embeddings):", output.shape)
print("Vetor de entrada do primeiro token:\n", x[0].detach().round(2))
print("Vetor de saída do primeiro token (contextualizado):\n", output[0].detach().round(2))
```
O `output` contém os novos embeddings para cada token, onde cada um é uma mistura dos `Values` de todos os tokens, ponderada pelos `attention_weights`.

### Armadilhas Comuns

1.  **Complexidade Quadrática (O(n²)):** A maior limitação. A matriz de atenção cresce com o quadrado do comprimento da sequência (`seq_len * seq_len`). Processar um livro inteiro de uma vez é computacionalmente inviável. É por isso que textos longos são divididos em "janelas" ou "blocos".
2.  **Não Entende a Posição:** A autoatenção, por si só, não tem noção da ordem das palavras. Para ela, "o gato persegue o rato" e "o rato persegue o gato" são iguais. Isso é resolvido adicionando "Positional Encodings" aos embeddings de entrada.
3.  **Interpretação Excessiva:** Embora os mapas de calor de atenção sejam ótimos para a intuição, eles não são uma explicação completa de "por que" o modelo tomou uma decisão. Eles mostram correlações, mas não necessariamente causalidade.

### Boas Práticas

-   **Use Multi-Head Attention:** Em vez de fazer a atenção uma vez só, os Transformers a fazem várias vezes em paralelo (com diferentes matrizes W_q, W_k, W_v). Cada "cabeça" de atenção pode aprender a focar em diferentes tipos de relações (ex: uma cabeça para relações sintáticas, outra para semânticas). A saída de todas as cabeças é então combinada.
-   **Adicione Positional Encodings:** É uma etapa **obrigatória**. Sem isso, o modelo perde toda a informação sobre a ordem das palavras.
-   **Use Otimizações para Sequências Longas:** Se você precisa lidar com textos muito longos, explore variantes como **Flash Attention**, que otimiza o uso da memória da GPU sem alterar a matemática, ou modelos como Longformer e Performer, que usam padrões de atenção esparsos para reduzir a complexidade de O(n²) para algo próximo de O(n).
-   **Aplique Máscaras Corretamente:**
    *   **Padding Mask:** Para ignorar os tokens de `[PAD]` no cálculo da atenção.
    *   **Causal Mask:** Em tarefas de geração de texto (como no GPT), use uma máscara para impedir que uma palavra "veja" as palavras futuras.

### Resumo Rápido

| Conceito | Descrição | Analogia |
| :--- | :--- | :--- |
| **Self-Attention** | Mecanismo onde cada token de uma sequência calcula sua relação com todos os outros. | Cada membro da equipe avalia a relevância das ideias dos outros. |
| **Query, Key, Value** | Três vetores gerados para cada token, usados para calcular e aplicar a atenção. | O que você procura (Q), o que os outros oferecem (K), e a informação que eles contêm (V). |
| **Multi-Head Attention**| Realizar a autoatenção várias vezes em paralelo, cada uma focando em um aspecto diferente. | Ter vários "subgrupos" de brainstorming focados em tópicos diferentes. |
| **Causal Attention** | Uma forma mascarada de autoatenção que impede um token de ver tokens futuros. | Em uma previsão, você só pode usar informações do passado e presente. |
| **Complexidade O(n²)** | O custo computacional e de memória cresce quadraticamente com o comprimento da sequência. | O número de conversas individuais em uma sala cresce muito rápido com mais pessoas. |
