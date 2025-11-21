### **Tutorial Prático**

## Código sem Cobrança Dupla: Construindo uma API Idempotente com Node.js e Redis

Teoria é ótimo, mas nada supera colocar a mão na massa. Neste tutorial, vamos construir uma API de "pagamentos" extremamente simples usando Node.js com o framework Express.js e usaremos o Redis como nosso cache para implementar o padrão `Idempotency-Key`, garantindo que um pagamento nunca seja processado duas vezes.

#### Pré-requisitos:

*   Node.js e npm instalados.
*   Docker instalado (para rodar o Redis facilmente).
*   Conhecimento básico de JavaScript e Express.js.

#### Passo 1: Setup do Projeto e Dependências

Vamos começar criando nosso projeto e instalando as dependências necessárias.

```bash
mkdir api-idempotente
cd api-idempotente
npm init -y
npm install express redis uuid
```

*   `express`: Nosso framework web.
*   `redis`: O cliente Node.js para se conectar ao Redis.
*   `uuid`: Para gerar as chaves de idempotência no lado do cliente (para nosso teste).

Agora, vamos iniciar um contêiner Redis com Docker:
```bash
docker run --name meu-redis -p 6379:6379 -d redis
```

#### Passo 2: O Endpoint Vulnerável (Sem Idempotência)

Crie um arquivo `index.js` e adicione o seguinte código. Este é o nosso ponto de partida: um endpoint `POST /pagamentos` que simplesmente processa um pagamento toda vez que é chamado.

```javascript
// index.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/pagamentos', (req, res) => {
  const { valor, id_pedido } = req.body;

  // --- Simulação de Processamento de Pagamento ---
  console.log(`PROCESSANDO PAGAMENTO de R$${valor} para o pedido ${id_pedido}...`);
  // (Aqui iria a lógica real com um gateway de pagamento)
  console.log('PAGAMENTO APROVADO!');
  // --- Fim da Simulação ---

  const resposta = {
    status: 'sucesso',
    id_transacao: `trans_${new Date().getTime()}` // ID de transação sempre novo
  };

  res.status(201).json(resposta);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

Se você rodar isso (`node index.js`) e enviar duas requisições `POST` idênticas, verá "PROCESSANDO PAGAMENTO" no console duas vezes. Problema!

#### Passo 3: Criando o Middleware de Idempotência

Agora, vamos criar a mágica. Vamos modificar nosso `index.js` para incluir a lógica de idempotência usando Redis.

```javascript
// index.js (Versão Final com Idempotência)
const express = require('express');
const { createClient } = require('redis');
const app = express();
app.use(express.json());

// Configura e conecta o cliente Redis
const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
  await redisClient.connect();
})();


// Nosso Middleware de Idempotência!
const idempotencyMiddleware = async (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    // Se não houver chave, prossiga sem idempotência (ou retorne erro)
    return next();
  }

  try {
    const cachedResponse = await redisClient.get(idempotencyKey);

    if (cachedResponse) {
      // Chave encontrada! Retorna a resposta cacheada.
      console.log(`[Idempotência] Chave '${idempotencyKey}' encontrada. Retornando resposta do cache.`);
      const parsedResponse = JSON.parse(cachedResponse);
      return res.status(parsedResponse.statusCode).json(parsedResponse.body);
    }

    // Chave não encontrada. Vamos salvar a resposta original para cachear depois.
    const originalJson = res.json;
    const originalStatus = res.status;
    let responseBody = null;

    res.status = (statusCode) => {
        res.locals.statusCode = statusCode;
        return originalStatus.call(res, statusCode);
    }
    
    res.json = (body) => {
      responseBody = body;
      return originalJson.call(res, body);
    };

    // Quando a resposta for finalizada, salvamos no cache
    res.on('finish', async () => {
      if (res.locals.statusCode >= 200 && res.locals.statusCode < 300) {
        const responseToCache = {
            statusCode: res.locals.statusCode,
            body: responseBody
        };
        console.log(`[Idempotência] Salvando resposta para a chave '${idempotencyKey}'.`);
        // Define um tempo de expiração (ex: 24 horas)
        await redisClient.set(idempotencyKey, JSON.stringify(responseToCache), { EX: 86400 });
      }
    });
    
    next();

  } catch (error) {
    console.error('Erro no middleware de idempotência:', error);
    next(error);
  }
};

// Aplicando o middleware ao nosso endpoint
app.post('/pagamentos', idempotencyMiddleware, (req, res) => {
  const { valor, id_pedido } = req.body;

  console.log(`PROCESSANDO PAGAMENTO de R$${valor} para o pedido ${id_pedido}...`);
  console.log('PAGAMENTO APROVADO!');

  const resposta = {
    status: 'sucesso',
    id_transacao: `trans_${new Date().getTime()}`
  };

  res.status(201).json(resposta);
});


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```
*(Nota: este middleware é uma implementação simplificada para fins didáticos. Bibliotecas como `idempotency-middleware-express` podem oferecer mais robustez).*

#### Passo 4: Testando o Resultado

Vamos usar uma ferramenta como o Postman ou `curl` para testar. Primeiro, gere um UUID (você pode usar um gerador online ou o pacote `uuid` no Node).

**Primeira Requisição:**
```bash
curl -X POST http://localhost:3000/pagamentos \
-H "Content-Type: application/json" \
-H "Idempotency-Key: 1a9f1a08-3a1b-4b1f-8c1a-9a0b1a0e1a0f" \
-d '{"valor": 150.50, "id_pedido": "xyz-789"}'
```
*   **No seu terminal do servidor, você verá:**
    *   `PROCESSANDO PAGAMENTO...`
    *   `PAGAMENTO APROVADO!`
    *   `[Idempotência] Salvando resposta para a chave '...'`
*   **Você receberá uma resposta JSON com um `id_transacao`.**

**Segunda Requisição (Exatamente a mesma):**
```bash
curl -X POST http://localhost:3000/pagamentos \
-H "Content-Type: application/json" \
-H "Idempotency-Key: 1a9f1a08-3a1b-4b1f-8c1a-9a0b1a0e1a0f" \
-d '{"valor": 150.50, "id_pedido": "xyz-789"}'
```
*   **No seu terminal do servidor, você verá APENAS:**
    *   `[Idempotência] Chave '...' encontrada. Retornando resposta do cache.`
*   **Você receberá a MESMA resposta JSON da primeira vez.** O pagamento não foi processado novamente!

#### Discussão e Próximos Passos

*   **Geração da Chave:** A `Idempotency-Key` deve ser gerada pelo cliente. Isso garante que retentativas do mesmo cliente usem a mesma chave.
*   **Expiração:** É crucial definir um tempo de expiração para as chaves no cache (como fizemos com `EX: 86400` para 24 horas) para evitar que seu cache cresça indefinidamente.
*   **O que cachear?** Nós cacheamos o código de status e o corpo da resposta. Isso é importante para que o cliente sempre receba a mesma resposta, seja ela de sucesso ou de erro (ex: `400 Bad Request`).

Com este padrão, você adicionou uma camada robusta de resiliência à sua API, prevenindo um dos problemas mais comuns e perigosos em sistemas distribuídos.