
# Dados Estruturados, Semi-Estruturados e Não Estruturados

## Dados Estruturados
São dados organizados em formatos rígidos, com campos e esquemas bem definidos. Facilitam consultas, análises e integração com sistemas tradicionais.

### Características:
- Armazenados em tabelas, bancos de dados relacionais
- Alta consistência e qualidade
- Fáceis de consultar (SQL, planilhas)

### Exemplos:
- Tabela de clientes (id, nome, email, telefone)
- Registros de vendas (data, produto, quantidade, valor)
- Planilhas financeiras
- Arquivos CSV

### Aplicações:
- Sistemas de gestão empresarial (ERP)
- Controle financeiro
- Relatórios gerenciais

## Dados Semi-Estruturados
Possuem alguma organização, como tags ou marcadores, mas não seguem um esquema rígido. São flexíveis e facilitam integração entre diferentes sistemas.

### Características:
- Estrutura flexível, mas com organização
- Usam formatos como JSON, XML, HTML, logs
- Permitem armazenar dados variados

### Exemplos:
- JSON de produtos:
	{
		"produto": "Smartphone",
		"preco": 1500,
		"caracteristicas": ["tela 6.5", "128GB", "5G"]
	}
- XML de configurações
- Logs de servidor
- Dados de sensores

### Aplicações:
- APIs web
- Integração de sistemas
- Armazenamento de dados flexíveis

## Dados Não Estruturados
Não seguem formato definido, sendo compostos por informações livres e variadas. Representam a maior parte dos dados digitais atuais.

### Características:
- Difíceis de organizar e analisar
- Ricos em informação implícita
- Requerem técnicas avançadas de processamento

### Exemplos:
- Textos livres (e-mails, documentos)
- Imagens (fotos, exames médicos)
- Áudios (podcasts, músicas)
- Vídeos (aulas, gravações)
- Posts em redes sociais

### Aplicações:
- Análise de sentimentos
- Reconhecimento de imagem e voz
- Monitoramento de redes sociais
- Big Data

## Comparação
| Tipo           | Estrutura      | Exemplos           | Aplicações           |
|----------------|---------------|--------------------|----------------------|
| Estruturado    | Rígida        | SQL, planilhas     | ERP, relatórios      |
| Semi-estruturado| Flexível      | JSON, XML, logs    | APIs, integração     |
| Não estruturado| Livre         | texto, imagem, áudio| IA, Big Data         |

## Desafios e Dicas
- Estruturados: fácil análise, mas pouco flexíveis
- Semi-estruturados: ótima integração, exige padronização
- Não estruturados: ricos em informação, exigem IA e processamento avançado

## Como processar?
- Estruturados: SQL, Excel, BI
- Semi-estruturados: scripts, ETL, APIs
- Não estruturados: NLP, visão computacional, machine learning

