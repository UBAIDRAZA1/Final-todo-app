# Complete Setup Guide for Phase IV: Local Kubernetes Deployment

## Prerequisites Installation

### 1. Install Chocolatey (Windows Package Manager)
Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 2. Install Required Tools via Chocolatey
```powershell
choco install docker-desktop kubernetes-cli minikube helm -y
```

### 3. Restart Your System
After installation, restart your computer to ensure all services start properly.

## Post-Installation Steps

### 1. Start Docker Desktop
- Launch Docker Desktop from the Start menu
- Wait for it to fully start (whale icon in system tray)

### 2. Start Minikube
Open PowerShell as Administrator and run:
```powershell
minikube start --driver=docker --memory=4096 --cpus=2
minikube addons enable ingress
minikube addons enable metrics-server
```

### 3. Navigate to the Project Directory
```powershell
cd C:\Users\Administrator\Downloads\Hackathon ll phase lll\phase02-todo-app
```

### 4. Build Docker Images
```powershell
# Set Docker environment to use Minikube's Docker daemon
minikube docker-env --shell powershell | Invoke-Expression

# Build the frontend image
docker build -t todo-frontend:latest ./frontend/

# Build the backend image
docker build -t todo-backend:latest ./backend/
```

### 5. Deploy the Application
```powershell
# Apply ConfigMaps and Secrets
kubectl apply -f k8s-configmaps-secrets.yaml

# Apply Deployments
kubectl apply -f k8s-frontend-deployment.yaml
kubectl apply -f k8s-backend-deployment.yaml

# Apply Services
kubectl apply -f k8s-services.yaml

# Apply Ingress
kubectl apply -f k8s-ingress.yaml

# Apply Monitoring Stack
kubectl apply -f k8s-monitoring.yaml

# Apply Logging Stack
kubectl apply -f k8s-logging.yaml
```

### 6. Verify the Deployment
```powershell
# Check if all pods are running
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress

# Check monitoring pods
kubectl get pods -n monitoring

# Check logging pods
kubectl get pods -n logging
```

### 7. Access the Application
```powershell
# Get Minikube IP
minikube ip
```

Then add the following line to your Windows hosts file (C:\Windows\System32\drivers\etc\hosts):
```
<MINIKUBE_IP>  todo.local
```

Now you can access the application at: http://todo.local

### 8. Access Monitoring and Logging
```powershell
# Get Grafana URL
minikube service grafana-service -n monitoring

# Get Kibana URL
minikube service kibana -n logging
```

## Alternative: Run the Deployment Script
Instead of manual steps, you can run the automated script:
```powershell
.\deploy-minikube.bat
```

## Troubleshooting
If you encounter any issues:

1. Check if all pods are running:
```powershell
kubectl get pods --all-namespaces
```

2. Check logs of a specific pod:
```powershell
kubectl logs <pod-name>
```

3. If Minikube is having issues:
```powershell
minikube delete
minikube start --driver=docker --memory=4096 --cpus=2
```

4. To stop and clean up:
```powershell
kubectl delete -f k8s-logging.yaml
kubectl delete -f k8s-monitoring.yaml
kubectl delete -f k8s-ingress.yaml
kubectl delete -f k8s-services.yaml
kubectl delete -f k8s-frontend-deployment.yaml
kubectl delete -f k8s-backend-deployment.yaml
kubectl delete -f k8s-configmaps-secrets.yaml
```

## Verification Steps
Once deployed, verify that:
- [ ] All frontend and backend pods are running (green status)
- [ ] Services are accessible
- [ ] Ingress is properly configured
- [ ] You can access the application at http://todo.local
- [ ] Monitoring stack is operational
- [ ] Logging stack is operational

The deployment is now complete! Your Todo application with AI chatbot integration is running in a Kubernetes cluster with full monitoring and logging capabilities.