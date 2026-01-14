# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Docker Compose (Easiest)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Orbit

# 2. Start all services
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
# Redis: localhost:6379
# Kafka: localhost:9092
```

That's it! The application is running.

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+
- MongoDB running locally or Atlas connection string
- Redis running locally (optional but recommended)

#### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env file
# Update MONGODB_URI with your connection string
# Update JWT_SECRET with a secure random string

# 5. Start development server
npm run dev

# Backend will run on http://localhost:5000
```

#### Frontend Setup

```bash
# 1. Navigate to frontend (in a new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

## 📝 First Steps After Setup

### 1. Register a User

**Via UI:**
- Go to http://localhost:3000
- Click "Sign up"
- Fill in the form
- You'll be automatically logged in

**Via API:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Create a Technology

```bash
curl -X POST http://localhost:5000/api/v1/technologies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "React",
    "category": "frontend",
    "version": "18.2.0"
  }'
```

### 3. Create a Project

```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Project",
    "description": "A test project",
    "status": "active",
    "technologies": ["TECHNOLOGY_ID_HERE"]
  }'
```

## 🔧 Configuration

### Minimum Required Configuration

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:21011/orbit
JWT_SECRET=your-super-secret-key-change-this
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Full Configuration Options

See `.env.example` files in backend and frontend directories.

## 🐛 Troubleshooting

### Port Already in Use

**Backend (5000):**
```bash
# Find process
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

**Frontend (3000):**
```bash
# Change port in vite.config.js
server: {
  port: 3001  // Use different port
}
```

### MongoDB Connection Error

**Check MongoDB is running:**
```bash
# Mac
brew services list

# Linux
sudo systemctl status mongod

# Windows
net start MongoDB
```

**Use MongoDB Atlas:**
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI in .env

### Redis Connection Error

Redis is optional for development. If you see Redis errors:

**Option 1: Install Redis**
```bash
# Mac
brew install redis
brew services start redis

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

**Option 2: Disable Redis**
Comment out Redis-related code in:
- `backend/src/config/redis.js`
- `backend/src/utils/cache.js`

### Kafka Connection Error

Kafka is optional for development. If you see Kafka errors:

**Option 1: Use Docker Compose**
```bash
docker-compose up -d zookeeper kafka
```

**Option 2: Disable Kafka**
Comment out Kafka-related code in:
- `backend/src/config/kafka.js`
- Controllers that use `sendMessage`

## 📚 Next Steps

1. **Explore the UI**
   - Create projects
   - Add technologies
   - Link them together
   - Use search and filters

2. **Read Documentation**
   - `README.md` - Project overview
   - `API_DOCS.md` - API reference
   - `ARCHITECTURE.md` - System design
   - `DEPLOYMENT.md` - Production deployment

3. **Customize**
   - Modify UI components
   - Add new features
   - Extend API endpoints
   - Configure for your needs

4. **Deploy**
   - Follow `DEPLOYMENT.md`
   - Deploy frontend to Vercel
   - Deploy backend to EC2
   - Configure production database

## 🎯 Common Tasks

### Add a New API Endpoint

1. Create route in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Add route to `backend/src/server.js`

### Add a New Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Layout.jsx`

### Add a New Model

1. Create schema in `backend/src/models/`
2. Create controller for CRUD operations
3. Create routes
4. Update frontend services

## 🔐 Security Notes

### Development
- Default JWT secret is insecure
- CORS is open to localhost
- Rate limiting is lenient

### Production
- Generate strong JWT secret: `openssl rand -base64 32`
- Configure CORS for your domain only
- Adjust rate limits based on traffic
- Use HTTPS everywhere
- Enable MongoDB authentication
- Use Redis password
- Configure firewall rules

## 📊 Monitoring

### Check Application Health

```bash
curl http://localhost:5000/api/v1/health
```

### View Logs

**Backend:**
```bash
# Development
npm run dev  # Logs to console

# Production with PM2
pm2 logs orbit-api
```

**Frontend:**
```bash
# Check browser console
# Or Vercel dashboard in production
```

### Database

```bash
# Connect to MongoDB
mongosh mongodb://localhost:21011/orbit

# View collections
show collections

# Count documents
db.projects.countDocuments()
db.users.countDocuments()
```

## 🆘 Getting Help

1. **Check Documentation**
   - All .md files in root directory
   - Inline code comments

2. **Common Issues**
   - See Troubleshooting section above
   - Check GitHub Issues

3. **Debug Mode**
   ```bash
   # Backend
   NODE_ENV=development npm run dev
   
   # Frontend
   npm run dev  # Vite shows detailed errors
   ```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Can register a new user
- [ ] Can login
- [ ] Can create a project
- [ ] Can create a technology
- [ ] Can view dashboard
- [ ] API responds to requests
- [ ] Database stores data
- [ ] No console errors

## 🎉 Success!

If all checks pass, you're ready to develop!

**Happy coding! 🚀**
