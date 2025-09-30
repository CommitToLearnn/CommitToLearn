# Kubernetes

Kubernetes é uma plataforma de orquestração de containers que automatiza o deployment, scaling e gerenciamento de aplicações containerizadas.

## Conceito Básico
- Orquestração de containers em escala
- Automação de deployment e scaling
- Self-healing e service discovery
- Declarative configuration
- Portabilidade entre clouds

## Arquitetura do Kubernetes

### Control Plane (Master)
```
┌─────────────────────────────────────────┐
│              Control Plane              │
├─────────────┬─────────────┬─────────────┤
│  API Server │    etcd     │  Scheduler  │
├─────────────┼─────────────┼─────────────┤
│ Controller  │ Cloud Ctrl  │    ...      │
│  Manager    │  Manager    │             │
└─────────────┴─────────────┴─────────────┘
```

### Worker Nodes
```
┌─────────────────────────────────────────┐
│               Worker Node               │
├─────────────┬─────────────┬─────────────┤
│   kubelet   │ kube-proxy  │ Container   │
│             │             │  Runtime    │
├─────────────┴─────────────┴─────────────┤
│                 Pods                    │
└─────────────────────────────────────────┘
```

## Componentes Principais

### Control Plane
- **API Server**: Interface central do Kubernetes
- **etcd**: Banco de dados distribuído para estado do cluster
- **Scheduler**: Decide onde pods devem executar
- **Controller Manager**: Executa controllers que regulam estado
- **Cloud Controller Manager**: Integração com cloud providers

### Worker Nodes
- **kubelet**: Agente que executa pods nos nodes
- **kube-proxy**: Proxy de rede para services
- **Container Runtime**: Docker, containerd, CRI-O

## Objetos Fundamentais

### Pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.20
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
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
        image: nginx:1.20
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "postgres://db:5432/myapp"
  debug: "true"
  config.yaml: |
    server:
      port: 8080
      host: 0.0.0.0
```

### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  username: YWRtaW4=  # base64 encoded
  password: MWYyZDFlMmU2N2Rm  # base64 encoded
```

## Comandos kubectl

### Cluster Management
```bash
# Ver informações do cluster
kubectl cluster-info

# Ver nodes
kubectl get nodes -o wide

# Descrever node
kubectl describe node node-name

# Ver todos os recursos
kubectl get all --all-namespaces
```

### Pod Management
```bash
# Listar pods
kubectl get pods -o wide

# Descrever pod
kubectl describe pod pod-name

# Ver logs
kubectl logs pod-name -f

# Executar comando no pod
kubectl exec -it pod-name -- /bin/bash

# Port forward
kubectl port-forward pod-name 8080:80

# Deletar pod
kubectl delete pod pod-name
```

### Deployment Management
```bash
# Criar deployment
kubectl create deployment nginx --image=nginx

# Escalar deployment
kubectl scale deployment nginx --replicas=5

# Atualizar imagem
kubectl set image deployment/nginx nginx=nginx:1.21

# Ver rollout status
kubectl rollout status deployment/nginx

# Rollback
kubectl rollout undo deployment/nginx

# Ver histórico
kubectl rollout history deployment/nginx
```

### Service Management
```bash
# Expor deployment
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# Ver services
kubectl get services

# Ver endpoints
kubectl get endpoints

# Deletar service
kubectl delete service nginx
```

## Configuração e Secrets

### ConfigMaps
```bash
# Criar ConfigMap de arquivo
kubectl create configmap app-config --from-file=config.yaml

# Criar ConfigMap de literal
kubectl create configmap app-config --from-literal=key1=value1

# Usar ConfigMap em Pod
spec:
  containers:
  - name: app
    env:
    - name: CONFIG_KEY
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: key1
```

### Secrets
```bash
# Criar Secret
kubectl create secret generic app-secret \
  --from-literal=username=admin \
  --from-literal=password=secret

# Usar Secret em Pod
spec:
  containers:
  - name: app
    env:
    - name: USERNAME
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: username
```

## Networking

### Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80
```

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

## Storage

### PersistentVolume
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-storage
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  hostPath:
    path: /data/pv-storage
```

### PersistentVolumeClaim
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-storage
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: fast-ssd
```

## Helm Package Manager

### Básico do Helm
```bash
# Adicionar repositório
helm repo add stable https://charts.helm.sh/stable

# Atualizar repositórios
helm repo update

# Buscar charts
helm search repo nginx

# Instalar chart
helm install my-nginx stable/nginx-ingress

# Listar releases
helm list

# Upgrade
helm upgrade my-nginx stable/nginx-ingress

# Uninstall
helm uninstall my-nginx
```

### Chart Structure
```
mychart/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── charts/
```

## Monitoramento e Observabilidade

### Métricas com Prometheus
```yaml
apiVersion: v1
kind: Service
metadata:
  name: app-metrics
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/metrics"
spec:
  ports:
  - port: 8080
    name: metrics
  selector:
    app: myapp
```

### Health Checks
```yaml
spec:
  containers:
  - name: app
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

## Boas Práticas

### Resource Management
```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"
  limits:
    memory: "128Mi"
    cpu: "500m"
```

### Security
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
```

### Labels e Annotations
```yaml
metadata:
  labels:
    app: myapp
    version: v1.0
    environment: production
  annotations:
    deployment.kubernetes.io/revision: "1"
```

## Troubleshooting

### Debug Commands
```bash
# Ver eventos
kubectl get events --sort-by=.metadata.creationTimestamp

# Debug pod
kubectl describe pod pod-name
kubectl logs pod-name --previous

# Debug service
kubectl get endpoints service-name
kubectl describe service service-name

# Debug node
kubectl describe node node-name
kubectl top node
kubectl top pod
```

### Common Issues
```bash
# ImagePullBackOff
kubectl describe pod pod-name
# Check image name and registry access

# CrashLoopBackOff
kubectl logs pod-name --previous
# Check application logs and health checks

# Pending pods
kubectl describe pod pod-name
# Check resource constraints and node capacity
```

## Casos de Uso
- **Microservices**: Orquestração de arquiteturas distribuídas
- **CI/CD**: Deployment automatizado
- **Auto-scaling**: Scaling baseado em métricas
- **Multi-cloud**: Portabilidade entre providers
- **Disaster Recovery**: Backup e restore automatizados
- **Development**: Ambientes efêmeros para desenvolvimento
