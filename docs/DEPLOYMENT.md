# Deployment Guide

## Prerequisites

- AWS Account with EC2 access
- Vercel Account
- MongoDB Atlas Account
- Domain name (optional)
- GitHub repository

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

## 5. Docker Deployment (Alternative)

### Build Images

```bash
# Backend
cd backend
docker build -t orbit-backend .

# Frontend
cd frontend
docker build -t orbit-frontend .
```

### Push to Registry

```bash
# Tag images
docker tag orbit-backend:latest <your-registry>/orbit-backend:latest
docker tag orbit-frontend:latest <your-registry>/orbit-frontend:latest

# Push
docker push <your-registry>/orbit-backend:latest
docker push <your-registry>/orbit-frontend:latest
```

### Deploy with Docker Compose

```bash
# On server
docker-compose -f docker-compose.prod.yml up -d
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
