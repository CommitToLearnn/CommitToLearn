# FTP - File Transfer Protocol

## O que é FTP?

O **FTP (File Transfer Protocol)** é um protocolo padrão da internet usado para transferir arquivos entre computadores em uma rede TCP/IP. Desenvolvido em 1971, é um dos protocolos mais antigos ainda em uso na internet.

## Como o FTP Funciona

### Arquitetura Cliente-Servidor

| Componente | Função | Porta |
|------------|--------|-------|
| **Cliente FTP** | Inicia conexão e comandos | Porta aleatória |
| **Servidor FTP** | Responde e transfere arquivos | 21 (controle), 20 (dados) |

### Dois Canais de Comunicação

| Canal | Porta | Função |
|-------|-------|--------|
| **Controle** | 21 | Comandos e respostas |
| **Dados** | 20 | Transferência de arquivos |

## Modos de Conexão FTP

### Modo Ativo vs. Passivo

| Aspecto | Modo Ativo | Modo Passivo |
|---------|------------|--------------|
| **Iniciativa** | Servidor inicia conexão de dados | Cliente inicia ambas conexões |
| **Firewall** | ❌ Problemas com NAT/Firewall | ✅ Funciona com NAT/Firewall |
| **Segurança** | ❌ Menos seguro | ✅ Mais seguro |
| **Uso** | Raro | Padrão moderno |

### Fluxo do Modo Passivo

| Passo | Ação | Porta |
|-------|------|-------|
| **1** | Cliente conecta ao servidor | 21 |
| **2** | Cliente envia comando PASV | 21 |
| **3** | Servidor responde com porta | 21 |
| **4** | Cliente conecta na porta informada | Porta aleatória |
| **5** | Transferência de dados | Porta aleatória |

## Comandos FTP Básicos

### Comandos de Autenticação

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| **USER** | Nome do usuário | USER joao |
| **PASS** | Senha do usuário | PASS senha123 |
| **QUIT** | Encerrar conexão | QUIT |

### Comandos de Navegação

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| **PWD** | Diretório atual | PWD |
| **CWD** | Mudar diretório | CWD /home/joao |
| **CDUP** | Diretório pai | CDUP |
| **LIST** | Listar arquivos | LIST ou LS |

### Comandos de Transferência

| Comando | Descrição | Uso |
|---------|-----------|-----|
| **RETR** | Baixar arquivo | get arquivo.txt |
| **STOR** | Enviar arquivo | put arquivo.txt |
| **DELE** | Deletar arquivo | delete arquivo.txt |
| **MKD** | Criar diretório | mkdir nova_pasta |
| **RMD** | Remover diretório | rmdir pasta_vazia |

## Códigos de Resposta FTP

### Categorias de Resposta

| Categoria | Código | Significado |
|-----------|--------|-------------|
| **1xx** | 100-199 | Positivo preliminar |
| **2xx** | 200-299 | Positivo de conclusão |
| **3xx** | 300-399 | Positivo intermediário |
| **4xx** | 400-499 | Negativo temporário |
| **5xx** | 500-599 | Negativo permanente |

### Códigos Comuns

| Código | Mensagem | Descrição |
|--------|----------|-----------|
| **220** | Service ready | Servidor pronto |
| **221** | Service closing | Conexão encerrada |
| **230** | User logged in | Login bem-sucedido |
| **331** | Username OK, need password | Usuário aceito, precisa senha |
| **425** | Can't open data connection | Erro na conexão de dados |
| **530** | Not logged in | Não autenticado |
| **550** | File not found | Arquivo não encontrado |

## Tipos de Transferência

### Modos de Transferência

| Modo | Descrição | Uso |
|------|-----------|-----|
| **ASCII** | Texto (conversão CRLF) | Arquivos de texto |
| **Binary** | Binário (sem conversão) | Imagens, executáveis |
| **Image** | Sinônimo de Binary | Mesmo que Binary |

### Comandos de Modo

| Comando | Função | Exemplo |
|---------|--------|---------|
| **TYPE A** | Modo ASCII | Para arquivos .txt, .html |
| **TYPE I** | Modo Binary | Para .jpg, .exe, .zip |

## FTP Seguro

### Problemas de Segurança do FTP

| Problema | Descrição | Risco |
|----------|-----------|-------|
| **Texto Claro** | Credenciais não criptografadas | Alto |
| **Sniffing** | Dados podem ser interceptados | Alto |
| **Bounce Attack** | Uso malicioso do modo ativo | Médio |
| **Brute Force** | Tentativas de senha | Médio |

### Alternativas Seguras

| Protocolo | Descrição | Porta | Segurança |
|-----------|-----------|-------|-----------|
| **FTPS** | FTP over SSL/TLS | 990 (implícito), 21 (explícito) | ✅ Criptografado |
| **SFTP** | SSH File Transfer Protocol | 22 | ✅ Criptografado |
| **SCP** | Secure Copy Protocol | 22 | ✅ Criptografado |

### FTPS vs. SFTP

