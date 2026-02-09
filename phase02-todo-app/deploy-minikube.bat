@echo off
REM Script to deploy the Todo application to Minikube with all components

echo Starting Minikube deployment for Todo application...

REM Start Minikube if not already running
echo Checking Minikube status...
minikube status
if %errorlevel% neq 0 (
    echo Starting Minikube...
    minikube start --memory=4096 --cpus=2
)

REM Enable required addons
echo Enabling required Minikube addons...
minikube addons enable ingress
minikube addons enable metrics-server

REM Wait a bit for addons to be enabled
timeout /t 10 /nobreak >nul

REM Build Docker images inside Minikube's Docker environment
echo Building Docker images...
FOR /f %%i IN ('minikube docker-env --shell powershell ^| Select-String -Pattern "Environment"') DO SET "DOCKER_ENV_CMD=%%i"
FOR /f "tokens=*" %%i IN ('minikube docker-env --shell powershell') DO %%i
docker build -t todo-frontend:latest ../frontend/
docker build -t todo-backend:latest ../backend/

REM Apply Kubernetes configurations
echo Deploying application components...

REM Apply ConfigMaps and Secrets
kubectl apply -f k8s-configmaps-secrets.yaml

REM Apply deployments
kubectl apply -f k8s-frontend-deployment.yaml
kubectl apply -f k8s-backend-deployment.yaml

REM Apply services
kubectl apply -f k8s-services.yaml

REM Apply ingress
kubectl apply -f k8s-ingress.yaml

REM Create monitoring namespace and deploy monitoring stack
kubectl apply -f k8s-monitoring.yaml

REM Create logging namespace and deploy logging stack
kubectl apply -f k8s-logging.yaml

REM Wait for deployments to be ready
echo Waiting for deployments to be ready...
:wait_loop
kubectl get pods -l app=frontend | findstr "Running" >nul
if %errorlevel% neq 0 (
    timeout /t 5 /nobreak >nul
    goto wait_loop
)
kubectl get pods -l app=backend | findstr "Running" >nul
if %errorlevel% neq 0 (
    timeout /t 5 /nobreak >nul
    goto wait_loop
)

echo Deployments are ready!

REM Display service information
echo Services deployed:
kubectl get services

REM Display ingress information
echo Ingress configuration:
kubectl get ingress

REM Display monitoring information
echo Monitoring stack deployed:
kubectl get pods -n monitoring

REM Display logging information
echo Logging stack deployed:
kubectl get pods -n logging

REM Print Minikube IP for access
FOR /f %%i IN ('minikube ip') DO SET MINIKUBE_IP=%%i
echo Minikube IP: %MINIKUBE_IP%
echo Access the application at: http://todo.local.nip.io (add to hosts file: %MINIKUBE_IP% todo.local)

echo Deployment completed successfully!
echo To access the application, add the following line to your Windows hosts file (C:\Windows\System32\drivers\etc\hosts):
echo %MINIKUBE_IP%  todo.local