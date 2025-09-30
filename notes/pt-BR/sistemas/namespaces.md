# Namespaces

Namespaces são uma funcionalidade do kernel Linux que permite isolar recursos do sistema operacional, criando "vistas" separadas para diferentes processos.

## Conceito Básico
- Fornecem isolamento de recursos entre processos
- Cada namespace tem sua própria vista de recursos específicos
- Base para tecnologias de containerização como Docker
- Implementados no kernel Linux desde a versão 2.6

## Tipos de Namespaces

### PID Namespace
- Isola identificadores de processos
- Cada namespace tem sua própria numeração de PIDs
- Processo pode ter PIDs diferentes em namespaces diferentes

### Network Namespace
- Isola recursos de rede
- Interfaces de rede, tabelas de roteamento, regras de firewall
- Cada namespace tem seu próprio stack de rede

### Mount Namespace
- Isola pontos de montagem do sistema de arquivos
- Permite diferentes vistas do sistema de arquivos
- Cada processo pode ver um conjunto diferente de montagens

### UTS Namespace
- Isola hostname e domainname
- Permite que diferentes processos tenham hostnames diferentes
- UTS = Unix Time Sharing

### IPC Namespace
- Isola recursos de comunicação entre processos
- Semáforos, filas de mensagens, memória compartilhada
- IPC = Inter-Process Communication

### User Namespace
- Isola identificadores de usuário e grupo
- Permite mapeamento de UIDs/GIDs
- Processo pode ser root dentro do namespace mas não-root fora

### Cgroup Namespace
- Isola vista dos cgroups
- Permite que processos vejam diferentes hierarquias de cgroups

## Comandos Úteis
```bash
# Listar namespaces
ls -la /proc/self/ns/

# Criar novo namespace
unshare --pid --fork --mount-proc /bin/bash

# Executar comando em namespace específico
nsenter -t <PID> -n -p /bin/bash

# Ver namespaces de um processo
ls -la /proc/<PID>/ns/
```

## Aplicações Práticas
- Containers (Docker, Podman)
- Sandboxing de aplicações
- Isolamento de serviços
- Virtualização leve
- Testes de rede isolados

## Exemplo de Uso
```bash
# Criar namespace de rede isolado
sudo unshare --net /bin/bash

# Dentro do namespace, só existe interface loopback
ip addr show

# Criar uma interface virtual
ip link add veth0 type veth peer name veth1
ip addr add 192.168.1.1/24 dev veth0
ip link set veth0 up
```
