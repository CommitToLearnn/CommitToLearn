# Switching (Comutação) - A Arte de Conectar Dispositivos

## O que é Switching?

O **Switching** (Comutação) é o processo de encaminhar dados entre dispositivos em uma rede local (LAN). Um switch é um dispositivo inteligente que aprende e armazena endereços MAC para tomar decisões sobre onde enviar os dados.

## Como Funciona um Switch

### Aprendizado de Endereços MAC
O switch constrói uma tabela MAC (CAM table) associando endereços MAC às portas.

### Decisões de Encaminhamento
- **Known Unicast**: Envia para a porta específica
- **Unknown Unicast**: Flood para todas as portas (exceto origem)
- **Broadcast**: Envia para todas as portas
- **Multicast**: Envia para portas interessadas

## Tipos de Switching

| Tipo | Descrição | Vantagem | Desvantagem |
|------|-----------|----------|-------------|
| **Store-and-Forward** | Recebe o frame completo antes de encaminhar | Detecta erros | Maior latência |
| **Cut-Through** | Encaminha assim que lê o endereço destino | Menor latência | Não detecta erros |
| **Fragment-Free** | Lê os primeiros 64 bytes antes de encaminhar | Compromisso entre os dois | Latência média |

## Domínios de Colisão vs. Broadcast

### Comparação

| Aspecto | Hub | Switch |
|---------|-----|---------|
| **Domínios de Colisão** | 1 domínio para todas as portas | 1 domínio por porta |
| **Domínios de Broadcast** | 1 domínio | 1 domínio (todas as portas) |
| **Largura de Banda** | Compartilhada | Dedicada por porta |
| **Duplex** | Half-duplex | Full-duplex |

## VLAN (Virtual LAN)

### Benefícios das VLANs

| Benefício | Descrição |
|-----------|-----------|
| **Segmentação** | Separa tráfego logicamente |
| **Segurança** | Isola grupos de usuários |
| **Performance** | Reduz domínios de broadcast |
| **Flexibilidade** | Reorganização sem mudança física |

### Tipos de VLAN

| Tipo | Baseado em | Exemplo |
|------|------------|---------|
| **Port-based** | Porta física | VLAN 10 = Portas 1-8 |
| **MAC-based** | Endereço MAC | VLAN 20 = MAC específicos |
| **Protocol-based** | Protocolo | VLAN 30 = Tráfego IP |

## Spanning Tree Protocol (STP)

### Problema: Loops de Rede
Múltiplos caminhos entre switches podem causar:
- **Broadcast Storms**
- **Instabilidade da tabela MAC**
- **Múltiplas cópias de frames**

### Solução: STP

| Estado da Porta | Descrição | Envia Dados? | Aprende MAC? |
|----------------|-----------|--------------|--------------|
| **Blocking** | Bloqueada para evitar loops | ❌ | ❌ |
| **Listening** | Ouve BPDUs | ❌ | ❌ |
| **Learning** | Aprende endereços MAC | ❌ | ✅ |
| **Forwarding** | Encaminha dados normalmente | ✅ | ✅ |
| **Disabled** | Porta desabilitada | ❌ | ❌ |

## Comandos Práticos (Cisco)

### Configuração Básica
```bash
enable
configure terminal

vlan 10
name Vendas
exit

interface fastethernet 0/1
switchport mode access
switchport access vlan 10
```

### Verificação
```bash
show mac address-table

show vlan brief

show spanning-tree
```

## Troubleshooting Comum

| Problema | Possível Causa | Solução |
|----------|----------------|---------|
| **Conectividade intermitente** | Loop de rede | Verificar STP |
| **Broadcast storm** | Configuração STP incorreta | Reconfigurar STP |
| **VLAN não funciona** | Porta no trunk errado | Verificar modo da porta |
| **Lentidão na rede** | Tabela MAC cheia | Limpar tabela MAC |

## Melhores Práticas

### Segurança
- **Port Security**: Limitar número de MACs por porta
- **DHCP Snooping**: Prevenir ataques DHCP rogue
- **Dynamic ARP Inspection**: Prevenir ARP spoofing

### Performance
- **EtherChannel**: Agregar links para maior largura de banda
- **QoS**: Priorizar tráfego crítico
- **VLAN design**: Planejar VLANs por função, não localização

### Monitoramento
```bash
show interfaces status

show interfaces counters errors

show processes cpu
```

## Exemplo Prático: Configuração de Switch Corporativo

### Cenário
- **VLAN 10**: Vendas (Portas 1-8)
- **VLAN 20**: TI (Portas 9-16)
- **VLAN 30**: Gerência (Portas 17-20)
- **Trunk**: Porta 24 (para roteador)

### Configuração
```bash
vlan 10
name Vendas
vlan 20
name TI
vlan 30
name Gerencia

interface range fa0/1-8
switchport mode access
switchport access vlan 10

interface range fa0/9-16
switchport mode access
switchport access vlan 20

interface range fa0/17-20
switchport mode access
switchport access vlan 30

interface fa0/24
switchport mode trunk
switchport trunk allowed vlan 10,20,30
```

O switching é fundamental para redes modernas, proporcionando conectividade eficiente, segura e escalável em ambientes LAN.
