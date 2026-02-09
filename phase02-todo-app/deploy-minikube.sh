#!/bin/bash

# Script to deploy the Todo application to Minikube with all components

echo "Starting Minikube deployment for Todo application..."

# Start Minikube if not already running
echo "Checking Minikube status..."
minikube status || {
    echo "Starting Minikube..."
    minikube start --memory=4096 --cpus=2
}

# Enable required addons
echo "Enabling required Minikube addons..."
minikube addons enable ingress
minikube addons enable metrics-server

# Wait a bit for addons to be enabled
sleep 10

# Build Docker images inside Minikube's Docker environment
echo "Building Docker images..."
eval $(minikube docker-env)
docker build -t todo-frontend:latest ../frontend/
docker build -t todo-backend:latest ../backend/

# Apply Kubernetes configurations
echo "Deploying application components..."

# Apply ConfigMaps and Secrets
kubectl apply -f k8s-configmaps-secrets.yaml

# Apply deployments
kubectl apply -f k8s-frontend-deployment.yaml
kubectl apply -f k8s-backend-deployment.yaml

# Apply services
kubectl apply -f k8s-services.yaml

# Apply ingress
kubectl apply -f k8s-ingress.yaml

# Create monitoring namespace and deploy monitoring stack
kubectl apply -f k8s-monitoring.yaml

# Create logging namespace and deploy logging stack
kubectl apply -f k8s-logging.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend -n default --timeout=180s
kubectl wait --for=condition=ready pod -l app=backend -n default --timeout=180s

echo "Deployments are ready!"

# Display service information
echo "Services deployed:"
kubectl get services

# Display ingress information
echo "Ingress configuration:"
kubectl get ingress

# Display monitoring information
echo "Monitoring stack deployed:"
kubectl get pods -n monitoring

# Display logging information
echo "Logging stack deployed:"
kubectl get pods -n logging

# Print Minikube IP for access
MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"
echo "Access the application at: http://todo.local.nip.io (add to /etc/hosts: $MINIKUBE_IP todo.local)"

echo "Deployment completed successfully!"
echo "To access the application, add the following line to your hosts file:"
echo "$MINIKUBE_IP  todo.local"