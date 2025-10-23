# Power Query: O Mágico que Limpa a Bagunça dos Seus Dados.

Você é o chef e acabou de receber os ingredientes para o jantar (seus arquivos de dados). Mas eles vieram sujos, misturados e em formatos diferentes.
- O alface veio com terra (linhas em branco).
- A cenoura está com casca (colunas desnecessárias).
- A carne está em um pedaço gigante (uma coluna com "Cidade - Estado - CEP" tudo junto).
- Os temperos estão em potes sem rótulo (cabeçalhos de coluna errados).

O **Power Query** é a sua **área de preparação profissional**. É aqui que, antes de cozinhar (analisar), você vai:
- Lavar o alface (filtrar linhas).
- Descascar a cenoura (remover colunas).
- Picar a carne (dividir colunas).
- Etiquetar os potes (renomear colunas e promover cabeçalhos).

O mais incrível é que o Power Query é como ter um assistente com memória fotográfica. Ele **grava cada passo** que você faz. Na próxima vez que chegarem os mesmos ingredientes bagunçados, ele repete todo o processo de limpeza automaticamente com um único clique no botão "Atualizar".

### O Conceito em Detalhes

Power Query é o motor de **ETL (Extract, Transform, Load)** do Power BI. Vamos quebrar o que isso significa:

1.  **Extract (Extrair):** É o ato de se **conectar** a uma fonte de dados. O Power Query tem conectores para centenas de fontes: arquivos Excel, CSV, pastas inteiras de arquivos, bancos de dados SQL, páginas da web, etc.
2.  **Transform (Transformar):** Esta é a alma do Power Query. É aqui que você faz a limpeza e a modelagem. Cada clique na interface gera um passo de transformação no painel "Etapas Aplicadas".
3.  **Load (Carregar):** Depois que os dados estão limpos e no formato que você quer, você clica em "Fechar e Aplicar". O Power Query então carrega o resultado final para o Modelo de Dados do Power BI, onde você poderá criar os relatórios.

**A Interface Mágica: "Etapas Aplicadas"**
À direita da tela do Power Query, há um painel chamado "Etapas Aplicadas". Ele é o seu histórico editável.
- Fez algo errado? Clique no "X" ao lado da etapa para desfazê-la.
- Quer mudar um detalhe? Clique na engrenagem ao lado da etapa para editar suas configurações.
Isso torna a limpeza de dados um processo visual e à prova de erros.

### Por Que Isso Importa?

A regra de ouro da análise de dados diz que **80% do tempo é gasto na preparação e limpeza dos dados**. O Power Query ataca exatamente esse problema.

- **Automação:** Acaba com o trabalho manual e repetitivo de limpar a mesma planilha do Excel todo mês.
- **Reprodutibilidade:** O processo de limpeza fica documentado e é 100% reprodutível. Qualquer pessoa pode abrir seu arquivo, olhar as "Etapas Aplicadas" e entender exatamente como você transformou o dado bruto no dado final.
- **Consistência:** Garante que os dados que chegam ao seu modelo estejam sempre no formato correto (datas como datas, números como números), evitando erros bizarros nos seus relatórios.
- **Poder sem Código:** Permite que você faça operações de ETL complexas, que antes exigiriam programação, através de uma interface de cliques intuitiva.

### As Transformações Mais Importantes (Seu Kit de Ferramentas Essencial)

- **Escolher/Remover Colunas:** A primeira coisa a fazer. Livre-se do que você não vai usar para deixar seu modelo mais leve.
- **Filtrar Linhas:** Remova valores nulos, em branco ou linhas que não são relevantes para a análise.
- **Alterar Tipo de Dados:** O Power BI tenta adivinhar, mas muitas vezes erra. Garanta que colunas de data sejam do tipo `Data`, colunas de valores sejam `Número Decimal`, e códigos (como CEP) sejam `Texto`.
- **Dividir Coluna:** Pegar uma coluna como "Ana Silva" e dividi-la em duas: "Nome" e "Sobrenome".
- **Mesclar Consultas (Merge):** O equivalente ao `VLOOKUP` (PROCV) do Excel ou ao `JOIN` do SQL. Permite que você traga colunas de uma tabela para outra com base em uma coluna em comum (ex: trazer o nome do produto da tabela `Produtos` para a tabela de `Vendas` usando o `ID_Produto`).
- **Anexar Consultas (Append):** O equivalente a "empilhar" tabelas. Se você tem um arquivo de vendas para cada mês (Jan.xlsx, Fev.xlsx, etc.), você pode usar o "Anexar" para juntar todos em uma única tabela gigante de "Vendas do Ano".
- **Transformar Colunas em Linhas (Unpivot Columns):** Um superpoder! Transforma uma tabela "larga" em uma tabela "alta". Essencial para corrigir planilhas mal formatadas.

### Armadilhas Comuns

- **A Armadilha do "ABC 123":** Quando você vê o ícone "ABC 123" no tipo de dado de uma coluna, significa que o Power Query não conseguiu decidir se é texto ou número. Isso é um sinal de alerta! Significa que há dados misturados (ex: texto "N/A" no meio de números), o que vai quebrar seus cálculos. Filtre os erros e defina o tipo correto.
- **Mesclagens Lentas (Merge):** Fazer *merge* de tabelas com milhões de linhas pode ser lento. Certifique-se de que você já filtrou e removeu colunas desnecessárias **antes** de fazer a mesclagem.
- **Esquecer de Renomear Etapas:** O Power Query dá nomes genéricos como "Tipo Alterado1". Renomeie suas etapas para algo descritivo (ex: "Define Tipo de Dados Iniciais" ou "Filtra Vendas de 2023"). Isso torna seu processo muito mais fácil de entender no futuro.

### Boas Práticas

- **Filtre Cedo, Filtre Sempre:** Quanto mais cedo no processo você filtrar linhas e remover colunas, mais rápido serão todas as etapas seguintes.
- **Desabilite a "Carga" para Tabelas Intermediárias:** Se você usou uma tabela apenas como um passo intermediário para fazer uma mesclagem (ex: uma tabela de "de-para"), clique com o botão direito nela e desmarque "Habilitar Carga". Isso impede que ela seja carregada no modelo final, economizando memória.
- **Organize com Grupos:** Se você tiver muitas consultas (tabelas), organize-as em grupos (pastas) para manter seu painel esquerdo limpo.
- **Documente com Comentários:** Clique com o botão direito em uma etapa e adicione uma descrição. Explique por que você fez aquela transformação específica. Seu "eu do futuro" agradecerá.

### Resumo Rápido
- **Power Query:** A ferramenta de limpeza e preparação de dados do Power BI.
- **Fluxo:** Extrair (conectar), Transformar (limpar) e Carregar (enviar para o modelo).
- **"Etapas Aplicadas":** Seu histórico de transformações gravado, editável e automático.
- **Operações Chave:** Filtrar, remover colunas, alterar tipos, mesclar (join) e anexar (empilhar).
- **Regra de Ouro:** Limpe e formate seus dados no Power Query **antes** de tentar fazer qualquer cálculo ou gráfico com eles.