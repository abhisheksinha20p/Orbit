# Deployment Guide

This comprehensive guide covers deploying the Orbit Project Tracking System to production environments using various deployment strategies.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment (Recommended)](#docker-deployment-recommended)
4. [Cloud Deployment](#cloud-deployment)
5. [Monitoring & Maintenance](#monitoring--maintenance)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts & Services
- Docker & Docker Compose installed
- MongoDB Atlas Account (or self-hosted MongoDB)
- Domain name (optional but recommended)
- GitHub repository
- Cloud provider account (AWS/GCP/Azure) or Vercel for frontend

### System Requirements
- **Development**: 4GB RAM, 2 CPU cores
- **Production**: 8GB RAM, 4 CPU cores (minimum)
- **Storage**: 20GB minimum
- **OS**: Ubuntu 22.04 LTS (recommended) or any Docker-compatible OS

## 1. MongoDB Atlas Setup

### Create Cluster

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier for testing, M10+ for production)
3. Configure network access:
   - Add your IP address
   - Add EC2 instance IP (after creation)
4. Create database user with read/write permissions
5. Get connection string

### Database Configuration

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/orbit?retryWrites=true&w=majority
```

## 2. Backend Deployment (AWS EC2)

### Launch EC2 Instance

1. **Choose AMI**: Ubuntu Server 22.04 LTS
2. **Instance Type**: t3.medium (2 vCPU, 4GB RAM)
3. **Configure Security Group**:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (5000) - Anywhere (or specific IPs)
4. **Create/Select Key Pair**: Download .pem file
5. **Launch Instance**

### Server Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Clone repository
cd /home/ubuntu
git clone <your-repo-url> orbit
cd orbit/backend

# Install dependencies
npm ci --only=production

# Create .env file
nano .env
```

### Environment Configuration

```env
NODE_ENV=production
PORT=5000
MONGODB_URI_PROD=mongodb+srv://<user>:<pass>@cluster.mongodb.net/orbit
JWT_SECRET=<generate-strong-secret>
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKERS=localhost:9092
CORS_ORIGIN=https://your-frontend-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Install Redis

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### Install Kafka (Optional)

```bash
# Download Kafka
wget https://downloads.apache.org/kafka/3.6.0/kafka_2.13-3.6.0.tgz
tar -xzf kafka_2.13-3.6.0.tgz
cd kafka_2.13-3.6.0

# Start Zookeeper
bin/zookeeper-server-start.sh -daemon config/zookeeper.properties

# Start Kafka
bin/kafka-server-start.sh -daemon config/server.properties
```

### Start Application with PM2

```bash
cd /home/ubuntu/orbit/backend

# Start application
pm2 start src/server.js --name orbit-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs

# Monitor logs
pm2 logs orbit-api

# Check status
pm2 status
```

### Setup Nginx Reverse Proxy (Optional)

```bash
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/orbit
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/orbit /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

## 3. Frontend Deployment (Vercel)

### Vercel Setup

1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://api.yourdomain.com/api
```

Or for EC2 without domain:

```
VITE_API_URL=http://<ec2-public-ip>:5000/api
```

### Deploy

1. Push to main branch
2. Vercel automatically builds and deploys
3. Access your app at `https://your-project.vercel.app`

### Custom Domain (Optional)

1. Add domain in Vercel dashboard
2. Configure DNS records:
   - Type: CNAME
   - Name: www (or @)
   - Value: cname.vercel-dns.com

## 4. GitHub Actions Setup

### Create Secrets

In GitHub repository settings → Secrets and variables → Actions:

**Backend Deployment:**
- `EC2_SSH_KEY`: Content of your .pem file
- `EC2_HOST`: EC2 public IP or domain
- `EC2_USER`: ubuntu

**Frontend Deployment:**
- `VERCEL_TOKEN`: From Vercel account settings
- `VERCEL_ORG_ID`: From Vercel project settings
- `VERCEL_PROJECT_ID`: From Vercel project settings

### Workflow Configuration

The `.github/workflows/ci-cd.yml` file is already configured.

Push to main branch triggers:
1. Run tests
2. Build applications
3. Deploy to production

## 5. Docker Deployment (Recommended for Development)

### Prerequisites

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Development Environment Setup

#### 1. Clone Repository

```bash
git clone <your-repo-url> orbit
cd orbit
```

#### 2. Configure Environment Variables

**Backend (.env in backend/):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/orbit
JWT_SECRET=your-development-secret-key-change-in-production
REDIS_HOST=redis
REDIS_PORT=6379
KAFKA_BROKERS=kafka:9092
CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Frontend (.env in frontend/):**
```env
VITE_API_URL=http://localhost:5000/api
```

#### 3. Start Services with Docker Compose

```bash
# Start all services (frontend, backend, MongoDB, Redis, Kafka)
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Check service status
docker-compose ps
```

#### 4. Access Applications

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/v1/health
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Kafka**: localhost:9092

#### 5. Development Workflow

```bash
# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart specific service
docker-compose restart backend

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (clean slate)
docker-compose down -v
```

### Production Environment Setup

#### 1. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      - VITE_API_URL=https://api.yourdomain.com/api
    restart: unless-stopped
    networks:
      - orbit-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI_PROD}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_HOST=redis
      - KAFKA_BROKERS=kafka:9092
    depends_on:
      - mongodb
      - redis
      - kafka
    restart: unless-stopped
    networks:
      - orbit-network

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped
    networks:
      - orbit-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    restart: unless-stopped
    networks:
      - orbit-network

  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    restart: unless-stopped
    networks:
      - orbit-network

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    restart: unless-stopped
    networks:
      - orbit-network

volumes:
  mongodb_data:
  redis_data:

networks:
  orbit-network:
    driver: bridge
```

#### 2. Production Environment Variables

Create `.env.prod`:

```env
# MongoDB
MONGO_USERNAME=orbit_admin
MONGO_PASSWORD=<strong-password>
MONGODB_URI_PROD=mongodb://orbit_admin:<strong-password>@mongodb:27017/orbit?authSource=admin

# Backend
JWT_SECRET=<generate-strong-secret-256-bit>
NODE_ENV=production

# Frontend
VITE_API_URL=https://api.yourdomain.com/api
```

#### 3. Deploy to Production

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Docker Image Management

#### Build Individual Images

```bash
# Backend
cd backend
docker build -t orbit-backend:latest .
docker build -t orbit-backend:v2.0.0 .

# Frontend
cd frontend
docker build -t orbit-frontend:latest .
docker build -t orbit-frontend:v2.0.0 .
```

#### Push to Docker Registry

```bash
# Tag for Docker Hub
docker tag orbit-backend:latest yourusername/orbit-backend:latest
docker tag orbit-frontend:latest yourusername/orbit-frontend:latest

# Push to Docker Hub
docker login
docker push yourusername/orbit-backend:latest
docker push yourusername/orbit-frontend:latest

# Or tag for AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag orbit-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/orbit-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/orbit-backend:latest
```

### Container Management

#### Useful Docker Commands

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View container logs
docker logs <container-id>
docker logs -f <container-id>  # Follow logs

# Execute command in container
docker exec -it <container-id> bash
docker exec -it <container-id> sh

# View container resource usage
docker stats

# Inspect container
docker inspect <container-id>

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

#### Docker Compose Commands

```bash
# Scale services
docker-compose up -d --scale backend=3

# Update service
docker-compose up -d --no-deps --build backend

# View service logs
docker-compose logs -f --tail=100 backend

# Execute command in service
docker-compose exec backend npm run seed

# Stop specific service
docker-compose stop backend

# Remove service
docker-compose rm backend
```

### Health Checks

Add health checks to docker-compose.yml:

```yaml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  mongodb:
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5
      start_period: 40s

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
```

### Troubleshooting Docker Deployment

#### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check if port is in use
sudo lsof -i :5000
sudo netstat -tulpn | grep 5000

# Restart service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build --force-recreate backend
```

#### Database Connection Issues

```bash
# Check MongoDB container
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check network
docker network ls
docker network inspect orbit_orbit-network
```

#### Redis Connection Issues

```bash
# Check Redis container
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping

# Check Redis keys
docker-compose exec redis redis-cli keys '*'
```

#### Volume Issues

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect orbit_mongodb_data

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Backup volume
docker run --rm -v orbit_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

#### Network Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect orbit_orbit-network

# Recreate network
docker-compose down
docker network rm orbit_orbit-network
docker-compose up -d
```

### Performance Optimization

#### Resource Limits

Add to docker-compose.yml:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  mongodb:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
```

#### Logging Configuration

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Backup and Restore

#### Backup MongoDB

```bash
# Backup
docker-compose exec mongodb mongodump --out=/backup
docker cp orbit_mongodb_1:/backup ./mongodb-backup

# Or use volume backup
docker run --rm -v orbit_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-$(date +%Y%m%d).tar.gz /data
```

#### Restore MongoDB

```bash
# Restore from dump
docker cp ./mongodb-backup orbit_mongodb_1:/backup
docker-compose exec mongodb mongorestore /backup

# Or restore from volume backup
docker run --rm -v orbit_mongodb_data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb-20260115.tar.gz -C /
```

### Security Best Practices

1. **Use secrets for sensitive data**
2. **Don't expose unnecessary ports**
3. **Use non-root users in containers**
4. **Scan images for vulnerabilities**
5. **Keep images updated**
6. **Use specific image tags, not 'latest'**
7. **Enable Docker Content Trust**

```bash
# Scan image for vulnerabilities
docker scan orbit-backend:latest

# Enable Docker Content Trust
export DOCKER_CONTENT_TRUST=1
```

### Monitoring Docker Containers

```bash
# Real-time stats
docker stats

# Container resource usage
docker-compose top

# System-wide information
docker system df

# Events
docker events

# With monitoring tools
docker run -d -p 9090:9090 -v /var/run/docker.sock:/var/run/docker.sock google/cadvisor
```


## 6. Monitoring Setup

### CloudWatch (AWS)

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

### PM2 Monitoring

```bash
# Link PM2 to PM2.io (optional)
pm2 link <secret-key> <public-key>

# Monitor in terminal
pm2 monit
```

### Application Logs

```bash
# View logs
pm2 logs orbit-api

# Log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 7. Backup Strategy

### Database Backups

MongoDB Atlas provides automatic backups. Configure:
- Backup frequency: Daily
- Retention: 7 days minimum
- Point-in-time recovery: Enable

### Application Backups

```bash
# Create backup script
nano /home/ubuntu/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/orbit-backend-$DATE.tar.gz /home/ubuntu/orbit/backend

# Keep only last 7 backups
ls -t $BACKUP_DIR/orbit-backend-*.tar.gz | tail -n +8 | xargs rm -f
```

```bash
# Make executable
chmod +x /home/ubuntu/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /home/ubuntu/backup.sh
```

## 8. Security Hardening

### Firewall Configuration

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow application port (if not using Nginx)
sudo ufw allow 5000/tcp

# Check status
sudo ufw status
```

### Fail2Ban

```bash
# Install
sudo apt install -y fail2ban

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Start service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Update Security Group

In AWS Console:
- Restrict SSH to your IP only
- Use security groups for service-to-service communication

## 9. Performance Optimization

### Enable Compression

Already configured in Express with `compression` middleware.

### Database Indexes

Indexes are created automatically via Mongoose schemas.

### Redis Configuration

```bash
# Edit Redis config
sudo nano /etc/redis/redis.conf

# Set max memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis-server
```

## 10. Troubleshooting

### Check Application Status

```bash
pm2 status
pm2 logs orbit-api --lines 100
```

### Check Database Connection

```bash
# Test MongoDB connection
node -e "require('mongoose').connect('your-connection-string').then(() => console.log('Connected')).catch(err => console.error(err))"
```

### Check Redis

```bash
redis-cli ping
# Should return: PONG
```

### Check Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Common Issues

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**PM2 not starting:**
```bash
pm2 delete orbit-api
pm2 start src/server.js --name orbit-api
```

**Database connection timeout:**
- Check MongoDB Atlas network access
- Verify connection string
- Check security group rules

## 11. Rollback Procedure

### Application Rollback

```bash
cd /home/ubuntu/orbit
git log --oneline
git checkout <previous-commit-hash>
cd backend
npm ci --only=production
pm2 restart orbit-api
```

### Database Rollback

Use MongoDB Atlas point-in-time recovery from the Atlas dashboard.

## 12. Scaling Considerations

### Vertical Scaling

Upgrade EC2 instance type:
1. Stop instance
2. Change instance type
3. Start instance

### Horizontal Scaling

1. Create AMI from current instance
2. Launch multiple instances from AMI
3. Setup Application Load Balancer
4. Configure health checks
5. Update DNS to point to ALB

### Database Scaling

1. Upgrade MongoDB Atlas cluster tier
2. Enable read replicas
3. Configure connection pooling

## Support

For issues, contact your DevOps team or create an issue in the repository.
