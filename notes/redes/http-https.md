# HTTP e HTTPS - Protocolos da Web

## O que é HTTP?

O **HTTP (HyperText Transfer Protocol)** é o protocolo fundamental da World Wide Web, usado para transferir dados entre clientes (navegadores) e servidores web. Define como as mensagens são formatadas e transmitidas.

## HTTP vs. HTTPS

### Comparação de Segurança

| Aspecto | HTTP | HTTPS |
|---------|------|-------|
| **Porta Padrão** | 80 | 443 |
| **Segurança** | ❌ Não criptografado | ✅ Criptografado (TLS/SSL) |
| **Privacidade** | ❌ Dados visíveis | ✅ Dados protegidos |
| **Integridade** | ❌ Pode ser alterado | ✅ Verificação de integridade |
| **Autenticação** | ❌ Sem verificação | ✅ Certificados digitais |
| **SEO** | ❌ Penalizado | ✅ Favorecido pelo Google |

### Vulnerabilidades do HTTP

| Vulnerabilidade | Descrição | Risco |
|----------------|-----------|-------|
| **Sniffing** | Interceptação de dados | Alto |
| **Man-in-the-Middle** | Alteração de conteúdo | Alto |
| **Session Hijacking** | Roubo de sessões | Alto |
| **Data Injection** | Inserção de código malicioso | Médio |

## Estrutura de uma Requisição HTTP

### Request HTTP
```http
GET /index.html HTTP/1.1
Host: www.exemplo.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Accept-Language: pt-BR,pt;q=0.9,en;q=0.8
Connection: keep-alive
```

### Response HTTP
```http
HTTP/1.1 200 OK
Date: Mon, 01 Jan 2024 12:00:00 GMT
Server: Apache/2.4.41
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Set-Cookie: sessionid=abc123; HttpOnly; Secure

<!DOCTYPE html>
<html>...
```

## Métodos HTTP

### Métodos Principais

| Método | Finalidade | Idempotente | Seguro |
|--------|------------|-------------|--------|
| **GET** | Recuperar dados | ✅ | ✅ |
| **POST** | Enviar dados | ❌ | ❌ |
| **PUT** | Criar/atualizar | ✅ | ❌ |
| **PATCH** | Atualização parcial | ❌ | ❌ |
| **DELETE** | Remover recurso | ✅ | ❌ |
| **HEAD** | Apenas headers | ✅ | ✅ |
| **OPTIONS** | Métodos permitidos | ✅ | ✅ |

### Exemplos Práticos

| Ação | Método | URL | Body |
|------|--------|-----|------|
| **Ver perfil** | GET | /users/123 | - |
| **Criar usuário** | POST | /users | JSON com dados |
| **Atualizar usuário** | PUT | /users/123 | JSON completo |
| **Alterar email** | PATCH | /users/123 | `{"email": "novo@email.com"}` |
| **Deletar usuário** | DELETE | /users/123 | - |

## Códigos de Status HTTP

### Categorias

| Categoria | Faixa | Significado |
|-----------|-------|-------------|
| **1xx** | 100-199 | Informacional |
| **2xx** | 200-299 | Sucesso |
| **3xx** | 300-399 | Redirecionamento |
| **4xx** | 400-499 | Erro do cliente |
| **5xx** | 500-599 | Erro do servidor |

### Códigos Mais Comuns

| Código | Status | Descrição | Uso |
|--------|--------|-----------|-----|
| **200** | OK | Sucesso | Requisição bem-sucedida |
| **201** | Created | Criado | Recurso criado com sucesso |
| **301** | Moved Permanently | Redirecionamento permanente | URL mudou definitivamente |
| **302** | Found | Redirecionamento temporário | URL mudou temporariamente |
| **400** | Bad Request | Requisição inválida | Dados malformados |
| **401** | Unauthorized | Não autorizado | Autenticação necessária |
| **403** | Forbidden | Proibido | Sem permissão |
| **404** | Not Found | Não encontrado | Recurso não existe |
| **500** | Internal Server Error | Erro interno | Erro no servidor |
| **502** | Bad Gateway | Gateway inválido | Proxy/gateway com erro |
| **503** | Service Unavailable | Serviço indisponível | Servidor sobrecarregado |

## Headers HTTP Importantes

### Headers de Request

| Header | Descrição | Exemplo |
|--------|-----------|---------|
| **Host** | Servidor de destino | Host: www.exemplo.com |
| **User-Agent** | Identificação do cliente | User-Agent: Chrome/120.0 |
| **Accept** | Tipos de conteúdo aceitos | Accept: application/json |
| **Authorization** | Credenciais de autenticação | Authorization: Bearer token123 |
| **Cookie** | Cookies do cliente | Cookie: sessionid=abc123 |
| **Content-Type** | Tipo do conteúdo enviado | Content-Type: application/json |

### Headers de Response

| Header | Descrição | Exemplo |
|--------|-----------|---------|
| **Content-Type** | Tipo do conteúdo | Content-Type: text/html |
| **Content-Length** | Tamanho do conteúdo | Content-Length: 1234 |
| **Set-Cookie** | Define cookie | Set-Cookie: id=123; HttpOnly |
| **Location** | URL de redirecionamento | Location: /login |
| **Cache-Control** | Controle de cache | Cache-Control: no-cache |
| **Server** | Software do servidor | Server: nginx/1.18.0 |

## HTTPS e Certificados SSL/TLS

### Como Funciona o HTTPS

