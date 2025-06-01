# Kubernetes Deployment

Simple 2-file Kubernetes setup for NestJS Starter.

## Files

- `deployment.yaml` - All Kubernetes resources in one file
- `deploy.sh` - Simple deployment script

## Quick Start

1. **Update the Docker image** in `deployment.yaml`:
   ```yaml
   image: your-registry/nestjs-starter:latest
   ```

2. **Deploy**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Access the app**:
   ```bash
   kubectl port-forward service/nestjs-starter-service 3001:80 -n nestjs-starter
   ```

   Visit: http://localhost:3001

## What's Included

- ✅ Namespace
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ NestJS app (2 replicas)
- ✅ LoadBalancer service

## Commands

```bash
# Check status
kubectl get pods -n nestjs-starter

# View logs
kubectl logs -f deployment/nestjs-app -n nestjs-starter

# Delete everything
kubectl delete namespace nestjs-starter
```

That's it! 🎉