| Aspecto | FTPS | SFTP |
|---------|------|------|
| **Base** | FTP + SSL/TLS | SSH |
| **Portas** | 21, 990 | 22 |
| **Complexidade** | Maior (firewall) | Menor |
| **Autenticação** | Usuário/senha + certificados | SSH keys ou senha |
| **Adoção** | Menor | Maior |

## Configuração de Servidor FTP

### vsftpd (Linux) - Configuração Básica

```bash
sudo apt install vsftpd

anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
user_sub_token=$USER
local_root=/home/$USER/ftp
pasv_enable=YES
pasv_min_port=10000
pasv_max_port=10100

sudo systemctl restart vsftpd
```

### Configurações de Segurança

| Configuração | Valor | Função |
|--------------|-------|--------|
| **ssl_enable** | YES | Habilitar FTPS |
| **force_local_data_ssl** | YES | Forçar SSL nos dados |
| **force_local_logins_ssl** | YES | Forçar SSL no login |
| **ssl_tlsv1** | YES | Usar TLS v1 |
| **ssl_sslv2** | NO | Desabilitar SSL v2 |
| **ssl_sslv3** | NO | Desabilitar SSL v3 |

## Clientes FTP

### Clientes de Linha de Comando

| Cliente | Sistema | Características |
|---------|---------|-----------------|
| **ftp** | Unix/Linux/Windows | Cliente básico |
| **sftp** | Unix/Linux | Seguro via SSH |
| **lftp** | Unix/Linux | Avançado, suporte a múltiplos protocolos |
| **curl** | Multiplataforma | Automação, scripts |

### Clientes Gráficos

| Cliente | Sistema | Características |
|---------|---------|-----------------|
| **FileZilla** | Multiplataforma | Gratuito, interface amigável |
| **WinSCP** | Windows | SFTP/SCP, integração Windows |
| **Cyberduck** | Mac/Windows | Interface moderna |
| **Total Commander** | Windows | Gerenciador de arquivos |

## Comandos Práticos

### Conexão FTP Básica

```bash
ftp servidor.exemplo.com

ftp usuario@servidor.exemplo.com

ftp
> open servidor.exemplo.com
> anonymous
> email@exemplo.com
```

### Transferência de Arquivos

```bash
ftp servidor.exemplo.com

ftp> ls
ftp> cd documentos
ftp> pwd

ftp> get arquivo.txt

ftp> mget *.txt

ftp> put meuarquivo.txt

ftp> mput *.jpg

ftp> binary
ftp> get imagem.jpg
```

### SFTP (Seguro)

```bash
sftp usuario@servidor.exemplo.com

sftp> ls
sftp> get arquivo.txt
sftp> put arquivo.txt
sftp> bye
```

## Automação com Scripts

### Script Bash para FTP

```bash
#!/bin/bash

FTP_HOST="servidor.exemplo.com"
FTP_USER="usuario"
FTP_PASS="senha"

ftp -n $FTP_HOST <<EOF
user $FTP_USER $FTP_PASS
binary
cd uploads
put arquivo.txt
bye
EOF
```

### Script Python para SFTP

```python
import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('servidor.exemplo.com', username='usuario', password='senha')

sftp = ssh.open_sftp()
sftp.put('arquivo_local.txt', '/remote/path/arquivo.txt')
sftp.get('/remote/path/arquivo.txt', 'arquivo_baixado.txt')

sftp.close()
ssh.close()
```

## Troubleshooting FTP

### Problemas Comuns

| Problema | Sintoma | Solução |
|----------|---------|---------|
| **Conexão recusada** | Erro na porta 21 | Verificar firewall/serviço |
| **Timeout na transferência** | Conexão de dados falha | Usar modo passivo |
| **425 Error** | Can't open data connection | Configurar PASV range |
| **530 Login incorrect** | Falha na autenticação | Verificar usuário/senha |

### Comandos de Diagnóstico

```bash
telnet servidor.exemplo.com 21

nmap -p 21,20 servidor.exemplo.com

tail -f /var/log/vsftpd.log

ftp
> passive
> open servidor.exemplo.com
```

## FTP na Era Moderna

### Uso Atual do FTP

| Cenário | Status | Alternativa |
|---------|--------|-------------|
| **Websites** | ❌ Deprecated | SFTP, Git, CI/CD |
| **Backup** | ❌ Inseguro | rsync, cloud storage |
| **Compartilhamento** | ❌ Obsoleto | Cloud storage, HTTPS |
| **Sistemas legados** | ⚠️ Ainda usado | Migração gradual |

### Migração para Alternativas

| De | Para | Benefício |
|----|------|-----------|
| **FTP** | **SFTP** | Segurança |
| **FTP** | **HTTPS** | Simplicidade |
| **FTP** | **Cloud Storage** | Escalabilidade |
| **FTP** | **Git** | Versionamento |

O FTP, apesar de ser um protocolo fundamental e amplamente suportado, deve ser usado com cautela devido às suas limitações de segurança. Em ambientes modernos, prefer SFTP ou outras alternativas seguras.