| Passo | Ação | Descrição |
|-------|------|-----------|
| **1** | Handshake | Cliente conecta na porta 443 |
| **2** | Certificado | Servidor envia certificado SSL |
| **3** | Verificação | Cliente valida certificado |
| **4** | Chave | Troca de chaves simétricas |
| **5** | Criptografia | Comunicação criptografada |

### Tipos de Certificados SSL

| Tipo | Validação | Uso | Exemplo |
|------|-----------|-----|---------|
| **DV** | Domain Validation | Sites básicos | Let's Encrypt |
| **OV** | Organization Validation | Sites empresariais | Certificados pagos |
| **EV** | Extended Validation | Sites críticos | Bancos, e-commerce |
| **Wildcard** | Subdomínios | *.exemplo.com | Múltiplos subdomínios |

### Certificate Authority (CA)

| CA | Tipo | Custo | Reconhecimento |
|----|------|-------|----------------|
| **Let's Encrypt** | Gratuito | Grátis | Universal |
| **DigiCert** | Premium | Alto | Excelente |
| **Comodo** | Comercial | Médio | Bom |
| **GoDaddy** | Popular | Baixo | Bom |

## Sessões e Autenticação

### Métodos de Autenticação

| Método | Descrição | Vantagem | Desvantagem |
|--------|-----------|----------|-------------|
| **Basic Auth** | Usuario:senha em Base64 | Simples | Inseguro sem HTTPS |
| **Session Cookies** | ID de sessão no servidor | Seguro | Estado no servidor |
| **JWT** | Token autocontido | Stateless | Tamanho do token |
| **OAuth 2.0** | Delegação de autorização | Padrão moderno | Complexo |

### Exemplo de JWT
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1234567890",
    "name": "João Silva",
    "iat": 1516239022
  },
  "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

## Cache HTTP

### Tipos de Cache

| Tipo | Localização | Controle |
|------|-------------|----------|
| **Browser Cache** | Navegador | Cache-Control |
| **Proxy Cache** | Rede corporativa | Vários headers |
| **CDN Cache** | Edge servers | TTL configurável |
| **Server Cache** | Aplicação | Aplicação |

### Headers de Cache

| Header | Descrição | Exemplo |
|--------|-----------|---------|
| **Cache-Control** | Política de cache | Cache-Control: max-age=3600 |
| **Expires** | Data de expiração | Expires: Thu, 01 Dec 2024 16:00:00 GMT |
| **ETag** | Identificador de versão | ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4" |
| **Last-Modified** | Última modificação | Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT |

### Valores de Cache-Control

| Valor | Descrição |
|-------|-----------|
| **no-cache** | Revalidar antes de usar |
| **no-store** | Não armazenar em cache |
| **max-age=3600** | Cache por 1 hora |
| **must-revalidate** | Revalidar quando expira |
| **public** | Pode ser cacheado por proxies |
| **private** | Apenas browser pode cachear |

## Ferramentas de Desenvolvimento

### Comandos cURL

```bash
# Requisição GET simples
curl https://api.exemplo.com/users

# Requisição com autenticação
curl -H "Authorization: Bearer token123" https://api.exemplo.com/users

# Requisição POST com dados JSON
curl -X POST -H "Content-Type: application/json" \
     -d '{"name":"João","email":"joao@email.com"}' \
     https://api.exemplo.com/users

# Ver apenas headers de resposta
curl -I https://www.exemplo.com

# Seguir redirecionamentos
curl -L https://bit.ly/exemplo
```

### DevTools do Navegador

| Aba | Função | Informações |
|-----|--------|-------------|
| **Network** | Requisições HTTP | Status, headers, timing |
| **Security** | Certificados | Validade, CA, criptografia |
| **Application** | Armazenamento | Cookies, localStorage |
| **Console** | Logs e erros | JavaScript, network errors |

## Performance e Otimização

### Técnicas de Otimização

| Técnica | Descrição | Benefício |
|---------|-----------|-----------|
| **HTTP/2** | Protocolo moderno | Multiplexing, server push |
| **Compressão** | Gzip/Brotli | Reduz tamanho |
| **CDN** | Content Delivery Network | Menor latência |
| **Keep-Alive** | Reutiliza conexões | Menos overhead |
| **Minificação** | Remove espaços/comentários | Arquivos menores |

### Métricas de Performance

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **TTFB** | Time to First Byte | < 200ms |
| **FCP** | First Contentful Paint | < 1.8s |
| **LCP** | Largest Contentful Paint | < 2.5s |
| **CLS** | Cumulative Layout Shift | < 0.1 |

## Exemplo Prático: API RESTful

### Endpoints de uma API de Blog

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **GET** | /api/posts | Listar todos os posts |
| **GET** | /api/posts/123 | Ver post específico |
| **POST** | /api/posts | Criar novo post |
| **PUT** | /api/posts/123 | Atualizar post completo |
| **PATCH** | /api/posts/123 | Atualizar título apenas |
| **DELETE** | /api/posts/123 | Deletar post |

### Resposta da API
```json
{
  "status": "success",
  "data": {
    "id": 123,
    "title": "Introdução ao HTTP",
    "content": "HTTP é o protocolo...",
    "author": "João Silva",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "meta": {
    "total": 1,
    "page": 1
  }
}
```

HTTP e HTTPS são os pilares da comunicação web, essenciais para entender como a internet funciona e como construir aplicações web seguras e eficientes.
