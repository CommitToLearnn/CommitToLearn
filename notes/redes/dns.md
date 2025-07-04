# DNS - Domain Name System

## O que é DNS?

O **DNS (Domain Name System)** é um sistema hierárquico e distribuído que traduz nomes de domínio legíveis por humanos (como www.google.com) em endereços IP que os computadores podem entender (como 142.250.191.78).

## Por que o DNS é Necessário?

### Problema: Endereços IP são Difíceis de Lembrar

| Sem DNS | Com DNS |
|---------|---------|
| 142.250.191.78 | www.google.com |
| 157.240.241.35 | www.facebook.com |
| 204.79.197.200 | www.bing.com |

### Vantagens do DNS

| Vantagem | Descrição |
|----------|-----------|
| **Facilidade** | Nomes são mais fáceis de lembrar |
| **Flexibilidade** | IPs podem mudar sem afetar o nome |
| **Escalabilidade** | Sistema distribuído globalmente |
| **Redundância** | Múltiplos servidores por zona |

## Hierarquia do DNS

### Estrutura Hierárquica
```
                Root (.)
                    |
            +-------+-------+
            |               |
          .com            .org
            |               |
        google.com      wikipedia.org
            |               |
        www.google.com  en.wikipedia.org
```

### Tipos de Domínios

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Root Domain** | Nível mais alto (.) | . |
| **TLD** | Top Level Domain | .com, .org, .br |
| **Second Level** | Domínio principal | google, facebook |
| **Subdomain** | Subdomínio | www, mail, ftp |

## Tipos de Servidores DNS

### Hierarquia de Servidores

| Tipo | Função | Exemplo |
|------|--------|---------|
| **Root Servers** | Direcionam para TLD | a.root-servers.net |
| **TLD Servers** | Autoridade para .com, .org | a.gtld-servers.net |
| **Authoritative** | Resposta final para domínio | ns1.google.com |
| **Recursive** | Resolve consultas para clientes | 8.8.8.8 (Google) |

### Servidores DNS Públicos

| Provedor | Primary | Secondary | Características |
|----------|---------|-----------|-----------------|
| **Google** | 8.8.8.8 | 8.8.4.4 | Rápido, confiável |
| **Cloudflare** | 1.1.1.1 | 1.0.0.1 | Privacidade, velocidade |
| **OpenDNS** | 208.67.222.222 | 208.67.220.220 | Controle parental |
| **Quad9** | 9.9.9.9 | 149.112.112.112 | Segurança, malware block |

## Tipos de Registros DNS

### Registros Principais

| Tipo | Função | Exemplo |
|------|--------|---------|
| **A** | IPv4 address | google.com → 142.250.191.78 |
| **AAAA** | IPv6 address | google.com → 2607:f8b0:4004:c1b::65 |
| **CNAME** | Alias (apelido) | www.google.com → google.com |
| **MX** | Mail exchange | google.com → gmail-smtp-in.l.google.com |
| **NS** | Name server | google.com → ns1.google.com |
| **PTR** | Reverse DNS | 78.191.250.142.in-addr.arpa → google.com |
| **TXT** | Texto/informações | Verificação, SPF, DKIM |
| **SOA** | Start of authority | Informações da zona |

### Registros Especiais

| Tipo | Uso | Exemplo |
|------|-----|---------|
| **SRV** | Serviços | _http._tcp.example.com |
| **CAA** | Certificate Authority | example.com CAA 0 issue "letsencrypt.org" |
| **DNAME** | Delegation | example.com DNAME example.net |

## Processo de Resolução DNS

### Consulta Recursiva - Passo a Passo

| Passo | Ação | Servidor |
|-------|------|---------|
| **1** | Cliente consulta www.google.com | PC → DNS Local |
| **2** | DNS local consulta root server | DNS Local → Root |
| **3** | Root responde com TLD .com | Root → DNS Local |
| **4** | DNS local consulta TLD .com | DNS Local → TLD |
| **5** | TLD responde com NS google.com | TLD → DNS Local |
| **6** | DNS local consulta NS google.com | DNS Local → Authoritative |
| **7** | NS responde com IP | Authoritative → DNS Local |
| **8** | DNS local responde ao cliente | DNS Local → PC |

### Tipos de Consulta

| Tipo | Descrição | Quem Faz |
|------|-----------|----------|
| **Recursiva** | Servidor resolve completamente | Cliente → DNS Recursivo |
| **Iterativa** | Servidor retorna melhor resposta | DNS Recursivo → Autoritativo |
| **Não-recursiva** | Consulta resposta em cache | Cache hit |

## Cache DNS

### Níveis de Cache

