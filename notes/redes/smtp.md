# SMTP - Simple Mail Transfer Protocol

## O que é SMTP?

O **SMTP (Simple Mail Transfer Protocol)** é o protocolo padrão da internet para envio de emails. Funciona como um "carteiro digital" que entrega mensagens de email entre servidores de email através da internet.

## Como o Email Funciona

### Fluxo Completo do Email

| Passo | Ação | Protocolo |
|-------|------|-----------|
| **1** | Usuário compõe email | Cliente de email |
| **2** | Cliente envia para servidor SMTP | SMTP |
| **3** | Servidor SMTP do remetente processa | SMTP |
| **4** | Email é roteado para servidor destino | SMTP |
| **5** | Servidor destino armazena email | SMTP → Armazenamento |
| **6** | Usuário baixa email do servidor | POP3/IMAP |

### Componentes do Sistema de Email

| Componente | Função | Exemplo |
|------------|--------|---------|
| **MUA** | Mail User Agent | Outlook, Gmail web |
| **MSA** | Mail Submission Agent | Servidor SMTP de envio |
| **MTA** | Mail Transfer Agent | Servidor de roteamento |
| **MDA** | Mail Delivery Agent | Servidor de entrega |
| **MRA** | Mail Retrieval Agent | POP3/IMAP server |

## Protocolos de Email

### Comparação dos Protocolos

| Protocolo | Função | Porta | Uso |
|-----------|--------|-------|-----|
| **SMTP** | Envio de emails | 25, 587, 465 | Enviar mensagens |
| **POP3** | Recebimento (download) | 110, 995 | Download e remoção |
| **IMAP** | Recebimento (sincronização) | 143, 993 | Sincronização multi-dispositivo |

### POP3 vs. IMAP

| Aspecto | POP3 | IMAP |
|---------|------|------|
| **Armazenamento** | Local (cliente) | Servidor |
| **Sincronização** | ❌ Não sincroniza | ✅ Sincroniza |
| **Multi-dispositivo** | ❌ Difícil | ✅ Ideal |
| **Uso de espaço** | Servidor: baixo, Cliente: alto | Servidor: alto, Cliente: baixo |
| **Offline** | ✅ Total | ⚠️ Limitado |
| **Backup** | Responsabilidade do usuário | Automático no servidor |

## Portas SMTP

### Portas e Suas Funções

| Porta | Nome | Uso | Segurança |
|-------|------|-----|-----------|
| **25** | SMTP padrão | Comunicação servidor-servidor | ❌ Não criptografado |
| **587** | Submission | Cliente para servidor | ✅ STARTTLS |
| **465** | SMTPS | SMTP sobre SSL | ✅ SSL/TLS |
| **2525** | Alternativa | Quando 587 está bloqueada | ✅ STARTTLS |

### Evolução da Segurança

| Era | Porta | Método | Status |
|-----|-------|--------|--------|
| **Anos 80** | 25 | Texto puro | ❌ Inseguro |
| **Anos 90** | 465 | SSL implícito | ⚠️ Deprecated |
| **Anos 2000** | 587 | STARTTLS | ✅ Padrão atual |

## Autenticação SMTP

### Métodos de Autenticação

| Método | Descrição | Segurança |
|--------|-----------|-----------|
| **PLAIN** | Usuário e senha em base64 | ❌ Baixa (sem TLS) |
| **LOGIN** | Similar ao PLAIN | ❌ Baixa (sem TLS) |
| **CRAM-MD5** | Challenge-response | ⚠️ Média |
| **OAUTH2** | Token baseado | ✅ Alta |

### Exemplo de Autenticação PLAIN

```
AUTH PLAIN
AHVzdWFyaW9AZXhlbXBsby5jb20AcGFzc3dvcmQ=
(base64 de: \0usuario@exemplo.com\0password)
```

## Comandos SMTP

