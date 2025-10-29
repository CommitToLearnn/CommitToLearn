# InfluxDB: O Banco de Dados Feito para Guardar o Histórico do Tempo.

Imagine que você precisa guardar dados.

Um banco de dados tradicional (como MySQL ou PostgreSQL) funciona como uma **Agenda de Contatos**. Ele é excelente em guardar o **estado atual** das coisas: "Qual é o telefone ATUAL do João?". Se o João troca de número, você vai lá e *ATUALIZA* o registro. Você perde o número antigo.

O **InfluxDB** funciona como um **Eletrocardiograma** ou um **Extrato Bancário**. Ele é um **Banco de Dados de Série Temporal (TSDB)**. Sua missão é *NUNCA* atualizar um dado, mas sim **registrar cada novo evento no tempo**.

  - `10:00:01` - Batimento: 60bpm
  - `10:00:02` - Batimento: 61bpm
  - `10:00:03` - Batimento: 60bpm
  - ...
  - `10:00:04` - Saldo: R$ 100,00
  - `10:00:05` - PIX: -R$ 20,00 (Saldo: R$ 80,00)
  - `10:00:06` - Saldo: R$ 80,00

Ele é otimizado para duas coisas: **ESCREVER** milhões desses pequenos registros por segundo e **LER** grandes faixas de tempo rapidamente (ex: "Me dê a média de batimentos da última hora").

### O Conceito em Detalhes

O InfluxDB não usa a terminologia de "Tabelas" e "Colunas" do SQL. Ele tem seu próprio modelo, que é a chave para entendê-lo:

  - **Bucket:**

      - **Função:** Onde seus dados são armazenados. É o equivalente mais próximo de um "Banco de Dados" ou "Database" no mundo SQL.
      - **O que faz:** Contém seus dados e as regras de quanto tempo eles devem ser guardados (a "Política de Retenção", ex: "apagar dados com mais de 30 dias").

  - **Measurement (Medição):**

      - **Função:** O nome do "evento" que você está medindo.
      - **Analogia SQL:** É como o nome de uma "Tabela".
      - **Exemplos:** `clima`, `uso_cpu`, `precos_acoes`.

  - **Tags (Etiquetas):**

      - **Função:** São os **metadados** que descrevem *onde*, *quem* ou *o quê* gerou a medição. Pense neles como o `WHERE` da sua consulta.
      - **Analogia SQL:** São como "Colunas Indexadas".
      - **Exemplos:** `local="sala"`, `sensor="dht22"`, `host="servidor_web_01"`.
      - **[IMPORTANTE]** Tags são indexadas. Elas são feitas para filtrar e agrupar, não para guardar valores que mudam sempre.

  - **Fields (Campos):**

      - **Função:** São os **valores** reais que você mediu.
      - **Analogia SQL:** São como "Colunas não-indexadas".
      - **Exemplos:** `temperatura=23.5`, `umidade=55.1`, `percentual_uso=78.9`.
      - **[IMPORTANTE]** Este é o dado que muda o tempo todo. Você não deve filtrar por um *Field* (é lento); você filtra pelas *Tags* para obter os *Fields*.

  - **Timestamp (Carimbo de Tempo):**

      - **Função:** A hora exata (em nanossegundos\!) em que a medição ocorreu. É a chave primária de tudo. Se você não enviar um, o InfluxDB adiciona o horário em que recebeu o dado.

### Por Que Isso Importa?

Bancos de dados SQL tradicionais são péssimos em lidar com cargas de trabalho de IoT e monitoramento. Eles simplesmente não foram feitos para isso.

  - **Performance de Escrita (Ingestão):** O InfluxDB foi construído para lidar com um volume massivo de escritas. Milhares de sensores reportando a cada segundo não são um problema para ele.
  - **Compressão:** Ele é muito eficiente em comprimir dados de série temporal (que tendem a ser repetitivos ou mudar pouco), economizando muito espaço em disco.
  - **Velocidade de Consulta (Query):** Fazer perguntas como `GROUP BY time(1h)` ("agrupar por hora") é extremamente rápido. Fazer isso em um banco SQL com bilhões de linhas seria um pesadelo.
  - **Ecossistema:** Ele se encaixa perfeitamente com ferramentas como **Node-RED** (para coletar os dados) e **Grafana** (para criar gráficos e dashboards).

