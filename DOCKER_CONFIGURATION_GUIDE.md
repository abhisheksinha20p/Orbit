# Docker Configuration Guide - Orbit Project

## Overview

This guide explains how the Orbit project is configured to work correctly with Docker, ensuring the frontend always connects to the correct backend API URL.

## The Problem We Solved

### Initial Issue
When building the frontend with Docker, Vite (the build tool) bakes environment variables into the JavaScript bundle at **build time**, not runtime. This means:

1. If `.env.production` contains `VITE_API_URL=https://api.yourdomain.com/api/v1`
2. The frontend Docker build will use that production URL
3. Even when running locally with `docker-compose up`, the frontend tries to connect to the production URL
4. Result: Login fails with CORS errors because it's trying to reach a non-existent production server

### Root Cause
- Vite replaces `import.meta.env.VITE_API_URL` with the actual value during build
- Docker builds create a static bundle that can't be changed after build
- The `.env` file in the project directory is NOT used during Docker builds

## The Solution

We implemented a **multi-layered approach** to ensure the correct API URL is always used:

### 1. Dockerfile with Build Arguments

**File**: `frontend/Dockerfile`

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Set API URL for build - can be overridden by docker-compose
ARG VITE_API_URL=http://localhost:5000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Key Points:**
- `ARG VITE_API_URL=http://localhost:5000/api/v1` - Defines a build argument with a default value
- `ENV VITE_API_URL=$VITE_API_URL` - Makes it available as an environment variable during build
- Default value ensures local development works out of the box

### 2. Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
frontend:
  build:
    context: ./frontend
    args:
      VITE_API_URL: http://localhost:5000/api/v1
  container_name: orbit-frontend
  ports:
    - "3000:80"
  depends_on:
    - backend
```

**Key Points:**
- `build.args` passes the API URL to the Dockerfile
- This value overrides the default in the Dockerfile
- Ensures consistent configuration across all builds

### 3. Environment Files for Different Scenarios

#### Local Development (Non-Docker)
**File**: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
```

#### Production Deployment
**File**: `frontend/.env.production`
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_APP_NAME=Orbit
VITE_APP_VERSION=2.1.0
NODE_ENV=production
```

## How It Works

### Development Workflow

1. **Local Development (without Docker)**:
   ```bash
   cd frontend
   npm run dev
   ```
   - Uses `frontend/.env`
   - API URL: `http://localhost:5000/api/v1`

2. **Docker Development**:
   ```bash
   docker-compose up -d --build
   ```
   - Uses build args from `docker-compose.yml`
   - API URL: `http://localhost:5000/api/v1`
   - Frontend accessible at: `http://localhost:3000`

3. **Production Build**:
   ```bash
   docker build --build-arg VITE_API_URL=https://api.yourdomain.com/api/v1 -t orbit-frontend:prod ./frontend
   ```
   - Overrides default with production URL
   - API URL: `https://api.yourdomain.com/api/v1`

## Configuration Priority

The API URL is determined in this order (highest to lowest priority):

1. **Docker build args** (from `docker-compose.yml` or `docker build --build-arg`)
2. **Dockerfile ARG default** (`http://localhost:5000/api/v1`)
3. **Environment files** (`.env`, `.env.production`) - only for non-Docker builds

## Verification

### Check Current Configuration

1. **Inspect Docker Image**:
   ```bash
   docker inspect orbit-frontend
   ```

2. **Check Built Files**:
   ```bash
   docker run --rm orbit-frontend cat /usr/share/nginx/html/assets/index-*.js | grep -o "http[s]*://[^\"]*api"
   ```

3. **Test API Connection**:
   - Open browser to `http://localhost:3000`
   - Open DevTools Console
   - Try to register/login
   - Check Network tab for API calls - should go to `http://localhost:5000/api/v1`

## Troubleshooting

### Problem: Frontend still uses wrong API URL after rebuild

**Solution**:
```bash
# Remove old images
docker-compose down
docker rmi orbit-frontend

# Rebuild with no cache
docker-compose build --no-cache frontend
docker-compose up -d
```

### Problem: CORS errors

**Causes**:
1. Frontend trying to connect to wrong URL
2. Backend CORS not configured for frontend origin

**Check**:
```bash
# Check backend logs
docker logs orbit-backend --tail 50

# Verify CORS_ORIGIN in docker-compose.yml includes your frontend URL
```

### Problem: Changes to .env not reflected

**Remember**: `.env` files are NOT used in Docker builds!

**Solution**: Update `docker-compose.yml` build args instead:
```yaml
frontend:
  build:
    context: ./frontend
    args:
      VITE_API_URL: http://your-new-url/api/v1
```

## Best Practices

### 1. Never Hardcode URLs in Code
❌ **Bad**:
```javascript
const API_URL = 'http://localhost:5000/api/v1';
```

✅ **Good**:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

### 2. Use Environment-Specific Configurations

- **Development**: `http://localhost:5000/api/v1`
- **Staging**: `https://api-staging.yourdomain.com/api/v1`
- **Production**: `https://api.yourdomain.com/api/v1`

### 3. Document Configuration Changes

Always update this guide when changing:
- Dockerfile build args
- docker-compose.yml configuration
- Environment variable names

### 4. Test After Configuration Changes

```bash
# Full rebuild and test
docker-compose down
docker-compose build --no-cache
docker-compose up -d
# Test registration and login
```

## Production Deployment

### Option 1: Docker Compose (Recommended for VPS)

```bash
# Update docker-compose.yml with production URL
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Separate Build and Deploy

```bash
# Build with production URL
docker build \
  --build-arg VITE_API_URL=https://api.yourdomain.com/api/v1 \
  -t orbit-frontend:v2.1.0 \
  ./frontend

# Push to registry
docker tag orbit-frontend:v2.1.0 yourusername/orbit-frontend:v2.1.0
docker push yourusername/orbit-frontend:v2.1.0

# Deploy on production server
docker pull yourusername/orbit-frontend:v2.1.0
docker run -d -p 80:80 yourusername/orbit-frontend:v2.1.0
```

### Option 3: CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
- name: Build Frontend
  run: |
    docker build \
      --build-arg VITE_API_URL=${{ secrets.PRODUCTION_API_URL }} \
      -t orbit-frontend:${{ github.sha }} \
      ./frontend
```

## Summary

✅ **What We Fixed**:
- Frontend now uses correct API URL in Docker
- Configuration is explicit and documented
- Works consistently across rebuilds

✅ **How We Fixed It**:
- Added build args to Dockerfile
- Configured docker-compose.yml with explicit API URL
- Created comprehensive documentation

✅ **Why It Won't Break Again**:
- Build args are version controlled in docker-compose.yml
- Default value in Dockerfile ensures it always works
- This documentation explains the entire system

## Quick Reference

### Common Commands

```bash
# Start everything
docker-compose up -d

# Rebuild frontend only
docker-compose up -d --build frontend

# Full clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker logs orbit-frontend
docker logs orbit-backend

# Verify API URL in built files
docker exec orbit-frontend cat /usr/share/nginx/html/assets/index-*.js | grep -o "http[s]*://[^\"]*api"
```

### Configuration Files

| File | Purpose | Used When |
|------|---------|-----------|
| `frontend/.env` | Local dev (non-Docker) | `npm run dev` |
| `frontend/.env.production` | Production reference | Manual builds |
| `frontend/Dockerfile` | Docker build config | Docker builds |
| `docker-compose.yml` | Local Docker config | `docker-compose up` |

---

**Last Updated**: January 15, 2026  
**Version**: 2.1.0  
**Maintainer**: Orbit Development Team