### Comandos Básicos

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| **HELO/EHLO** | Identificação do cliente | EHLO cliente.exemplo.com |
| **MAIL FROM** | Remetente | MAIL FROM: <joao@exemplo.com> |
| **RCPT TO** | Destinatário | RCPT TO: <maria@exemplo.com> |
| **DATA** | Início do conteúdo | DATA |
| **QUIT** | Encerrar conexão | QUIT |
| **AUTH** | Autenticação | AUTH PLAIN |
| **STARTTLS** | Iniciar criptografia | STARTTLS |

### Sessão SMTP Completa

```
S: 220 mail.exemplo.com ESMTP Postfix
C: EHLO cliente.exemplo.com
S: 250-mail.exemplo.com
S: 250-STARTTLS
S: 250-AUTH PLAIN LOGIN
S: 250 8BITMIME

C: STARTTLS
S: 220 2.0.0 Ready to start TLS

C: EHLO cliente.exemplo.com
S: 250-mail.exemplo.com
S: 250-AUTH PLAIN LOGIN
S: 250 8BITMIME

C: AUTH PLAIN AHVzdWFyaW9AZXhlbXBsby5jb20AcGFzc3dvcmQ=
S: 235 2.7.0 Authentication successful

C: MAIL FROM: <joao@exemplo.com>
S: 250 2.1.0 Ok

C: RCPT TO: <maria@exemplo.com>
S: 250 2.1.5 Ok

C: DATA
S: 354 End data with <CR><LF>.<CR><LF>
C: From: João <joao@exemplo.com>
C: To: Maria <maria@exemplo.com>
C: Subject: Teste de email
C: 
C: Olá Maria,
C: Este é um email de teste.
C: 
C: Att,
C: João
C: .
S: 250 2.0.0 Ok: queued as 12345

C: QUIT
S: 221 2.0.0 Bye
```

## Códigos de Resposta SMTP

### Categorias

| Categoria | Código | Significado |
|-----------|--------|-------------|
| **2xx** | 200-299 | Comando aceito |
| **3xx** | 300-399 | Comando aceito, mais informação necessária |
| **4xx** | 400-499 | Falha temporária |
| **5xx** | 500-599 | Falha permanente |

### Códigos Comuns

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| **220** | Service ready | Servidor pronto |
| **250** | Requested mail action okay | Comando executado |
| **354** | Start mail input | Pronto para receber dados |
| **421** | Service not available | Servidor sobrecarregado |
| **450** | Mailbox unavailable | Caixa temporariamente indisponível |
| **550** | Mailbox unavailable | Usuário não existe |
| **554** | Transaction failed | Email rejeitado |

## Formato de Mensagem (RFC 5322)

### Headers Obrigatórios

| Header | Descrição | Exemplo |
|--------|-----------|---------|
| **From** | Remetente | From: joao@exemplo.com |
| **Date** | Data de criação | Date: Mon, 1 Jan 2024 12:00:00 +0000 |

### Headers Comuns

| Header | Função | Exemplo |
|--------|--------|---------|
| **To** | Destinatário principal | To: maria@exemplo.com |
| **Cc** | Cópia | Cc: pedro@exemplo.com |
| **Bcc** | Cópia oculta | Bcc: admin@exemplo.com |
| **Subject** | Assunto | Subject: Reunião amanhã |
| **Reply-To** | Responder para | Reply-To: suporte@exemplo.com |
| **Message-ID** | Identificador único | Message-ID: <123@exemplo.com> |

### Exemplo de Email Completo

```
Return-Path: <joao@exemplo.com>
Received: from cliente.exemplo.com ([192.168.1.100])
    by mail.exemplo.com; Mon, 1 Jan 2024 12:00:00 +0000
From: João Silva <joao@exemplo.com>
To: Maria Santos <maria@exemplo.com>
Subject: Reunião de projeto
Date: Mon, 1 Jan 2024 12:00:00 +0000
Message-ID: <20240101120000.12345@exemplo.com>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Olá Maria,

Podemos marcar uma reunião para discutir o projeto?

Atenciosamente,
João
```

