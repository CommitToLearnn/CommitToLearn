# Fluxos de Processo Ágil: Scrum, XP e Kanban

O Desenvolvimento Ágil não é uma metodologia única, mas uma abordagem (ou filosofia) que valoriza a entrega incremental, a colaboração e a adaptação. Dentro dessa abordagem, existem vários frameworks e metodologias que ajudam as equipes a colocar os princípios ágeis em prática. Scrum, Extreme Programming (XP) e Kanban são três dos mais populares.

## Desenvolvimento Ágil: A Filosofia

Antes de mergulhar nos frameworks, é essencial entender os valores do Manifesto Ágil:
- **Indivíduos e interações** mais que processos e ferramentas.
- **Software em funcionamento** mais que documentação abrangente.
- **Colaboração com o cliente** mais que negociação de contratos.
- **Responder a mudanças** mais que seguir um plano.

O objetivo é entregar valor ao cliente de forma rápida e contínua, adaptando-se às mudanças ao longo do caminho.


## Scrum

Scrum é um framework de gerenciamento de projetos focado em ciclos de desenvolvimento curtos e iterativos chamados **Sprints**.

- **Estrutura:** O trabalho é organizado em um **Product Backlog**, que é uma lista priorizada de funcionalidades (User Stories). A cada Sprint (geralmente de 2 a 4 semanas), a equipe seleciona um conjunto de itens do topo do backlog para desenvolver no **Sprint Backlog**.

- **Papéis:**
    - **Product Owner (PO):** Responsável por maximizar o valor do produto. Gerencia e prioriza o Product Backlog.
    - **Scrum Master:** Um líder-servidor que garante que a equipe siga as práticas do Scrum, remove impedimentos e facilita as cerimônias.
    - **Development Team:** Um grupo auto-organizável e multifuncional que constrói o incremento do produto.

- **Cerimônias (Eventos):**
    - **Sprint Planning:** No início do Sprint, a equipe planeja o que será entregue.
    - **Daily Scrum:** Uma reunião diária curta (15 min) para sincronizar o trabalho e identificar impedimentos.
    - **Sprint Review:** Ao final do Sprint, a equipe demonstra o que foi construído para os stakeholders.
    - **Sprint Retrospective:** A equipe reflete sobre o Sprint que passou e identifica pontos de melhoria para o próximo.

- **Ideal para:** Projetos com requisitos que mudam com frequência, onde a entrega incremental de valor é importante. É ótimo para gerenciar a complexidade do trabalho.

## Extreme Programming (XP)

XP é uma metodologia de desenvolvimento de software focada na **qualidade técnica** e na **excelência da engenharia**. Ela pode ser usada em conjunto com o Scrum.

- **Valores Fundamentais:** Simplicidade, Comunicação, Feedback, Coragem e Respeito.

- **Práticas Chave:**
    - **Test-Driven Development (TDD):** Escrever testes automatizados *antes* de escrever o código da funcionalidade. O ciclo é: Red (escrever um teste que falha), Green (escrever o código mínimo para o teste passar), Refactor (melhorar o código sem alterar o comportamento).
    - **Pair Programming (Programação em Par):** Dois desenvolvedores trabalham juntos em um único computador. Um escreve o código (piloto) enquanto o outro revisa e pensa estrategicamente (co-piloto). Isso melhora a qualidade do código e dissemina o conhecimento.
    - **Continuous Integration (CI):** Integrar o trabalho de todos os desenvolvedores ao repositório principal várias vezes ao dia. Cada integração é verificada por um build automatizado (incluindo testes) para detectar problemas rapidamente.
    - **Simple Design:** Manter o design do sistema o mais simples possível, evitando complexidade desnecessária.
    - **Refactoring:** Melhorar continuamente o design do código existente sem alterar seu comportamento externo.
    - **Small Releases:** Lançar versões pequenas e frequentes para obter feedback rápido do cliente.

- **Ideal para:** Equipes que buscam alta qualidade de código, disciplina de engenharia e resposta rápida a mudanças técnicas.

## Kanban

Kanban é um método para gerenciar o fluxo de trabalho, visualizando o trabalho, limitando o trabalho em andamento (Work in Progress - WIP) e maximizando a eficiência.

- **Estrutura:** O fluxo de trabalho é visualizado em um **Kanban Board**, que contém colunas representando as etapas do processo (ex: "A Fazer", "Em Andamento", "Em Revisão", "Concluído"). As tarefas (cartões) se movem da esquerda para a direita.

- **Princípios Fundamentais:**
    1. **Visualizar o Trabalho:** Tornar todo o trabalho visível no board. Isso ajuda a identificar gargalos e a entender o fluxo.
    2. **Limitar o Trabalho em Andamento (WIP):** Cada coluna (ou o sistema como um todo) tem um limite de quantos itens pode conter. Isso evita que a equipe comece muitas tarefas ao mesmo tempo, forçando-a a *terminar* o trabalho antes de começar algo novo. É o princípio mais importante do Kanban.
    3. **Gerenciar o Fluxo:** Medir e otimizar o fluxo de trabalho. Métricas como **Lead Time** (tempo total desde o pedido até a entrega) e **Cycle Time** (tempo gasto trabalhando ativamente em uma tarefa) são cruciais.
    4. **Tornar as Políticas do Processo Explícitas:** Todos devem entender as regras do board (ex: o que significa "Concluído"? Qual o limite de WIP?).
    5. **Melhorar Colaborativamente:** Usar modelos e o método científico para evoluir o processo continuamente.

- **Diferenças do Scrum:**
    - **Cadência:** Kanban é baseado em fluxo contínuo, não em iterações de tempo fixo (Sprints).
    - **Papéis:** Não prescreve papéis como Scrum Master ou Product Owner.
    - **Métricas:** Focado em métricas de fluxo (Lead Time, Cycle Time), enquanto Scrum foca na velocidade (Velocity).

- **Ideal para:** Equipes de manutenção, suporte (help desk) ou qualquer trabalho onde as prioridades mudam rapidamente e o fluxo de entrega precisa ser contínuo e previsível.

## Tabela Comparativa

| Característica | Scrum | Extreme Programming (XP) | Kanban |
| :--- | :--- | :--- | :--- |
| **Foco Principal** | Gerenciamento de projetos complexos | Excelência de engenharia e qualidade | Otimização do fluxo de trabalho |
| **Cadência** | Iterativa (Sprints de tempo fixo) | Iterativa (lançamentos pequenos) | Contínua (baseada em fluxo) |
| **Papéis** | Product Owner, Scrum Master, Dev Team | Cliente, Coach, Desenvolvedores | Não prescritivo |
| **Métricas Chave** | Velocity (Velocidade) | Feedback do cliente, qualidade do código | Lead Time, Cycle Time, Throughput |
| **Mudanças** | Mudanças são desencorajadas durante um Sprint | Mudanças são bem-vindas a qualquer momento | Mudanças são bem-vindas a qualquer momento |
| **Principal Artefato** | Product Backlog, Sprint Backlog | Código e testes automatizados | Kanban Board |
