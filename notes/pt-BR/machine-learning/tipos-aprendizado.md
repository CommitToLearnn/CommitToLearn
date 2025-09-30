# Notas sobre Tipos de Aprendizado em Machine Learning


## Supervisionado ou Não Supervisionado

### Aprendizado Supervisionado
O aprendizado supervisionado utiliza um conjunto de dados rotulado, onde cada exemplo de entrada está associado a uma saída desejada (rótulo). O objetivo é aprender uma função que, dada uma nova entrada, consiga prever corretamente a saída.

**Principais tipos de problemas:**
- Classificação: prever categorias discretas (ex: spam ou não spam).
- Regressão: prever valores contínuos (ex: preço de uma casa).

**Algoritmos comuns:**
- Regressão Linear e Regressão Logística
- Máquinas de Vetores de Suporte (SVM)
- Árvores de Decisão e Florestas Aleatórias
- Redes Neurais

**Exemplo prático:**
Prever se um e-mail é spam ou não, usando um conjunto de e-mails já classificados.

**Sugestão de diagrama:**
```
Entrada (características) -> Modelo treinado -> Saída (rótulo)
```

Vantagens:
- Resultados geralmente mais precisos quando há muitos dados rotulados.
- Fácil de avaliar a performance (métricas claras).
Desvantagens:
- Requer grande quantidade de dados rotulados, o que pode ser caro ou demorado.


### Aprendizado Não Supervisionado
Neste caso, o modelo recebe apenas dados de entrada, sem rótulos. O objetivo é encontrar padrões, estruturas ou agrupamentos nos dados.

**Principais tarefas:**
- Clustering (agrupamento): separar dados em grupos similares (ex: segmentação de clientes).
- Redução de dimensionalidade: simplificar os dados mantendo suas características principais (ex: PCA).

**Algoritmos comuns:**
- K-means
- DBSCAN
- Algoritmo de Agrupamento Hierárquico
- PCA (Análise de Componentes Principais)

**Exemplo prático:**
Segmentar clientes de um e-commerce em grupos de comportamento semelhante sem saber previamente quem são.

**Sugestão de diagrama:**
```
Entrada (dados) -> Algoritmo de agrupamento -> Grupos identificados
```

Vantagens:
- Útil quando não há rótulos disponíveis.
- Pode revelar estruturas ocultas nos dados.
Desvantagens:
- Difícil avaliar a qualidade dos resultados.
- Resultados podem ser subjetivos.


## Semissupervisionado
O aprendizado semissupervisionado é uma abordagem intermediária, onde o modelo é treinado com uma pequena quantidade de dados rotulados e uma grande quantidade de dados não rotulados. Técnicas comuns incluem auto-treinamento, co-training e propagação de rótulos.

**Algoritmos comuns:**
- Self-training
- Co-training
- Graph-based label propagation

**Exemplo prático:**
Reconhecimento de imagens onde apenas algumas imagens possuem rótulo, mas há um grande volume de imagens não rotuladas.

**Sugestão de diagrama:**
```
Poucos dados rotulados + Muitos dados não rotulados -> Algoritmo semissupervisionado -> Modelo
```

Vantagens:
- Reduz o custo de rotulação de dados.
- Pode melhorar a generalização do modelo.
Desvantagens:
- Resultados dependem da qualidade dos poucos dados rotulados.
- Técnicas podem ser sensíveis a ruídos nos dados.


## Aprendizado por Reforço
No aprendizado por reforço, um agente interage com um ambiente, tomando decisões sequenciais. A cada ação, o agente recebe uma recompensa (positiva ou negativa) e ajusta sua estratégia para maximizar a soma das recompensas ao longo do tempo. O processo envolve exploração (testar novas ações) e exploração (usar o que já aprendeu).

**Algoritmos comuns:**
- Q-Learning
- Deep Q-Networks (DQN)
- SARSA
- Policy Gradients

**Exemplo prático:**
Um robô aprendendo a andar em um ambiente desconhecido, recebendo recompensas por cada passo correto e penalidades por quedas.

