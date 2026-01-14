# Orbit - Project Tracking System

A modern, streamlined project tracking system with a stunning glassmorphism UI, designed to help teams and individuals monitor tasks, manage deadlines, and visualize progress in real-time.

![Orbit Dashboard](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Stunning glass-effect UI with vibrant gradients
- **Interactive Dashboard** - Real-time analytics with Pie, Bar, and Line charts
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- **Dark Mode Ready** - Beautiful gradient backgrounds with glassmorphism effects

### 📊 Project Management
- **Full CRUD Operations** - Create, read, update, and delete projects
- **Advanced Filtering** - Search by name, status, or technology
- **Status Tracking** - Planning, Active, Completed, Archived states
- **Technology Mapping** - Link projects with multiple technologies
- **Visual Analytics** - Charts showing project distribution and trends

### 🔐 Security & Performance
- **JWT Authentication** - Secure token-based authentication
- **Redis Caching** - Optimized performance with intelligent caching
- **Rate Limiting** - Protection against abuse (100 req/15min)
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Express-validator for all inputs

### 🚀 Real-time Features
- **Kafka Event Streaming** - Real-time updates and notifications
- **Toast Notifications** - Instant feedback for all actions
- **Live Dashboard** - Auto-updating statistics and charts

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS (Custom Design System)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Zustand (State Management)
- React Query (Data Fetching)
- React Hot Toast (Notifications)
- Lucide React (Icons)

**Backend:**
- Node.js 18+ with Express
- MongoDB with Mongoose
- Redis (Caching Layer)
- Kafka (Event Streaming)
- JWT Authentication
- Winston (Logging)
- Helmet (Security)

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (Production)

### System Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Frontend  │─────▶│  API Gateway │─────▶│   Services  │
│   (React)   │      │  (Express)   │      │   (Node.js) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            ▼                      ▼
                     ┌──────────────┐      ┌─────────────┐
                     │   MongoDB    │      │    Redis    │
                     │   Database   │      │    Cache    │
                     └──────────────┘      └─────────────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │    Kafka    │
                                           │    Queue    │
                                           └─────────────┘
```

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Docker Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Orbit

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- MongoDB: mongodb://localhost:21011/orbit
- Redis: localhost:6379
- Kafka: localhost:9092

### Local Development Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

All environment variables are configured in `docker-compose.yml` for Docker deployments.

**Backend (`docker-compose.yml`):**
```yaml
NODE_ENV: development
PORT: 5000
MONGODB_URI: mongodb://mongodb:27017/orbit
JWT_SECRET: <your-secure-secret>
JWT_EXPIRE: 7d
REDIS_HOST: redis
REDIS_PORT: 6379
KAFKA_CLIENT_ID: orbit-api
KAFKA_BROKERS: kafka:9092
RATE_LIMIT_WINDOW_MS: 900000
RATE_LIMIT_MAX_REQUESTS: 100
CORS_ORIGIN: http://localhost:3000
```

**Frontend:**
```env
VITE_API_URL=/api/v1
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Current User**
```http
GET /auth/me
Authorization: Bearer <token>
```

### Projects

**List Projects**
```http
GET /projects?search=&status=&page=1&limit=10
Authorization: Bearer <token>
```

**Create Project**
```http
POST /projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project description",
  "status": "active",
  "technologies": ["tech_id_1", "tech_id_2"]
}
```

**Update Project**
```http
PUT /projects/:id
Authorization: Bearer <token>
```

**Delete Project**
```http
DELETE /projects/:id
Authorization: Bearer <token>
```

### Technologies

**List Technologies**
```http
GET /technologies?category=&search=
Authorization: Bearer <token>
```

**Create Technology**
```http
POST /technologies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "React",
  "category": "frontend",
  "version": "18.2.0"
}
```

### Health Check

```http
GET /health
```

## 🎨 UI Features

### Dashboard
- **4 Animated Stat Cards** - Total Projects, Active, Completed, Technologies
- **Pie Chart** - Project status distribution
- **Bar Chart** - Technology categories breakdown
- **Line Chart** - Project growth timeline
- **Recent Projects Feed** - Latest 5 projects with status badges

### Pages
- **Login/Register** - Animated gradient backgrounds with glassmorphism cards
- **Dashboard** - Comprehensive analytics and visualizations
- **Projects** - Grid view with search, filter, and CRUD operations
- **Technologies** - Category-based cards with color coding

### Components
- **Sidebar Navigation** - Responsive with mobile hamburger menu
- **Modal System** - Smooth animations with glassmorphism backdrop
- **Toast Notifications** - Real-time feedback for all actions
- **Loading States** - Skeleton loaders for better UX

## 🔒 Security Features

- ✅ Helmet.js for HTTP headers security
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ JWT token authentication with secure secrets
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ MongoDB injection prevention

## 📊 Database Schema

### Users
```javascript
{
  email: String (unique, indexed),
  password: String (hashed),
  name: String,
  role: String (admin/user),
  timestamps: true
}
```

### Projects
```javascript
{
  name: String (indexed, text search),
  description: String (text search),
  status: String (planning/active/completed/archived),
  technologies: [ObjectId] (refs to Technology),
  createdBy: ObjectId (ref to User),
  timestamps: true
}
```

### Technologies
```javascript
{
  name: String (unique, indexed),
  category: String (frontend/backend/database/devops),
  version: String,
  timestamps: true
}
```

## 📖 Documentation

Comprehensive documentation available in the `docs/` folder:

- **[INDEX.md](docs/INDEX.md)** - Documentation navigation
- **[SETUP.md](docs/SETUP.md)** - Detailed setup guide
- **[API_DOCS.md](docs/API_DOCS.md)** - Complete API reference
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Production deployment
- **[TECH_STACK.md](docs/TECH_STACK.md)** - Technology decisions
- **[PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Project overview
- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)** - Codebase structure

## 🚀 Deployment

### Using Docker (Production)

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Update containers
docker-compose -f docker-compose.prod.yml up -d --build
```

### Manual Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed production deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📝 Changelog

### v1.0.0 (Latest)
- ✨ Complete UI redesign with glassmorphism
- 📊 Added interactive dashboard with charts
- 🎨 Implemented modern design system
- ✨ Added framer-motion animations
- 🍞 Integrated toast notifications
- 📱 Improved responsive design
- 🔐 Enhanced security with strong JWT secrets
- 🐛 Fixed login authentication issues

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

Orbit Development Team

## 🙏 Acknowledgments

- React Team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Recharts for beautiful charts
- Framer Motion for smooth animations
- MongoDB, Redis, and Kafka teams
- Open Source Community

---

**Made with ❤️ using React, Node.js, and Docker**
