# Kubernetes Deployment

## Quick Start

```bash
# Deploy everything
./deploy.sh

# Or manually apply in order:
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f postgres-pvc.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f postgres-service.yaml
kubectl apply -f redis-pvc.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f redis-service.yaml
kubectl apply -f app-deployment.yaml
kubectl apply -f app-service.yaml
kubectl apply -f hpa.yaml
kubectl apply -f ingress.yaml
```

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker image pushed to registry
- Update `app-deployment.yaml` with your image registry

## Configuration

1. **Update secrets** in `secret.yaml` - Generate secure tokens
2. **Update image** in `app-deployment.yaml` - Your registry/image:tag
3. **Update domain** in `ingress.yaml` - Your actual domain

## Access Application

```bash
# Port forward
kubectl port-forward service/nestjs-app-service 3001:80 -n nestjs-starter

# Get LoadBalancer IP
kubectl get service nestjs-app-service -n nestjs-starter
```

## Cleanup

```bash
kubectl delete namespace nestjs-starter
```