## Segurança do Email

### Problemas de Segurança

| Problema | Descrição | Solução |
|----------|-----------|---------|
| **Spoofing** | Falsificação do remetente | SPF, DKIM, DMARC |
| **Spam** | Emails não solicitados | Filtros anti-spam |
| **Phishing** | Emails maliciosos | Educação, filtros |
| **Interceptação** | Leitura não autorizada | TLS, criptografia |

### Tecnologias de Segurança

| Tecnologia | Função | Como Funciona |
|------------|--------|---------------|
| **SPF** | Verificar servidores autorizados | DNS TXT record |
| **DKIM** | Assinatura digital | Chave criptográfica |
| **DMARC** | Política de validação | SPF + DKIM |
| **MTA-STS** | Forçar TLS | HTTPS policy |

### Exemplo de SPF Record

```
exemplo.com. TXT "v=spf1 include:_spf.google.com ~all"
```

### Exemplo de DKIM Record

```
default._domainkey.exemplo.com. TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBA..."
```

### Exemplo de DMARC Record

```
_dmarc.exemplo.com. TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@exemplo.com"
```

## Configuração de Servidor SMTP

### Postfix (Linux) - Configuração Básica

```bash
sudo apt install postfix

myhostname = mail.exemplo.com
mydomain = exemplo.com
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
mynetworks = 127.0.0.0/8, 192.168.1.0/24

smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

smtpd_tls_cert_file = /etc/ssl/certs/servidor.pem
smtpd_tls_key_file = /etc/ssl/private/servidor.key
smtpd_use_tls = yes
```

### Configuração de Relay

```bash
relayhost = [smtp.gmail.com]:587
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_security_level = encrypt
```

## Clientes e Ferramentas

### Testes de Linha de Comando

```bash
telnet mail.exemplo.com 25

echo "Corpo do email" | mail -s "Assunto" destinatario@exemplo.com

swaks --to destinatario@exemplo.com --from remetente@exemplo.com --server mail.exemplo.com
```

### Python para SMTP

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

msg = MIMEMultipart()
msg['From'] = 'remetente@exemplo.com'
msg['To'] = 'destinatario@exemplo.com'
msg['Subject'] = 'Teste Python'

body = 'Este é um email enviado via Python'
msg.attach(MIMEText(body, 'plain'))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('usuario@gmail.com', 'senha')
text = msg.as_string()
server.sendmail('remetente@exemplo.com', 'destinatario@exemplo.com', text)
server.quit()
```

## Troubleshooting SMTP

### Problemas Comuns

| Problema | Erro | Solução |
|----------|------|---------|
| **Conexão recusada** | Connection refused | Verificar firewall/porta |
| **Autenticação falha** | 535 Authentication failed | Verificar credenciais |
| **Email rejeitado** | 550 User unknown | Verificar destinatário |
| **Limite excedido** | 452 Too many recipients | Reduzir número de destinatários |

### Comandos de Diagnóstico

```bash
telnet smtp.gmail.com 587

dig MX exemplo.com

tail -f /var/log/mail.log

postqueue -p

postsuper -d ALL
```

## SMTP na Nuvem

### Provedores de Email

| Provedor | Características | Limite Gratuito |
|----------|-----------------|-----------------|
| **Gmail SMTP** | Fácil configuração | 500 emails/dia |
| **SendGrid** | APIs avançadas | 100 emails/dia |
| **Amazon SES** | Integração AWS | 200 emails/dia |
| **Mailgun** | Developer-friendly | 300 emails/dia |

### Configuração Gmail SMTP

```
Servidor: smtp.gmail.com
Porta: 587 (TLS) ou 465 (SSL)
Usuário: seu.email@gmail.com
Senha: Senha de app (não a senha normal)
Autenticação: Obrigatória
```

O SMTP é fundamental para o funcionamento do email moderno, sendo essencial entender sua operação para administrar sistemas de email corporativos e desenvolver aplicações que enviam emails.
