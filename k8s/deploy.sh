#!/bin/bash

set -e

echo "🚀 Deploying NestJS Starter to Kubernetes..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed. Please install kubectl first.${NC}"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Kubernetes cluster is accessible${NC}"

# Create namespace
echo -e "${YELLOW}📦 Creating namespace...${NC}"
kubectl apply -f namespace.yaml

# Apply ConfigMap and Secrets
echo -e "${YELLOW}🔧 Applying ConfigMap...${NC}"
kubectl apply -f configmap.yaml

echo -e "${YELLOW}🔐 Applying Secrets...${NC}"
echo -e "${RED}⚠️  WARNING: Update the secrets in secret.yaml before deploying to production!${NC}"
kubectl apply -f secret.yaml

# Deploy PostgreSQL
echo -e "${YELLOW}🐘 Deploying PostgreSQL...${NC}"
kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=postgres -n nestjs-starter --timeout=300s

# Deploy Redis
echo -e "${YELLOW}🔴 Deploying Redis...${NC}"
kubectl apply -f redis-pvc.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml

# Wait for Redis to be ready
echo -e "${YELLOW}⏳ Waiting for Redis to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=redis -n nestjs-starter --timeout=300s

# Deploy Application
echo -e "${YELLOW}🚀 Deploying NestJS Application...${NC}"
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml

# Wait for application to be ready
echo -e "${YELLOW}⏳ Waiting for application to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=nestjs-app -n nestjs-starter --timeout=300s

# Apply HPA (optional)
echo -e "${YELLOW}📊 Applying Horizontal Pod Autoscaler...${NC}"
kubectl apply -f hpa.yaml

# Apply Ingress (optional)
echo -e "${YELLOW}🌐 Applying Ingress...${NC}"
echo -e "${RED}⚠️  Update the host in ingress.yaml to your domain before using in production${NC}"
kubectl apply -f ingress.yaml

# Display deployment status
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📊 Deployment Status:${NC}"
kubectl get pods -n nestjs-starter
echo ""
kubectl get services -n nestjs-starter
echo ""
echo -e "${GREEN}🎉 NestJS Starter is now running on Kubernetes!${NC}"
echo ""
echo -e "${YELLOW}To access the application:${NC}"
echo "1. Port forward: kubectl port-forward service/nestjs-app-service 3001:80 -n nestjs-starter"
echo "2. LoadBalancer: kubectl get service nestjs-app-service -n nestjs-starter"
echo "3. Ingress: Configure your domain DNS to point to the ingress controller"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "- View logs: kubectl logs -f deployment/nestjs-app -n nestjs-starter"
echo "- Get pods: kubectl get pods -n nestjs-starter"
echo "- Describe pod: kubectl describe pod <pod-name> -n nestjs-starter"
echo "- Delete deployment: kubectl delete namespace nestjs-starter"
