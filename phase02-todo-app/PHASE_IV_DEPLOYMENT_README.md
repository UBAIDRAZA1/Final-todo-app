# Phase IV: Local Kubernetes Deployment

This phase deploys the Todo application to a local Kubernetes cluster with proper observability.

## Technologies Used
- Docker
- Minikube
- Helm
- kubectl
- Prometheus (monitoring)
- Grafana (visualization)
- Elasticsearch, Fluentd, Kibana (logging)

## Components Deployed

### Application Components
1. **Frontend** - Next.js application
2. **Backend** - FastAPI application
3. **Services** - Internal communication between components
4. **Ingress** - External access to the application

### Observability Components
1. **Monitoring Stack** - Prometheus + Grafana
2. **Logging Stack** - Elasticsearch + Fluentd + Kibana

## Deployment Steps

### Prerequisites
- Docker Desktop with Kubernetes enabled OR Minikube
- kubectl
- Helm
- Git

### Quick Deployment with Script
```bash
# On Windows
.\deploy-minikube.bat

# On Linux/Mac
chmod +x deploy-minikube.sh
./deploy-minikube.sh
```

### Manual Deployment Steps

1. **Start Minikube**:
```bash
minikube start --memory=4096 --cpus=2
minikube addons enable ingress
minikube addons enable metrics-server
```

2. **Build Docker Images**:
```bash
eval $(minikube docker-env)  # On Windows: minikube docker-env --shell powershell | Invoke-Expression
docker build -t todo-frontend:latest ../frontend/
docker build -t todo-backend:latest ../backend/
```

3. **Deploy Application**:
```bash
kubectl apply -f k8s-configmaps-secrets.yaml
kubectl apply -f k8s-frontend-deployment.yaml
kubectl apply -f k8s-backend-deployment.yaml
kubectl apply -f k8s-services.yaml
kubectl apply -f k8s-ingress.yaml
```

4. **Deploy Monitoring**:
```bash
kubectl apply -f k8s-monitoring.yaml
```

5. **Deploy Logging**:
```bash
kubectl apply -f k8s-logging.yaml
```

## Accessing the Application

1. Get Minikube IP:
```bash
minikube ip
```

2. Add to your hosts file:
```
<minikube-ip>  todo.local
```

3. Access the application at: http://todo.local

## Accessing Monitoring and Logging

### Grafana
- Port: 3000 (NodePort)
- Default credentials: admin/admin123

### Kibana
- Port: 5601 (NodePort)
- Access logs and monitor application activity

## Helm Chart

The application can also be deployed using the Helm chart:

```bash
# Install the chart
helm install todo-release ./helm

# Upgrade the chart
helm upgrade todo-release ./helm

# Uninstall the chart
helm uninstall todo-release
```

## Health Checks

The deployments include health checks:
- Liveness probes for service availability
- Readiness probes for traffic routing
- Resource limits and requests for stability

## Scaling

The deployments are configured with 2 replicas for high availability:
- Frontend: 2 replicas
- Backend: 2 replicas

You can scale them manually:
```bash
kubectl scale deployment frontend-deployment --replicas=3
kubectl scale deployment backend-deployment --replicas=3
```

## Cleanup

To remove all resources:
```bash
kubectl delete -f k8s-logging.yaml
kubectl delete -f k8s-monitoring.yaml
kubectl delete -f k8s-ingress.yaml
kubectl delete -f k8s-services.yaml
kubectl delete -f k8s-frontend-deployment.yaml
kubectl delete -f k8s-backend-deployment.yaml
kubectl delete -f k8s-configmaps-secrets.yaml
```