# Máquinas Virtuais (VMs)

Máquinas Virtuais são emulações completas de sistemas computacionais que executam sobre um hypervisor, fornecendo isolamento total entre diferentes ambientes.

## Conceito Básico
- Virtualização completa de hardware
- Sistema operacional convidado isolado
- Hypervisor gerencia recursos físicos
- Cada VM tem seu próprio kernel

## Arquitetura de Virtualização

### Tipos de Hypervisors
```
Type 1 (Bare-metal)          Type 2 (Hosted)
┌─────────────────┐          ┌─────────────────┐
│   VM1  │  VM2   │          │   VM1  │  VM2   │
├─────────────────┤          ├─────────────────┤
│   Hypervisor    │          │   Hypervisor    │
├─────────────────┤          ├─────────────────┤
│   Hardware      │          │    Host OS      │
└─────────────────┘          ├─────────────────┤
                             │   Hardware      │
                             └─────────────────┘
```

### Type 1 Hypervisors (Bare-metal)
- **VMware vSphere/ESXi**: Enterprise virtualization
- **Microsoft Hyper-V**: Windows Server virtualization
- **Xen**: Open source hypervisor
- **Citrix XenServer**: Commercial Xen distribution

### Type 2 Hypervisors (Hosted)
- **VMware Workstation/Fusion**: Desktop virtualization
- **Oracle VirtualBox**: Open source desktop VM
- **Parallels Desktop**: macOS virtualization
- **QEMU/KVM**: Linux virtualization

## Tecnologias de Virtualização

### KVM (Kernel-based Virtual Machine)
```bash
# Verificar suporte à virtualização
egrep -c '(vmx|svm)' /proc/cpuinfo

# Instalar KVM no Ubuntu/Debian
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Verificar instalação
sudo kvm-ok

# Criar VM com virt-install
sudo virt-install \
  --name=teste-vm \
  --vcpus=2 \
  --memory=2048 \
  --disk size=20 \
  --os-variant=ubuntu20.04 \
  --network bridge=virbr0 \
  --cdrom=/path/to/ubuntu.iso
```

### QEMU (Quick Emulator)
```bash
# Criar disco virtual
qemu-img create -f qcow2 disk.qcow2 10G

# Executar VM
qemu-system-x86_64 \
  -m 1024 \
  -hda disk.qcow2 \
  -cdrom ubuntu.iso \
  -boot d \
  -enable-kvm
```

### VMware vSphere
```bash
# Comandos PowerCLI (PowerShell)
Connect-VIServer vcenter.example.com

# Criar nova VM
New-VM -Name "TestVM" -VMHost esxi01.example.com -Datastore datastore1

# Configurar recursos
Set-VM -VM "TestVM" -MemoryGB 4 -NumCpu 2

# Iniciar VM
Start-VM -VM "TestVM"
```

## Características das VMs

### Vantagens
- **Isolamento Completo**: Sistema operacional independente
- **Compatibilidade**: Diferentes SOs no mesmo hardware
- **Snapshots**: Estado da VM pode ser salvo/restaurado
- **Migração**: Live migration entre hosts
- **Segurança**: Isolamento forte entre VMs
- **Recursos Dedicados**: Alocação garantida de recursos

### Desvantagens
- **Overhead**: Cada VM precisa de SO completo
- **Recursos**: Maior consumo de CPU, memória e storage
- **Boot Time**: Tempo de inicialização mais lento
- **Densidade**: Menor número de workloads por servidor

## Gerenciamento de VMs

### Ferramentas de Linha de Comando
```bash
# Virsh (libvirt)
virsh list --all
virsh start vm-name
virsh shutdown vm-name
virsh snapshot-create-as vm-name snapshot-name

# VBoxManage (VirtualBox)
VBoxManage list vms
VBoxManage startvm "VM Name"
VBoxManage controlvm "VM Name" poweroff

# ESXCLI (VMware)
esxcli vm process list
esxcli vm process kill --type hard --world-id 123456
```

### Automação e IaC
```yaml
# Terraform para VMware
resource "vsphere_virtual_machine" "vm" {
  name             = "terraform-test"
  resource_pool_id = data.vsphere_compute_cluster.cluster.resource_pool_id
  datastore_id     = data.vsphere_datastore.datastore.id

  num_cpus = 2
  memory   = 1024
  guest_id = "ubuntu64Guest"

  network_interface {
    network_id = data.vsphere_network.network.id
  }

  disk {
    label = "disk0"
    size  = 20
  }
}
```

### Vagrant para Desenvolvimento
```ruby
# Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.network "private_network", ip: "192.168.33.10"
  
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
    vb.cpus = 2
  end
  
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
  SHELL
end
```

## Casos de Uso

### Enterprise Datacenter
- **Server Consolidation**: Múltiplos servidores em um host
- **Disaster Recovery**: Backup e restore de VMs
- **Test/Dev Environments**: Ambientes isolados
- **Legacy Applications**: Suporte a sistemas antigos

### Cloud Computing
- **IaaS**: Infrastructure as a Service
- **Multi-tenancy**: Isolamento entre clientes
- **Elastic Scaling**: Auto-scaling de recursos
- **Compliance**: Isolamento para regulamentações

### Development
- **Cross-platform Testing**: Diferentes SOs
- **Snapshot Testing**: Estados de teste reproduzíveis
- **Environment Isolation**: Desenvolvimento seguro
- **Training**: Ambientes de laboratório

## Monitoramento e Performance

### Métricas Importantes
```bash
# CPU utilization
virt-top  # Similar ao top para VMs

# Memory usage
virsh dommemstat vm-name

# Disk I/O
virsh domblkstat vm-name

# Network statistics
virsh domifstat vm-name vnet0
```

### Otimização de Performance
```bash
# Balloon memory driver
echo 512 > /proc/sys/vm/min_free_kbytes

# VirtIO drivers para melhor I/O
modprobe virtio_net
modprobe virtio_blk

# CPU pinning para VMs críticas
virsh vcpupin vm-name 0 1
virsh vcpupin vm-name 1 2
```

## VM vs Containers

### Comparação
| Aspecto | VMs | Containers |
|---------|-----|------------|
| **Isolamento** | Completo (SO) | Processo/Namespace |
| **Overhead** | Alto | Baixo |
| **Boot Time** | Minutos | Segundos |
| **Densidade** | Baixa | Alta |
| **Portabilidade** | Limitada | Alta |
| **Security** | Muito Alto | Moderado |

### Quando Usar VMs
- Isolamento completo necessário
- Diferentes sistemas operacionais
- Aplicações legadas
- Compliance e regulamentações
- Workloads de longa duração
- Recursos dedicados necessários

## Tendências e Futuro
- **Unikernels**: VMs especializadas e otimizadas
- **Nested Virtualization**: VMs dentro de VMs
- **GPU Virtualization**: Compartilhamento de GPUs
- **Edge Computing**: VMs em edge locations
- **Hybrid Cloud**: Migração entre clouds
- **Serverless VMs**: VMs sob demanda