| Nível | Localização | TTL Típico |
|-------|-------------|------------|
| **Browser** | Navegador | 1-30 min |
| **OS** | Sistema operacional | 1-24 horas |
| **Router** | Roteador local | 1-24 horas |
| **ISP** | Provedor internet | 1-72 horas |

### Time To Live (TTL)

| TTL | Uso | Exemplo |
|-----|-----|---------|
| **300s (5min)** | Sites dinâmicos | CDN, load balancers |
| **3600s (1h)** | Sites normais | Websites típicos |
| **86400s (24h)** | Sites estáticos | Servidores email |

## Comandos DNS

### Windows
```cmd
nslookup google.com

nslookup -type=MX google.com

ipconfig /flushdns

ipconfig /displaydns
```

### Linux
```bash
# Consulta DNS detalhada
dig google.com

# Consulta registros MX
dig MX google.com

# Consulta reversa (IP para domínio)
dig -x 8.8.8.8

# Rastrear processo de resolução
dig +trace google.com

host google.com
```

## Configuração DNS

### Linux (/etc/resolv.conf)
```bash
nameserver 8.8.8.8
nameserver 1.1.1.1

search empresa.com.br

options timeout:2
options attempts:3
```

### Windows (via Interface)
| Campo | Valor | Descrição |
|-------|-------|-----------|
| **DNS Primário** | 8.8.8.8 | Primeiro servidor |
| **DNS Secundário** | 1.1.1.1 | Servidor backup |
| **Sufixo DNS** | empresa.local | Domínio local |

## Zona DNS

### Arquivo de Zona (exemplo.com)
```dns
$TTL 86400
$ORIGIN exemplo.com.

@ IN SOA ns1.exemplo.com. admin.exemplo.com. (
    2023111501  ; Serial
    3600        ; Refresh
    1800        ; Retry
    604800      ; Expire
    86400       ; Minimum TTL
)

; Servidores de nome
@ IN NS ns1.exemplo.com.
@ IN NS ns2.exemplo.com.

; Registros A
@ IN A 203.0.113.10
www IN A 203.0.113.10
mail IN A 203.0.113.20
ftp IN A 203.0.113.30

; Registros MX
@ IN MX 10 mail.exemplo.com.
@ IN MX 20 mail2.exemplo.com.

; Registros CNAME
blog IN CNAME www.exemplo.com.
```

## DNS Seguro

### Problemas de Segurança

| Problema | Descrição | Impacto |
|----------|-----------|---------|
| **DNS Spoofing** | Respostas falsas | Redirecionamento malicioso |
| **Cache Poisoning** | Cache corrompido | Persistência do ataque |
| **DNS Hijacking** | Alteração de configuração | Controle total |
| **DDoS** | Sobrecarga de servidores | Indisponibilidade |

### Soluções de Segurança

| Solução | Descrição | Benefício |
|---------|-----------|-----------|
| **DNSSEC** | Assinatura criptográfica | Autenticidade |
| **DNS over HTTPS (DoH)** | DNS via HTTPS | Privacidade |
| **DNS over TLS (DoT)** | DNS via TLS | Criptografia |
| **DNS Filtering** | Bloqueio de domínios | Proteção contra malware |

## Troubleshooting DNS

### Problemas Comuns

| Sintoma | Possível Causa | Solução |
|---------|----------------|---------|
| **Site não carrega** | DNS não resolve | Verificar configuração DNS |
| **Lentidão** | DNS lento | Trocar servidor DNS |
| **Erro NXDOMAIN** | Domínio não existe | Verificar digitação |
| **Timeout** | Servidor não responde | Verificar conectividade |

### Ferramentas de Diagnóstico

| Ferramenta | Plataforma | Uso |
|------------|------------|-----|
| **nslookup** | Windows/Linux | Consultas básicas |
| **dig** | Linux/Mac | Consultas avançadas |
| **host** | Linux/Mac | Consultas simples |
| **dnslookup.org** | Web | Testes online |

## DNS Público vs. Privado

### Comparação

| Aspecto | DNS Público | DNS Privado |
|---------|-------------|-------------|
| **Acesso** | Internet | Rede interna |
| **Exemplo** | google.com | servidor.empresa.local |
| **Autoridade** | ICANN/Registrars | Administrador local |
| **Resolução** | Servidores públicos | Servidores internos |

### Split DNS

| Zona | Localização | Registro |
|------|-------------|----------|
| **Externa** | Internet | empresa.com → 203.0.113.10 |
| **Interna** | LAN | empresa.com → 192.168.1.10 |

O DNS é fundamental para o funcionamento da internet, transformando nomes em endereços e permitindo navegação intuitiva e eficiente na web.
