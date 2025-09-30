# Unshare

Unshare é um comando e syscall do Linux que permite criar novos namespaces, "descompartilhando" recursos entre processos pai e filho.

## Conceito Básico
- Cria novos namespaces para isolar recursos
- Executa comandos em namespaces separados
- Base para implementação de containers
- Permite experimentação com isolamento de recursos

## Sintaxe do Comando
```bash
unshare [options] [command [arguments]]
```

## Principais Opções

### Namespaces Disponíveis
```bash
-p, --pid          # Novo PID namespace
-n, --net          # Novo network namespace  
-m, --mount        # Novo mount namespace
-u, --uts          # Novo UTS namespace (hostname)
-i, --ipc          # Novo IPC namespace
-U, --user         # Novo user namespace
-C, --cgroup       # Novo cgroup namespace
```

### Opções Auxiliares
```bash
-f, --fork         # Fork antes de executar o comando
--mount-proc       # Monta /proc no novo namespace
--map-root-user    # Mapeia usuário atual como root
-r, --map-root-user # Atalho para user namespace como root
```

## Exemplos Práticos

### Isolamento de PID
```bash
# Criar novo PID namespace
sudo unshare --pid --fork --mount-proc /bin/bash

# Dentro do namespace, ps mostra apenas processos locais
ps aux
```

### Isolamento de Rede
```bash
# Criar namespace de rede isolado
sudo unshare --net /bin/bash

# Só interface loopback estará disponível
ip addr show
```

### Isolamento de Mount
```bash
# Criar novo mount namespace
unshare --mount /bin/bash

# Mudanças de montagem não afetam o sistema pai
mkdir /tmp/teste
mount --bind /etc /tmp/teste
ls /tmp/teste
```

### Container Básico
```bash
# Criar "container" simples
sudo unshare --pid --net --mount --uts --ipc --fork --mount-proc \
  chroot /path/to/rootfs /bin/sh
```

### User Namespace
```bash
# Criar user namespace como usuário normal
unshare --user --map-root-user /bin/bash

# Agora você é "root" dentro do namespace
id
```

## Casos de Uso

### Desenvolvimento e Testes
```bash
# Testar aplicação em ambiente isolado
unshare --net --pid --fork /opt/myapp/bin/server

# Criar ambiente de teste sem afetar sistema
unshare --mount --fork /bin/bash -c "
  mount --bind /tmp/test-root /
  exec /bin/bash
"
```

### Debugging de Containers
```bash
# Entrar no mesmo namespace de um container
PID=$(docker inspect -f '{{.State.Pid}}' container_name)
sudo nsenter -t $PID -n -p -m /bin/bash
```

### Isolamento de Serviços
```bash
# Executar serviço em namespace isolado
unshare --pid --net --mount --fork \
  systemd-run --user --scope myservice
```

## Comparação com Outras Ferramentas

### vs nsenter
- **unshare**: Cria novos namespaces
- **nsenter**: Entra em namespaces existentes

### vs docker run
- **unshare**: Mais primitivo, controle granular
- **docker**: Mais alto nível, inclui imagens e orchestração

### vs systemd-nspawn
- **unshare**: Ferramenta simples e focada
- **systemd-nspawn**: Container mais completo com systemd

## Dicas e Truques

### Combinando Namespaces
```bash
# Isolamento completo
sudo unshare --pid --net --mount --uts --ipc --user \
  --map-root-user --fork --mount-proc /bin/bash
```

### Persistindo Namespaces
```bash
# Criar namespace e mantê-lo vivo
touch /tmp/netns
sudo unshare --net=/tmp/netns sleep infinity &

# Usar o namespace posteriormente
sudo nsenter --net=/tmp/netns /bin/bash
```

### Debugging
```bash
# Ver namespaces atuais
ls -la /proc/self/ns/

# Comparar namespaces entre processos
ls -la /proc/$$/ns/ /proc/$PPID/ns/
```

## Limitações
- Requer privilégios administrativos para alguns namespaces
- User namespaces podem ter restrições de segurança
- Nem todos os recursos são namespaceable
- Complexidade aumenta com múltiplos namespaces
