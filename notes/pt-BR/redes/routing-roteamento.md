# Routing (Roteamento) - Conectando Redes Diferentes

## O que é Routing?

O **Routing** (Roteamento) é o processo de determinar o melhor caminho para encaminhar pacotes entre diferentes redes. Roteadores operam na Camada 3 (Rede) do modelo OSI, usando endereços IP para tomar decisões.

## Diferença: Switch vs. Roteador

| Aspecto | Switch | Roteador |
|---------|--------|----------|
| **Camada OSI** | Camada 2 (Data Link) | Camada 3 (Network) |
| **Endereçamento** | Endereços MAC | Endereços IP |
| **Escopo** | LAN (mesma rede) | Inter-redes (redes diferentes) |
| **Broadcast** | Propaga broadcasts | Bloqueia broadcasts |
| **Tabela** | Tabela MAC | Tabela de Roteamento |

## Tabela de Roteamento

### Componentes de uma Rota

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| **Rede Destino** | Endereço da rede de destino | 192.168.1.0/24 |
| **Máscara** | Máscara da rede | 255.255.255.0 |
| **Gateway** | Próximo salto (next hop) | 10.0.0.1 |
| **Interface** | Interface de saída | eth0 |
| **Métrica** | Custo da rota | 1 |

### Exemplo de Tabela de Roteamento
```
Rede Destino      Máscara         Gateway       Interface  Métrica
0.0.0.0          0.0.0.0         192.168.1.1   eth0       1
192.168.1.0      255.255.255.0   Conectado     eth0       0
10.0.0.0         255.255.255.0   192.168.1.5   eth0       2
```

## Tipos de Roteamento

### Roteamento Estático

| Vantagem | Desvantagem |
|----------|-------------|
| ✅ Controle total | ❌ Configuração manual |
| ✅ Menor uso de CPU | ❌ Não se adapta a falhas |
| ✅ Mais seguro | ❌ Difícil manutenção |
| ✅ Previsível | ❌ Não escalável |

### Roteamento Dinâmico

| Protocolo | Tipo | Métrica | Uso |
|-----------|------|---------|-----|
| **RIP** | Distance Vector | Hop Count | Redes pequenas |
| **EIGRP** | Hybrid | Composta | Cisco (proprietário) |
| **OSPF** | Link State | Custo (bandwidth) | Redes médias/grandes |
| **BGP** | Path Vector | Políticas | Internet/ISPs |

## Protocolos de Roteamento Dinâmico

### RIP (Routing Information Protocol)

| Característica | Valor |
|----------------|-------|
| **Métrica** | Hop count (máx 15) |
| **Algoritmo** | Distance Vector |
| **Updates** | A cada 30 segundos |
| **Convergência** | Lenta |

### OSPF (Open Shortest Path First)

| Característica | Valor |
|----------------|-------|
| **Métrica** | Custo (baseado em bandwidth) |
| **Algoritmo** | Link State |
| **Updates** | Apenas mudanças |
| **Convergência** | Rápida |

### Comparação de Protocolos

| Aspecto | RIP | OSPF | EIGRP | BGP |
|---------|-----|------|-------|-----|
| **Escalabilidade** | Baixa | Alta | Alta | Muito Alta |
| **Convergência** | Lenta | Rápida | Rápida | Lenta |
| **Uso de CPU** | Baixo | Médio | Médio | Alto |
| **Complexidade** | Simples | Complexo | Médio | Muito Complexo |

## Processo de Roteamento

### Lookup na Tabela
O roteador verifica a tabela de roteamento para encontrar a melhor rota.

### Princípios de Seleção

| Prioridade | Critério |
|------------|----------|
| **1ª** | Longest Prefix Match |
| **2ª** | Administrative Distance |
| **3ª** | Métrica |

### Administrative Distance

