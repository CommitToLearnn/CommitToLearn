# Gráficos de Composição: Como a Pizza e a Cascata Explicam o Todo.

Imagine que você tem um bolo (que representa o **total** de alguma métrica, como receita anual). Você precisa mostrar de onde veio esse total.

- Se você fatia o bolo em pedaços (Fatia A, Fatia B), você usa um **Gráfico de Pizza** (Pie Chart) para mostrar a composição em um momento fixo.
- Se você mostra como o bolo foi **construído** (Adicionar receita, Subtrair custos, Chegar ao Lucro), você usa um **Gráfico de Cascata** (Waterfall) para mostrar a composição sequencial.
- Se você mostra como a composição do bolo **mudou a cada mês** (as fatias ficaram maiores ou menores com o tempo), você usa um **Gráfico Empilhado** (Stacked).

Gráficos de composição são feitos para responder: **"Quais partes contribuem para o meu total?"**

### O Conceito em Detalhes

Dividimos os gráficos de composição em dois tipos principais:

**A. Composição Estática (Um momento no tempo)**

- **Gráfico de Pizza (Pie Chart):**
    - **Uso:** Mostrar proporções simples de um todo que soma 100%.
    - **Força:** Visualmente intuitivo para mostrar a categoria dominante.
    - **Fraqueza:** Ruim para comparar fatias de tamanho similar (qual é 23% e qual é 25%?).

- **Gráfico de Cascata (Waterfall Chart):**
    - **Uso:** Mostrar o efeito cumulativo de adições e subtrações que levam a um total final (ex: fluxo de caixa, orçamento, evolução de saldo).
    - **Força:** Ótimo para contar histórias sequenciais de causa e efeito (começou com X, aumentou Y, diminuiu Z, terminou com W).

**B. Composição Dinâmica (Ao longo do tempo)**

- **Gráfico de Colunas/Área Empilhada (Stacked Column/Area):**
    - **Uso:** Mostrar a composição de categorias *e* a mudança no total ao longo do tempo.
    - **Força (Absoluta):** Mostra o crescimento ou queda do total (altura da coluna) E a contribuição de cada parte.
- **Gráfico Empilhado 100% (100% Stacked Chart):**
    - **Uso:** Foca **apenas** nas proporções relativas, normalizando cada ponto temporal para 100%.
    - **Fraqueza:** O tamanho absoluto do total é perdido.

### Por Que Isso Importa?

Seja em finanças, marketing ou operações, você precisa saber onde o recurso está sendo gasto ou de onde a receita está vindo.

- **Finanças:** Usar um Waterfall para explicar a variação de Lucro entre o trimestre passado e o atual.
- **Vendas:** Usar um Stacked Column para mostrar a composição de vendas por região ao longo dos anos (e se a Região A está perdendo participação relativa).
- **Marketing:** Usar um Pie Chart simples para mostrar a participação de cada canal no tráfego total.

### Exemplos Práticos

**Cenário 1: Composição de lucro sequencial (Gráfico de Cascata)**

O Waterfall mostra como chegamos de 100 (Receita) a 50 (Lucro Líquido) através de perdas e ganhos intermediários.

```python
import plotly.graph_objects as go
# A sintaxe aqui é complexa, mas a ideia é fácil: definir mudanças sequenciais
fig = go.Figure(go.Waterfall(
    # ... dados de Receita, Custos, Despesas, etc.
    y=[100, -20, -30, None], # Receita (100), Custos (-20), Despesas (-30), Lucro (None=Total)
    x=["Receita", "Custos", "Despesas", "Lucro Líquido"],
))
fig.update_layout(title="Análise de Lucro (Waterfall)")
fig.show()
```

**Cenário 2: Composição de vendas ao longo do tempo (Stacked Column)**

```python
import pandas as pd
import matplotlib.pyplot as plt

dados = pd.DataFrame({
    'Ano': [2020, 2021, 2022],
    'Produto A': [10, 15, 20],
    'Produto B': [20, 25, 30] 
})

# O parâmetro stacked=True faz a mágica de empilhar
dados.set_index('Ano').plot(kind='bar', stacked=True)
plt.title('Vendas por Produto (Stacked Column)')
plt.ylabel('Vendas (Unidades)')
plt.show()
```

### Armadilhas Comuns

- **Pie Charts Demais:** Nunca use um Pie Chart se você tiver mais de 5 categorias ou se quiser que o leitor compare o tamanho exato das fatias. Use um **Gráfico de Barras** para isso, pois é muito mais fácil comparar alturas do que ângulos.
- **Confundir Stacked Absoluto com 100% Stacked:** Se o total da sua métrica está crescendo (ex: vendas totais), use o Stacked Absoluto. Se o total não importa e você quer apenas saber a **participação relativa** da Categoria A, use o 100% Stacked.
- **Ordem Caótica em Stacked Charts:** Mantenha as categorias empilhadas na mesma ordem em todas as colunas. Se você mudar a ordem, o leitor não conseguirá rastrear a evolução daquela categoria.

### Boas Práticas

1.  **Agrupar Pequenas Fatias:** Em Pie Charts, se tiver muitas categorias pequenas (ex: 2%, 1%, 3%), agrupe-as em uma única fatia chamada "Outros" para focar nas categorias relevantes.
2.  **Ordenar Categoria Dominante:** Para Pie Charts, comece a primeira fatia no topo (12h) e ordene as demais em sentido horário ou anti-horário, do maior para o menor.
3.  **Labels e Números:** Inclua valores absolutos e percentuais nos labels do Pie Chart para evitar que o leitor tenha que estimar o ângulo da fatia.
4.  **Use Stacked Area Chart:** Para séries temporais com muitos pontos (mais de 10), o Stacked Area Chart é mais fluido que a Coluna Empilhada.

### Resumo Rápido
- **Pie:** Composição estática, poucas categorias (< 5).
- **Waterfall:** Fluxo sequencial (adição/subtração).
- **Stacked Column/Area:** Composição ao longo do tempo.
- **Absoluto vs 100%:** Absoluto mostra magnitude do total; 100% foca em participação relativa.
- **Regra de Ouro:** Evite Pie Charts complexos; barras são melhores para precisão.