# Orbit - Project Tracking System

A streamlined project tracking system designed to help teams and individuals monitor tasks, manage deadlines, and visualize progress in real-time.

## 🚀 Features

- **Project Management**: Full CRUD operations for projects
- **Technology Tracking**: Manage and categorize technologies
- **Many-to-Many Mapping**: Link projects with multiple technologies
- **Advanced Search & Filtering**: Find projects by name, status, or technology
- **Deployment Status Monitor**: Track deployment health and status
- **Real-time Updates**: Kafka-based event streaming
- **Caching**: Redis for optimized performance
- **Authentication**: JWT-based secure authentication

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Query (Data Fetching)
- Axios

**Backend:**
- Node.js 18+
- Express
- MongoDB (Mongoose)
- Redis (Caching)
- Kafka (Event Streaming)
- JWT Authentication
- Winston (Logging)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Vercel (Frontend Deployment)
- AWS EC2 (Backend Deployment)

### System Architecture

```
Frontend (Vercel) → API Gateway (Express) → Services (EC2)
                           ↓                      ↓
                      MongoDB Atlas          Redis Cache
                                                  ↓
                                            Kafka Queue
```

## 📦 Installation

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB
- Redis
- Kafka (optional for development)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Orbit
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration

### Backend Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:21011/orbit
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKERS=localhost:9092
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 URLs

### Development

**Frontend:** `http://localhost:3000`

**Backend API:** `http://localhost:5000/api`

**API Base:** `http://localhost:5000/api/v1`

### Infrastructure

**MongoDB:** `mongodb://localhost:21011/orbit`

**Redis:** `localhost:6379`

**Kafka:** `localhost:9092`

### Production

**Frontend:** Vercel (configured in deployment)

**Backend:** AWS EC2 (configured in deployment)

## 📚 API Documentation

### Authentication

**POST** `/api/v1/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST** `/api/v1/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**GET** `/api/v1/auth/me` (Protected)

### Projects

**GET** `/api/v1/projects?search=&status=&technology=&page=1&limit=10` (Protected)

**GET** `/api/v1/projects/:id` (Protected)

**POST** `/api/v1/projects` (Protected)
```json
{
  "name": "Project Name",
  "description": "Project description",
  "status": "active",
  "technologies": ["tech_id_1", "tech_id_2"],
  "deadline": "2024-12-31"
}
```

**PUT** `/api/v1/projects/:id` (Protected)

**DELETE** `/api/v1/projects/:id` (Protected)

### Technologies

**GET** `/api/v1/technologies?category=&search=` (Protected)

**GET** `/api/v1/technologies/:id` (Protected)

**POST** `/api/v1/technologies` (Protected)
```json
{
  "name": "React",
  "category": "frontend",
  "version": "18.2.0",
  "icon": "react-icon-url"
}
```

**PUT** `/api/v1/technologies/:id` (Protected)

**DELETE** `/api/v1/technologies/:id` (Protected)

### Health Check

**GET** `/api/v1/health`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main

### Backend (AWS EC2)

1. SSH into EC2 instance
2. Clone repository
3. Install dependencies
4. Configure environment variables
5. Use PM2 for process management

```bash
pm2 start src/server.js --name orbit-api
pm2 save
pm2 startup
```

## 🔒 Security Features

- Helmet.js for HTTP headers security
- Rate limiting (100 requests per 15 minutes)
- JWT token authentication
- Password hashing with bcrypt
- Input validation with express-validator
- CORS configuration
- Environment variable protection

## 📊 Database Schema

### Users Collection
- email (unique, indexed)
- password (hashed)
- name
- role (admin/user)

### Projects Collection
- name (indexed, text search)
- description (text search)
- status (planning/active/completed/archived)
- deploymentStatus (environment, url, health)
- technologies (array of refs)
- deadline
- createdBy (ref to User)

### Technologies Collection
- name (unique, indexed)
- category (frontend/backend/database/devops)
- version
- icon

## 🔄 CI/CD Pipeline

GitHub Actions workflow:
1. Run tests on push/PR
2. Build frontend and backend
3. Deploy to Vercel (frontend)
4. Deploy to EC2 (backend)

## 📝 Best Practices Implemented

- **12-Factor App Methodology**
- **OWASP Security Guidelines**
- **Clean Code Principles**
- **RESTful API Design**
- **Error Handling & Logging**
- **Caching Strategy**
- **Database Indexing**
- **Code Splitting**
- **Environment-based Configuration**

## 📖 Documentation

Detailed documentation available in the `docs/` folder:

- **[INDEX.md](docs/INDEX.md)** - Documentation navigation guide
- **[SETUP.md](docs/SETUP.md)** - Quick setup instructions
- **[API_DOCS.md](docs/API_DOCS.md)** - Complete API reference
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment guide
- **[TECH_STACK.md](docs/TECH_STACK.md)** - Technology justification
- **[PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Complete deliverables
- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Codebase structure

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License

## 👥 Authors

Your Team

## 🙏 Acknowledgments

- React Team
- Express.js Team
- MongoDB Team
- Open Source Community
