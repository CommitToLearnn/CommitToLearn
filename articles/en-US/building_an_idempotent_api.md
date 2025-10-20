### Practical Tutorial

## Code Without Double Charges: Building an Idempotent API with Node.js and Redis

Theory is great, but nothing beats getting your hands dirty. In this tutorial, we'll build an extremely simple "payments" API using Node.js with the Express.js framework, and we'll use Redis as our cache to implement the `Idempotency-Key` pattern, ensuring that a payment is never processed twice.

#### Prerequisites:

*   Node.js and npm installed.
*   Docker installed (to easily run Redis).
*   Basic knowledge of JavaScript and Express.js.

#### Step 1: Project Setup and Dependencies

Let's start by creating our project and installing the necessary dependencies.

```bash
mkdir idempotent-api
cd idempotent-api
npm init -y
npm install express redis uuid
```

*   `express`: Our web framework.
*   `redis`: The Node.js client to connect to Redis.
*   `uuid`: To generate idempotency keys on the client side (for our test).

Now, let's start a Redis container with Docker:
```bash
docker run --name my-redis -p 6379:6379 -d redis
```

#### Step 2: The Vulnerable Endpoint (Without Idempotency)

Create a file `index.js` and add the following code. This is our starting point: a `POST /payments` endpoint that simply processes a payment every time it's called.

```javascript
// index.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/payments', (req, res) => {
  const { amount, order_id } = req.body;

  // --- Payment Processing Simulation ---
  console.log(`PROCESSING PAYMENT of $${amount} for order ${order_id}...`);
  // (Here would be the actual logic with a payment gateway)
  console.log('PAYMENT APPROVED!');
  // --- End of Simulation ---

  const response = {
    status: 'success',
    transaction_id: `trans_${new Date().getTime()}` // Always a new transaction ID
  };

  res.status(201).json(response);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

If you run this (`node index.js`) and send two identical `POST` requests, you'll see "PROCESSING PAYMENT" in the console twice. Problem!

#### Step 3: Creating the Idempotency Middleware

Now, let's create the magic. We'll modify our `index.js` to include the idempotency logic using Redis.

```javascript
// index.js (Final Version with Idempotency)
const express = require('express');
const { createClient } = require('redis');
const app = express();
app.use(express.json());

// Configure and connect the Redis client
const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));
(async () => {
  await redisClient.connect();
})();


// Our Idempotency Middleware!
const idempotencyMiddleware = async (req, res, next) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    // If there's no key, proceed without idempotency (or return an error)
    return next();
  }

  try {
    const cachedResponse = await redisClient.get(idempotencyKey);

    if (cachedResponse) {
      console.log(`[Idempotency] Key '${idempotencyKey}' found. Returning cached response.`);
      const parsedResponse = JSON.parse(cachedResponse);
      return res.status(parsedResponse.statusCode).json(parsedResponse.body);
    }

    // If not in cache, we need to wrap `res.json` and `res.status` to cache the response
    const originalJson = res.json;
    const originalStatus = res.status;
    let responseBody;
    let responseStatus;

    res.status = (statusCode) => {
      responseStatus = statusCode;
      return originalStatus.call(res, statusCode);
    };

    res.json = (body) => {
      responseBody = body;
      return originalJson.call(res, body);
    };

    res.on('finish', async () => {
      if (responseBody && responseStatus) {
        console.log(`[Idempotency] Saving response for key '${idempotencyKey}'`);
        const responseToCache = {
          statusCode: responseStatus,
          body: responseBody,
        };
        // Set with an expiration of 24 hours (86400 seconds)
        await redisClient.set(idempotencyKey, JSON.stringify(responseToCache), {
          EX: 86400,
        });
      }
    });
    
    next();

  } catch (error) {
    console.error('Error in idempotency middleware:', error);
    next(error);
  }
};

// Applying the middleware to our endpoint
app.post('/payments', idempotencyMiddleware, (req, res) => {
  const { amount, order_id } = req.body;

  // --- Payment Processing Simulation ---
  console.log(`PROCESSING PAYMENT of $${amount} for order ${order_id}...`);
  console.log('PAYMENT APPROVED!');
  // --- End of Simulation ---

  const response = {
    status: 'success',
    transaction_id: `trans_${new Date().getTime()}`
  };
  res.status(201).json(response);
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
*(Note: This middleware is a simplified implementation for educational purposes. Libraries like `idempotency-middleware-express` can offer more robustness).*

#### Step 4: Testing the Result

Let's use a tool like Postman or `curl` to test. First, generate a UUID (you can use an online generator or the `uuid` package in Node).

**First Request:**
```bash
curl -X POST http://localhost:3000/payments \
-H "Content-Type: application/json" \
-H "Idempotency-Key: 1a9f1a08-3a1b-4b1f-8c1a-9a0b1a0e1a0f" \
-d '{"amount": 150.50, "order_id": "xyz-789"}'
```
*   **In your server terminal, you'll see:**
    *   `PROCESSING PAYMENT...`
    *   `PAYMENT APPROVED!`
    *   `[Idempotency] Saving response for key '...'`
*   **You'll receive a JSON response with a `transaction_id`.**

**Second Request (Exactly the same):**
```bash
curl -X POST http://localhost:3000/payments \
-H "Content-Type: application/json" \
-H "Idempotency-Key: 1a9f1a08-3a1b-4b1f-8c1a-9a0b1a0e1a0f" \
-d '{"amount": 150.50, "order_id": "xyz-789"}'
```
*   **In your server terminal, you'll ONLY see:**
    *   `[Idempotency] Key '...' found. Returning cached response.`
*   **You'll receive the SAME JSON response as the first time.** The payment was not processed again!

#### Discussion and Next Steps

*   **Key Generation:** The `Idempotency-Key` must be generated by the client. This ensures that retries from the same client use the same key.
*   **Expiration:** It's crucial to set an expiration time for the keys in the cache (as we did with `EX: 86400` for 24 hours) to prevent your cache from growing indefinitely.
*   **What to cache?** We cached the status code and the response body. This is important so that the client always receives the same response, whether it's a success or an error (e.g., `400 Bad Request`).

With this pattern, you've added a robust layer of resilience to your API, preventing one of the most common and dangerous problems in distributed systems.