| Fonte da Rota | AD | Confiabilidade |
|---------------|----|--------------| 
| **Conectado** | 0 | Mais confiável |
| **Estático** | 1 | Muito confiável |
| **EIGRP** | 90 | Confiável |
| **OSPF** | 110 | Confiável |
| **RIP** | 120 | Menos confiável |
| **Desconhecido** | 255 | Não confiável |

## Sub-redes e VLSM

### VLSM (Variable Length Subnet Mask)

**Problema**: Desperdício de IPs com máscaras fixas
**Solução**: Usar máscaras de tamanho variável

### Exemplo de Subnetting

| Subrede | Necessidade | Máscara | IPs Disponíveis |
|---------|-------------|---------|-----------------|
| Vendas | 50 hosts | /26 | 62 hosts |
| TI | 10 hosts | /28 | 14 hosts |
| Gerência | 5 hosts | /29 | 6 hosts |
| WAN Links | 2 hosts | /30 | 2 hosts |

## Comandos Práticos

### Configuração Cisco

#### Roteamento Estático
```bash
ip route 192.168.2.0 255.255.255.0 10.0.0.2

ip route 0.0.0.0 0.0.0.0 192.168.1.1
```

#### RIP
```bash
router rip
version 2
network 192.168.1.0
network 10.0.0.0
no auto-summary
```

#### OSPF
```bash
router ospf 1
network 192.168.1.0 0.0.0.255 area 0
network 10.0.0.0 0.0.0.255 area 0
```

### Verificação
```bash
show ip route

show ip protocols

debug ip routing
```

## Troubleshooting de Roteamento

| Problema | Comando | Verificação |
|----------|---------|-------------|
| **Sem conectividade** | `ping` | Conectividade básica |
| **Rota não aparece** | `show ip route` | Tabela de roteamento |
| **Loop de roteamento** | `traceroute` | Caminho dos pacotes |
| **Convergência lenta** | `show ip ospf neighbor` | Status dos vizinhos |

## NAT (Network Address Translation)

### Tipos de NAT

| Tipo | Descrição | Uso |
|------|-----------|-----|
| **Static NAT** | 1:1 mapeamento | Servidores públicos |
| **Dynamic NAT** | Pool de IPs públicos | Acesso temporário |
| **PAT (Overload)** | Muitos:1 com portas | Residencial/SOHO |

### Configuração PAT
```bash
interface fa0/0
ip nat inside

interface fa0/1
ip nat outside

access-list 1 permit 192.168.1.0 0.0.0.255

ip nat inside source list 1 interface fa0/1 overload
```

## Redundância e Balanceamento

### HSRP (Hot Standby Router Protocol)

| Conceito | Descrição |
|----------|-----------|
| **Virtual IP** | IP compartilhado entre roteadores |
| **Active Router** | Roteador principal |
| **Standby Router** | Roteador backup |
| **Priority** | Determina qual é o active |

### Load Balancing

| Método | Descrição |
|--------|-----------|
| **Equal Cost** | Múltiplas rotas com mesma métrica |
| **Unequal Cost** | EIGRP com variance |
| **Per-packet** | Cada pacote por rota diferente |
| **Per-destination** | Baseado no destino |

## Exemplo Prático: Rede Corporativa

### Topologia
```
Internet
    |
[Router WAN] 203.0.113.1/30
    |
[Router Core] 10.0.0.1/24
    |
+---+---+
|       |
VLAN10  VLAN20
Vendas   TI
```

### Configuração Completa
```bash
interface s0/0/0
ip address 203.0.113.2 255.255.255.252
no shutdown

interface fa0/0.10
encapsulation dot1q 10
ip address 10.1.10.1 255.255.255.0

interface fa0/0.20
encapsulation dot1q 20
ip address 10.1.20.1 255.255.255.0

ip route 0.0.0.0 0.0.0.0 203.0.113.1

access-list 1 permit 10.1.0.0 0.0.255.255
ip nat inside source list 1 interface s0/0/0 overload
```

O roteamento é essencial para interconectar redes, permitindo comunicação global e segmentação eficiente do tráfego.
