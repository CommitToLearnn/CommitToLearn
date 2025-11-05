### **APIs REST**

Imagine que você está em uma **máquina de vendas automática (vending machine)**.

*   Cada produto tem um código específico (ex: A1, B2, C3).
*   Você digita o código exato do que quer (`A1`).
*   A máquina te entrega o item inteiro, pré-embalado (`um pacote de salgadinho`).

Você não pode pedir "só o salgadinho de queijo de dentro do pacote A1" ou "o biscoito do pacote B2 e o chocolate do C3 ao mesmo tempo". Você pede um código, e recebe um pacote inteiro e padronizado.

Uma **API REST** funciona de forma muito parecida. Ela é um conjunto de "códigos" (URLs) que te dão "pacotes de dados" (respostas JSON) de uma forma padronizada e previsível.

### O Conceito em Detalhes

**O que é uma API, afinal?**

Pense em uma API (Application Programming Interface) como um **garçom** em um restaurante.
*   Você (o **cliente**, ou **client**) não vai até a cozinha (o **servidor/banco de dados**) pegar sua comida.
*   Você faz um pedido claro para o garçom (a **API**).
*   O garçom leva seu pedido para a cozinha, pega o prato e o traz de volta para você.

A API é a camada intermediária que permite que diferentes sistemas conversem de forma organizada.

**O que significa "REST"?**

**REST** (Representational State Transfer) não é uma tecnologia, é um **conjunto de regras** ou um **estilo de arquitetura**. É como uma receita de bolo para construir APIs de forma lógica e consistente.

As ideias principais são:

*   **Recursos:** Tudo na sua API é um "recurso" (uma coisa). Pense em substantivos: `Usuários`, `Produtos`, `Pedidos`.
*   **Endpoints (URLs):** Cada recurso tem um endereço único. É o "código" da máquina de vendas.
    *   `/usuarios` (a coleção de todos os usuários)
    *   `/usuarios/123` (o usuário específico com ID 123)
*   **Ações (Verbos HTTP):** Você usa "verbos" padrão para dizer o que quer fazer com aquele recurso.

| Verbo HTTP | Ação | Exemplo Prático |
|------------|----------------------------|------------------------------------------|
| **GET** | Ler/Pegar dados | `GET /usuarios/123` (Me dê o usuário 123) |
| **POST** | Criar um novo recurso | `POST /usuarios` (Crie um novo usuário) |
| **PUT/PATCH**| Atualizar um recurso existente | `PUT /usuarios/123` (Atualize o usuário 123)|
| **DELETE** | Apagar um recurso | `DELETE /usuarios/123` (Apague o usuário 123)|

*   **Stateless (Sem estado):** O servidor é como um peixinho dourado. Cada pedido que você faz é independente e contém toda a informação que o servidor precisa. Ele não "lembra" do seu pedido anterior.

### Por Que Isso Importa?

*   **Previsibilidade:** É um padrão universal. Se você entende como uma API REST funciona, consegue usar milhares de outras. As URLs e os verbos são lógicos e fáceis de adivinhar.
*   **Simplicidade:** É relativamente simples de construir e de usar.
*   **Separação:** Permite que o time que cuida da interface (frontend) trabalhe de forma independente do time que cuida da lógica do servidor (backend). Eles só precisam combinar o "cardápio" da API.

### Exemplos Práticos

Vamos imaginar uma API de um blog.

*   **Para pegar a lista de todos os posts:**
    *   Verbo: `GET`
    *   Endpoint: `https://meublog.com/api/posts`
    *   *Resposta (JSON simplificado):*
        ```json
        [
          {"id": 1, "titulo": "Meu primeiro post", "conteudo": "..."},
          {"id": 2, "titulo": "Dicas de viagem", "conteudo": "..."}
        ]
        ```

*   **Para criar um novo post:**
    *   Verbo: `POST`
    *   Endpoint: `https://meublog.com/api/posts`
    *   *Dados que você envia (JSON):*
        ```json
        {"titulo": "Novo post incrível", "conteudo": "Este é o conteúdo."}
        ```

*   **Para pegar os comentários de um post específico (ID = 2):**
    *   Verbo: `GET`
    *   Endpoint: `https://meublog.com/api/posts/2/comentarios` (Note a estrutura lógica!)

### Armadilhas Comuns

*   **Over-fetching (Buscar dados demais):**
    *   **O problema:** A tela do seu app só precisa mostrar os **títulos** dos posts, mas a API `GET /posts` te devolve o título, o conteúdo completo, a data, o autor, etc. Você está gastando banda de internet à toa.
    *   **Analogia:** Você queria só o chiclete, mas teve que comprar a caixa inteira.

*   **Under-fetching (Buscar dados de menos):**
    *   **O problema:** Para montar uma tela, você precisa dos dados do post, dos dados do autor e dos comentários. Com REST, isso pode significar fazer 3 chamadas diferentes à API:
        1.  `GET /posts/1` (Pega o post)
        2.  `GET /autores/5` (Pega o autor do post)
        3.  `GET /posts/1/comentarios` (Pega os comentários)
    *   Isso deixa a aplicação lenta.

### Boas Práticas

*   **Use substantivos no plural para os endpoints:** `/posts`, `/users`, `/products`. É o padrão.
*   **Nunca use verbos nos endpoints:** É `/posts` (com o verbo GET), não `/getPosts`. A ação está no verbo HTTP, não na URL.
*   **Use os códigos de status HTTP corretamente:** `200 OK` (deu tudo certo), `201 Created` (criei o que você pediu), `404 Not Found` (não achei isso aí), `400 Bad Request` (seu pedido está estranho).

### Resumo Rápido

*   **O que é?** Um estilo de arquitetura para criar APIs previsíveis e padronizadas.
*   **Analogia:** Uma máquina de vendas. Códigos (URLs) específicos te dão pacotes de dados (JSON) pré-definidos.
*   **Como funciona?** Usando Recursos (substantivos), Endpoints (URLs) e Ações (Verbos HTTP: GET, POST, PUT, DELETE).
*   **Pontos Fortes:** Simples, padronizado, universalmente conhecido.
*   **Pontos Fracos:** Pode levar a *over-fetching* (dados demais) ou *under-fetching* (chamadas demais).