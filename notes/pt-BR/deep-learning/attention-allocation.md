# Alocação de Atenção em Transformers

Imagine que você é um detetive lendo um relatório de um caso complexo. Você tem uma capacidade limitada de "atenção" e precisa decidir onde focar.

-   **Alocação por Token:** Você decide quais palavras são mais importantes. "Faca", "sangue" e "suspeito" recebem mais atenção do que "o", "um", "de".
-   **Alocação por Camada (Layer):** No início da leitura (camadas iniciais), você foca na estrutura das frases e na gramática para entender o básico. No meio (camadas intermediárias), você começa a conectar fatos e entender o significado. No final (camadas finais), você foca nos detalhes cruciais para resolver o caso.
-   **Alocação por Cabeça (Head):** Você tem uma equipe de assistentes (cabeças de atenção), cada um com uma especialidade. Um assistente é ótimo em encontrar relações temporais ("antes", "depois"). Outro é especialista em identificar pessoas e lugares. Outro foca em contradições. Juntos, eles cobrem todos os ângulos.

A **Alocação de Atenção** é o mecanismo que os modelos Transformer usam para distribuir seus "recursos cognitivos" de forma eficiente, decidindo quais partes da informação são mais relevantes para construir uma compreensão profunda do texto.

### O que é e por que usar?

A Alocação de Atenção descreve como um modelo Transformer distribui a importância (os pesos de atenção) entre os diferentes tokens de uma sequência. Em vez de tratar todas as palavras igualmente, o modelo aprende a "prestar mais atenção" a certas palavras com base no contexto. Esse processo é dinâmico e acontece em diferentes níveis: entre tokens, através das camadas e entre as múltiplas "cabeças" de atenção.

**Principais Benefícios:**

-   **Eficiência Computacional:** O modelo foca seus recursos limitados nas partes mais informativas da entrada.
-   **Compreensão Contextual:** Permite que o modelo entenda como as palavras se relacionam, mesmo que estejam distantes na frase.
-   **Especialização:** Diferentes partes do modelo (camadas e cabeças) podem se especializar em capturar diferentes tipos de padrões (sintáticos, semânticos, etc.).
-   **Interpretabilidade:** Analisar como a atenção é alocada nos dá pistas sobre o "raciocínio" do modelo.

### Padrões de Alocação

#### Alocação em Nível de Token

Os modelos aprendem a priorizar certos tipos de tokens:

-   **Tokens de Conteúdo vs. Funcionais:** Substantivos e verbos (conteúdo) geralmente recebem mais atenção do que artigos e preposições (funcionais).
-   **Tokens Especiais:** Tokens como `[CLS]` e `[SEP]` em modelos como o BERT, ou a pontuação, frequentemente atuam como "agregadores" de informação, recebendo muita atenção de outros tokens.
-   **Viés Posicional:** Muitas vezes, os primeiros e os últimos tokens de uma sequência recebem atenção desproporcional.

#### Alocação ao Longo das Camadas (Layer-wise)

A função da atenção muda à medida que a informação passa pelas camadas do Transformer:

-   **Camadas Iniciais (Early Layers):** A atenção tende a ser mais local e focada em padrões sintáticos. As cabeças de atenção podem se especializar em detectar relações entre palavras adjacentes ou em seguir regras gramaticais básicas.
-   **Camadas Intermediárias (Middle Layers):** A atenção se expande para capturar relações semânticas mais complexas e dependências de longo alcance.
-   **Camadas Finais (High Layers):** A atenção torna-se altamente especializada para a tarefa final (ex: classificação, resposta a perguntas), focando nos tokens mais relevantes para a tomada de decisão.

#### Especialização das Cabeças (Head-wise)

O mecanismo de "Multi-Head Attention" permite que o modelo analise a sequência a partir de diferentes "perspectivas" simultaneamente. Padrões comuns de especialização das cabeças incluem:

-   **Cabeças Posicionais:** Focam em tokens vizinhos (atenção local).
-   **Cabeças Sintáticas:** Focam em relações de dependência gramatical (ex: sujeito-verbo).
-   **Cabeças de "Saco de Palavras" (Bag-of-Words):** Distribuem a atenção de forma ampla, capturando um sinal geral da sentença.
-   **Cabeças de Co-referência:** Conectam pronomes às entidades a que se referem.

### Exemplos Práticos

Considere a frase: "**O gato perseguiu o rato porque estava com fome.**"

-   **Token-level:** Ao processar "estava", o modelo provavelmente alocará alta atenção a "gato" e "rato" para desambiguar a quem "estava com fome" se refere.
-   **Layer-wise:**
    -   Uma camada inicial pode focar na relação "perseguiu o".
    -   Uma camada final, ao processar "fome", pode alocar forte atenção a "gato", inferindo a causa da perseguição.
-   **Head-wise:**
    -   Uma cabeça pode conectar "gato" a "perseguiu" (relação sujeito-verbo).
    -   Outra cabeça pode conectar "estava" a "gato" (resolução de co-referência).
    -   Uma terceira cabeça pode focar na palavra "porque", identificando uma relação causal.

### Problemas de Má Alocação

1.  **Colapso da Atenção (Attention Collapse):** Ocorre quando uma ou mais cabeças de atenção focam quase toda a sua importância em um único token (muitas vezes um token especial como `[CLS]` ou `[SEP]`), ignorando o resto do contexto. Isso leva a representações pobres.
2.  **Atenção Uniforme:** O oposto do colapso. A atenção é distribuída de forma quase igual entre todos os tokens, o que significa que o modelo não está discriminando informações importantes. Isso geralmente acontece nas camadas iniciais antes do aprendizado.
3.  **Super-atenção a Tokens Funcionais:** Alocar recursos demais a palavras como "o", "a", "de" é ineficiente. Modelos bem treinados aprendem a dar mais peso a tokens de conteúdo.

### Boas Práticas e Otimizações

-   **Regularização da Atenção:** Técnicas que incentivam a diversidade entre as cabeças de atenção ou que penalizam distribuições muito pontiagudas (baixa entropia) podem melhorar a qualidade da alocação.
-   **Atenção Esparsa (Sparse Attention):** Em vez de permitir que cada token atenda a todos os outros (complexidade O(n²)), modelos mais recentes usam aproximações onde cada token só atende a um subconjunto de tokens relevantes, melhorando a eficiência para sequências longas.
-   **Análise e Visualização:** Ferramentas como o `bertviz` permitem visualizar os padrões de atenção, ajudando a diagnosticar problemas de má alocação e a interpretar o comportamento do modelo.

### Resumo Rápido

| Nível de Alocação | O que acontece? | Exemplo |
| :--- | :--- | :--- |
| **Por Token** | O modelo decide quais palavras são mais importantes no contexto. | Em "gato bebe leite", "gato" e "leite" recebem mais atenção. |
| **Por Camada** | A natureza da atenção evolui de sintática (local) para semântica (global). | Camadas iniciais focam na gramática; camadas finais focam no significado. |
| **Por Cabeça** | Diferentes "perspectivas" analisam a frase em paralelo. | Uma cabeça foca em posições, outra em verbos, outra em substantivos. |