**Sugestão de diagrama:**
```
Agente -> Ação -> Ambiente -> Recompensa/Estado -> Agente (ciclo)
```

Exemplos:
- Jogos (xadrez, Go, videogames)
- Robótica (controle de braços robóticos)
- Otimização de sistemas (recomendação, logística)
Vantagens:
- Capaz de aprender estratégias complexas sem supervisão direta.
- Adapta-se a ambientes dinâmicos.
Desvantagens:
- Pode exigir muito tempo de treinamento.
- Definir recompensas adequadas pode ser desafiador.

## Aprendizado Online vs Aprendizado por Lotes

### Aprendizado por Lotes (Batch Learning)
O modelo é treinado usando todo o conjunto de dados de uma só vez. Após o treinamento, o modelo é fixo até que um novo treinamento seja realizado com dados atualizados.

**Exemplo prático:**
Treinar um modelo de recomendação de filmes usando todo o histórico de avaliações de usuários de uma só vez.

**Sugestão de diagrama:**
```
Todos os dados -> Treinamento -> Modelo pronto
```

Vantagens:
- Permite otimizações globais.
- Resultados estáveis.
Desvantagens:
- Não se adapta rapidamente a novos dados.
- Pode ser inviável para grandes volumes de dados.


### Aprendizado Online
O modelo é atualizado continuamente à medida que novos dados chegam, processando um exemplo por vez ou pequenos lotes. Muito usado em sistemas que recebem dados em tempo real (ex: detecção de fraudes, recomendações).

**Exemplo prático:**
Detectar transações fraudulentas em tempo real, atualizando o modelo a cada nova transação.

**Sugestão de diagrama:**
```
Novo dado -> Atualização do modelo -> Previsão -> Novo dado...
```

Vantagens:
- Adapta-se rapidamente a mudanças nos dados.
- Requer menos memória.
Desvantagens:
- Pode ser menos estável (suscetível a ruídos).
- Ajuste de parâmetros pode ser mais delicado.

## Aprendizado Baseado em Instâncias vs Aprendizado Baseado em Modelo

### Aprendizado Baseado em Instâncias
O modelo memoriza os exemplos de treinamento e, para prever uma nova entrada, compara-a com os exemplos armazenados, usando alguma métrica de similaridade (ex: distância euclidiana). Exemplo clássico: k-vizinhos mais próximos (k-NN).

**Algoritmos comuns:**
- k-Nearest Neighbors (k-NN)
- Algoritmos de memória baseada em casos (Case-Based Reasoning)

**Exemplo prático:**
Classificar uma nova flor como de uma espécie conhecida, comparando suas medidas com as de flores já catalogadas (ex: dataset Iris).

**Sugestão de diagrama:**
```
Nova entrada -> Comparação com exemplos -> Previsão baseada na maioria
```

Vantagens:
- Simples de implementar.
- Não requer treinamento explícito.
Desvantagens:
- Lento para grandes volumes de dados (precisa comparar com todos os exemplos).
- Sensível a ruídos e irrelevâncias nos dados.


### Aprendizado Baseado em Modelo
O modelo constrói uma representação abstrata dos dados durante o treinamento (ex: coeficientes de uma regressão, pesos de uma rede neural). Após treinado, faz previsões rapidamente sem consultar os exemplos originais.

**Algoritmos comuns:**
- Regressão Linear
- Redes Neurais
- Máquinas de Vetores de Suporte (SVM)

**Exemplo prático:**
Prever o valor de um imóvel a partir de suas características (tamanho, localização, etc) usando uma regressão linear treinada previamente.

**Sugestão de diagrama:**
```
Entrada -> Modelo treinado -> Previsão
```

Vantagens:
- Previsões rápidas após o treinamento.
- Pode generalizar melhor para novos dados.
Desvantagens:
- Pode exigir mais tempo de treinamento.
- Risco de overfitting se o modelo for muito complexo.
