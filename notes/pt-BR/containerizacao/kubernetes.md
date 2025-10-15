# Kubernetes (K8s): O Maestro dos Contêineres

Imagine que você tem uma frota de food trucks (contêineres Docker). No início, com um ou dois, é fácil gerenciá-los manualmente. Mas e se você tivesse centenas?

- Qual food truck está funcionando?
- Qual precisa de reparos?
- Como garantir que sempre haverá um food truck em cada bairro (disponibilidade)?
- Como adicionar mais trucks em um bairro movimentado (escalabilidade)?

O **Kubernetes** é o gerente geral dessa frota. Ele é o maestro que orquestra todos os contêineres, garantindo que tudo funcione em harmonia, de forma automática. Ele decide onde cada food truck (contêiner) deve estacionar (em qual servidor/nó), monitora a saúde deles, substitui os que quebram e adiciona mais quando a demanda aumenta.

### O que é e por que usar?

Kubernetes (ou K8s) é uma plataforma de **orquestração de contêineres** de código aberto que automatiza a implantação, o dimensionamento e o gerenciamento de aplicações containerizadas. Ele agrupa os servidores (físicos ou virtuais) em um cluster e gerencia a execução dos seus contêineres de forma eficiente e resiliente.

**Principais Benefícios:**

- **Autocorreção (Self-healing):** Se um contêiner falha, o Kubernetes o reinicia ou o substitui automaticamente.
- **Escalabilidade Horizontal:** Permite aumentar ou diminuir o número de contêineres em execução com um único comando, ou até mesmo de forma automática com base no uso de CPU.
- **Descoberta de Serviço e Balanceamento de Carga:** O K8s expõe contêineres na rede e distribui o tráfego entre eles, garantindo que as aplicações estejam sempre acessíveis.
- **Implantações e Rollbacks Automatizados:** Permite descrever o estado desejado da sua aplicação. O Kubernetes trabalha para que o estado atual corresponda ao estado desejado, facilitando atualizações (rollouts) e reversões (rollbacks).
- **Independência de Infraestrutura:** Funciona em qualquer lugar: em data centers locais, na nuvem pública (AWS, GCP, Azure) ou em ambientes híbridos.

### Arquitetura Simplificada

Um cluster Kubernetes é dividido em duas partes principais:

1.  **Control Plane (O Cérebro):** É o conjunto de componentes que toma as decisões globais sobre o cluster (ex: agendamento de contêineres) e detecta e responde a eventos do cluster.
    - **API Server:** A "porta de entrada" do Kubernetes. Todas as interações passam por ele.
    - **etcd:** O "banco de dados" do cluster, armazena todo o estado e configuração.
    - **Scheduler:** O "agendador", decide em qual nó um novo Pod (contêiner) deve ser executado.
    - **Controller Manager:** O "gerente", executa controladores que garantem que o estado do cluster corresponda ao estado desejado.

2.  **Worker Nodes (Os Músculos):** São as máquinas (servidores) que efetivamente executam as aplicações.
    - **Kubelet:** O agente do Kubernetes em cada nó. Garante que os contêineres descritos nos Pods estejam rodando e saudáveis.
    - **Kube-proxy:** O responsável pela rede, mantendo as regras de comunicação dentro do cluster.
    - **Container Runtime:** O software que executa os contêineres (ex: Docker, containerd).

### Objetos Fundamentais

Você interage com o Kubernetes declarando o estado desejado através de objetos em arquivos YAML.

