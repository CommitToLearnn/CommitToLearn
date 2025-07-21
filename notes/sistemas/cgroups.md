# Cgroups (Control Groups)

Cgroups são uma funcionalidade do kernel Linux que permite limitar, contabilizar e isolar o uso de recursos (CPU, memória, I/O) de grupos de processos.

## Conceito Básico
- Controla e monitora recursos do sistema
- Organiza processos em grupos hierárquicos
- Cada grupo pode ter limites e políticas específicas
- Base para containers e orquestração de recursos

## Funcionalidades Principais

### 1. Limitação de Recursos
- CPU: tempo de processamento, núcleos específicos
- Memória: RAM, swap, cache
- I/O: largura de banda de disco, IOPS
- Rede: largura de banda (com tc - traffic control)

### 2. Priorização
- Define prioridades entre grupos
- Garantia de recursos mínimos
- Compartilhamento proporcional

### 3. Contabilização
- Monitora uso de recursos em tempo real
- Histórico de consumo
- Estatísticas detalhadas

### 4. Controle
- Congelamento de processos
- Checkpointing
- Migração de processos

## Hierarquia de Subsistemas

### CPU Subsystem
```bash
# Criar grupo e definir limite de CPU
sudo mkdir /sys/fs/cgroup/cpu/meugrupo
echo "50000" > /sys/fs/cgroup/cpu/meugrupo/cpu.cfs_quota_us
echo $$ > /sys/fs/cgroup/cpu/meugrupo/cgroup.procs
```

### Memory Subsystem
```bash
# Limitar memória para 512MB
echo "536870912" > /sys/fs/cgroup/memory/meugrupo/memory.limit_in_bytes
```

### Block I/O Subsystem
```bash
# Limitar I/O para device específico
echo "8:0 1048576" > /sys/fs/cgroup/blkio/meugrupo/blkio.throttle.read_bps_device
```

## Cgroups v1 vs v2

### Cgroups v1 (Legacy)
- Múltiplas hierarquias independentes
- Um controlador por hierarquia
- Mais complexo de gerenciar
- Ainda amplamente usado

### Cgroups v2 (Unified Hierarchy)
- Hierarquia única e unificada
- Múltiplos controladores na mesma hierarquia
- Interface mais simples e consistente
- Padrão em distribuições modernas

## Comandos Úteis
```bash
# Ver cgroups de um processo
cat /proc/<PID>/cgroup

# Listar controladores disponíveis
cat /proc/cgroups

# Verificar versão dos cgroups
mount | grep cgroup

# Usar systemd para gerenciar cgroups
systemctl set-property --runtime httpd.service CPUQuota=50%
```

## Uso com Docker
```bash
# Docker usa cgroups automaticamente
docker run --memory=512m --cpus=1.5 nginx

# Ver cgroups do container
docker exec <container> cat /proc/self/cgroup
```

## Ferramentas de Gerenciamento
- **systemd**: Gerenciamento nativo de cgroups
- **cgroupstools**: Ferramentas de linha de comando
- **libcgroup**: Biblioteca C para cgroups
- **Docker/Podman**: Uso transparente de cgroups

## Exemplo Prático
```bash
# Criar um grupo com limite de memória
sudo mkdir /sys/fs/cgroup/memory/limite_teste
echo "268435456" | sudo tee /sys/fs/cgroup/memory/limite_teste/memory.limit_in_bytes

# Executar processo no grupo
echo $$ | sudo tee /sys/fs/cgroup/memory/limite_teste/cgroup.procs

# Verificar uso de memória
cat /sys/fs/cgroup/memory/limite_teste/memory.usage_in_bytes
```

## Benefícios
- Isolamento de recursos
- Prevenção de "noisy neighbors"
- QoS (Quality of Service)
- Melhor utilização de recursos
- Base para containers e orquestração