### Exemplo Prático de Fluxo de Trabalho (Escrevendo e Lendo)

**1. A Escrita (Line Protocol):**
O InfluxDB usa um formato de texto simples chamado "Line Protocol" para escrever dados.

`[Measurement],[Tag1=Valor],[Tag2=Valor] [Field1=Valor],[Field2=Valor] [TimestampOpcional]`

**Exemplo:** Estamos medindo o clima na sala e na cozinha.
`clima,local=sala,sensor=SHT31 temperatura=22.1,umidade=51.4`
`clima,local=cozinha,sensor=BME280 temperatura=24.5,umidade=45.2,pressao=1012.1`

  - **Measurement:** `clima`
  - **Tags:** `local`, `sensor`
  - **Fields:** `temperatura`, `umidade`, `pressao`

**2. A Leitura (Consulta com Flux):**
Vamos perguntar: "Qual foi a temperatura média na sala na última hora, agrupada em intervalos de 10 minutos?"

```flux
from(bucket: "meu_bucket_iot")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "clima")
  |> filter(fn: (r) => r.local == "sala")
  |> filter(fn: (r) => r._field == "temperatura")
  |> aggregateWindow(every: 10m, fn: mean)
  |> yield(name: "media_temp_sala")
```

Isso é muito mais poderoso e otimizado para tempo do que um `SELECT` em SQL.

### Armadilhas Comuns

  - **"High Tag Cardinality" (Alta Cardinalidade de Tags):** O erro Nº 1. "Cardinalidade" é o número de valores únicos para uma Tag.
      - **Ruim:** Usar um `user_id` ou `timestamp` como uma *Tag*. Se você tem 1 milhão de usuários, você tem 1 milhão de valores únicos, o que quebra o índice do InfluxDB e destrói a performance.
      - **Bom:** Usar `local="sala"`, `regiao="sul"`. São valores que se repetem.
  - **Colocar Dados como Tags:** Colocar `temperatura="23.5"` como uma *Tag*. Errado. Temperatura é um *Field*. Tags são para *filtrar* (`local="sala"`), Fields são para *analisar* (`temperatura=23.5`).
  - **Usar como Banco SQL:** Tentar guardar dados relacionais (lista de usuários, posts de blog). Ele não foi feito para `JOIN`s ou para atualizar registros.

### Boas Práticas

  - **Planeje seu Schema:** Pense muito bem antes: O que é *Measurement*? Quais serão minhas *Tags* (para filtros)? Quais serão meus *Fields* (os valores)?
  - **Tags São Metadados:** Repetindo: Tags são o `WHERE`. Elas devem ser texto e ter baixa cardinalidade.
  - **Fields São os Dados:** Fields são os valores numéricos (ou texto, mas geralmente números) que você quer agregar (somar, tirar média, etc.).
  - **Use Políticas de Retenção (Retention Policies):** Seus dados de sensor só são úteis nos últimos 30 dias? Configure o *Bucket* para apagar dados mais antigos automaticamente. Isso economiza espaço e mantém o banco rápido.

### Resumo Rápido

  - **InfluxDB:** Um Banco de Dados de Série Temporal (TSDB), feito para dados com data e hora.
  - **Foco:** Performance extrema de **escrita** (ingestão) e consultas rápidas por **tempo**.
  - **Modelo:** `Bucket` \> `Measurement` (o quê) \> `Tags` (onde/quem, *indexados*) \> `Fields` (o valor, *não-indexados*).
  - **Armadilha Principal:** Evite "Alta Cardinalidade de Tags". Tags não podem ser valores únicos (como IDs ou e-mails).
  - **Uso Ideal:** Monitoramento de servidores, sensores de IoT, dados financeiros (histórico de ações).