| Objeto | Descrição | Analogia do Food Truck |
| :--- | :--- | :--- |
| **Pod** | A menor unidade de implantação. É um invólucro para um ou mais contêineres. | O próprio food truck. |
| **Deployment** | Descreve o estado desejado para um conjunto de Pods. Gerencia a criação de réplicas e as atualizações. | O manual que diz: "Eu quero 3 food trucks de hambúrguer sempre funcionando". |
| **Service** | Expõe um conjunto de Pods como um serviço de rede, com um único ponto de acesso (um endereço IP e porta estáveis). | O número de telefone único para delivery, que o gerente direciona para o food truck que estiver livre. |
| **ConfigMap** | Usado para armazenar dados de configuração não sensíveis em pares chave-valor. | O cardápio do food truck. |
| **Secret** | Similar ao ConfigMap, mas projetado para armazenar dados sensíveis, como senhas e chaves de API (armazenados em base64). | O cofre onde a chave do food truck e o dinheiro são guardados. |
| **Ingress** | Gerencia o acesso externo aos Services no cluster, tipicamente HTTP/HTTPS. Pode fornecer balanceamento de carga, terminação SSL e roteamento baseado em nome/host. | O atendente da praça de alimentação que direciona os clientes para a fila do food truck correto com base no que eles pediram. |

### Exemplo Prático: Implantando um Nginx

1.  **Crie um arquivo `deployment.yaml`:**

    ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
    spec:
      replicas: 2 # Queremos 2 instâncias do nosso Nginx
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:1.21
            ports:
            - containerPort: 80
    ```

2.  **Crie um arquivo `service.yaml` para expor o Deployment:**

    ```yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: nginx-service
    spec:
      selector:
        app: nginx # Encontra os Pods com esta label
      ports:
        - protocol: TCP
          port: 80 # Porta do Service
          targetPort: 80 # Porta dos contêineres
      type: LoadBalancer # Expõe o serviço externamente usando um load balancer da nuvem
    ```

3.  **Aplique os arquivos no cluster:**

    ```bash
    # Use o kubectl, a ferramenta de linha de comando do K8s
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    ```
    O Kubernetes agora garante que 2 Pods Nginx estejam sempre rodando e os expõe através de um IP externo acessível.

### Armadilhas Comuns

1.  **Definir `latest` como tag da imagem:** Usar a tag `:latest` é arriscado, pois não garante qual versão da imagem está sendo executada. Sempre use tags de versão específicas (ex: `nginx:1.21.6`).
2.  **Não definir limites de recursos:** Sem limites (`limits`) e requisições (`requests`) de CPU e memória, um único Pod pode consumir todos os recursos de um nó e derrubar outras aplicações.
3.  **Expor o banco de dados publicamente:** Nunca exponha um banco de dados usando um Service do tipo `LoadBalancer` ou `NodePort`. A comunicação com o banco deve ser restrita à rede interna do cluster.

### Boas Práticas

- **Use Declarações em YAML:** Em vez de comandos imperativos (`kubectl run`), armazene a definição dos seus objetos em arquivos YAML e versione-os com Git (Infraestrutura como Código).
- **Health Checks são Essenciais:** Configure `livenessProbe` (para reiniciar contêineres quebrados) e `readinessProbe` (para saber quando um contêiner está pronto para receber tráfego).
- **RBAC (Role-Based Access Control):** Use o controle de acesso baseado em função para garantir que usuários e serviços tenham apenas as permissões estritamente necessárias.
- **Use Helm:** Para aplicações complexas, use o Helm (o gerenciador de pacotes do Kubernetes) para gerenciar, versionar e compartilhar suas configurações.

### Resumo Rápido: Comandos `kubectl` Essenciais

| Comando | Descrição |
| :--- | :--- |
| `kubectl get <objeto>` | Lista recursos (ex: `kubectl get pods`, `kubectl get services`). |
| `kubectl describe <objeto> <nome>` | Mostra detalhes de um recurso (ótimo para debug). |
| `kubectl apply -f <arquivo.yaml>` | Cria ou atualiza um recurso a partir de um arquivo. |
| `kubectl delete -f <arquivo.yaml>` | Remove um recurso definido em um arquivo. |
| `kubectl logs <pod_nome>` | Exibe os logs de um Pod. Use `-f` para acompanhar em tempo real. |
| `kubectl exec -it <pod_nome> -- <comando>` | Executa um comando dentro de um Pod (ex: `sh` para um shell). |
| `kubectl scale deployment <nome> --replicas=<n>` | Escala um Deployment para o número desejado de réplicas. |
| `kubectl rollout status deployment/<nome>` | Acompanha o status de uma atualização (rollout). |
