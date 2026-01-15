# Orbit - Project Tracking System

![Orbit Logo](frontend/public/orbit-logo.png)

**Keep your projects in alignment.**

A modern, production-ready project tracking system with a stunning **Orbit Glassmorphism UI**, designed to help teams and individuals monitor tasks, manage deadlines, and visualize progress in real-time.

![Orbit Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎨 Orbit Glassmorphism UI Design System
- **Translucent Backgrounds** - Frosted glass effect with backdrop blur
- **Electric Blue & Vibrant Purple** - Custom gradient color palette (#3b82f6, #8b5cf6)
- **Animated Floating Orbs** - Dynamic background with orbital motion
- **Soft Diffused Shadows** - Glass-themed shadow system
- **10+ Reusable Components** - Complete UI component library
- **Smooth Framer Motion Animations** - 60fps transitions and micro-interactions
- **Mobile-First Responsive** - Seamless experience across all devices

### 📦 Component Library
- **UI Components**: GlassCard, PrimaryButton, SecondaryButton, GlassInput, GlassTextarea, GlassSelect, Modal, Loader, Toast, Badge
- **Layout Components**: Sidebar (collapsible), MobileSidebar (drawer), Topbar
- **Feature Components**: MetricCard (with CountUp), ChartCard, DataTable

### 📊 Project Management
- **Full CRUD Operations** - Create, read, update, and delete projects
- **Advanced Filtering** - Search by name, status, or technology
- **Grid/List View Toggle** - Flexible project visualization
- **Status Tracking** - Planning, Active, Completed, Archived states
- **Technology Mapping** - Link projects with multiple technologies
- **Visual Analytics** - Interactive charts with Recharts
- **Progress Tracking** - Animated progress bars

### 📈 Analytics & Insights
- **Interactive Dashboard** - Real-time metrics with CountUp animations
- **Multiple Chart Types** - Line, Bar, Area, and Pie charts
- **Performance Trends** - Historical data visualization
- **Project Distribution** - Category-based breakdowns
- **Export Functionality** - Download reports and data

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
- Frontend: http://localhost:3001 (dev mode) or http://localhost:3000 (production)
- Backend API: http://localhost:5000/api/v1
- MongoDB: mongodb://localhost:27017/orbit
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

### Development Mode with Hot Reload

For faster development with instant code changes (no rebuild required):

```bash
# Start all services in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View frontend logs
docker-compose logs -f frontend

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
```

**Development Mode Features:**
- ✅ Hot Module Replacement (HMR) - instant code updates
- ✅ Volume mounts - no container rebuild needed
- ✅ Vite dev server with fast refresh
- ✅ Source maps for debugging

**Access the application:**
- Frontend (Dev): http://localhost:3001
- Backend API: http://localhost:5000/api/v1


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

### v2.1.0 (Latest - January 2026)
**Production-Ready Release with Enhanced Performance & Reliability**

- ✨ **Glassmorphism UI Design System**
  - Translucent backgrounds with backdrop blur effects
  - Electric blue and vibrant purple color palette
  - Animated floating gradient orbs
  - Soft frosted borders and diffused glass shadows
  
- 🎨 **Comprehensive Component Library**
  - 12+ reusable UI components (GlassCard, Buttons, Inputs, Modal, Loader, Toast, Badge, SkeletonLoader)
  - Complete layout system (Sidebar, MobileSidebar, Topbar)
  - Feature components (MetricCard, ChartCard, DataTable)
  - Error Boundary for graceful error handling
  
- 📱 **Enhanced Pages**
  - Login/Register with glassmorphism and form validation
  - Dashboard with metric cards, CountUp animations, and Recharts
  - Projects page with grid/list view toggle and search
  - Analytics page with performance charts and metrics
  - Technologies management with color-coded cards
  - Settings page with profile management and preferences
  - Custom 404 and 500 error pages
  
- ⚡ **Performance Optimizations**
  - Lazy loading with React.lazy() and Suspense
  - Code splitting for reduced bundle size
  - Skeleton loaders for better perceived performance
  - Optimized chart rendering with proper dimensions
  - React Query caching for reduced API calls
  
- 🛡️ **Production-Ready Backend**
  - Graceful shutdown handling (SIGTERM, SIGINT)
  - Enhanced security headers with Helmet.js
  - Request logging with Winston
  - Uncaught exception and promise rejection handling
  - Trust proxy configuration for load balancers
  - Comprehensive error handling
  
- 🔧 **State Management & Services**
  - Zustand stores (auth, UI, user preferences)
  - React Query for server state management
  - Axios with interceptors for API calls
  - Custom hooks (useToast, useMediaQuery)
  
- 🛠️ **Utilities & Helpers**
  - Animation variants library
  - Data formatters (dates, numbers, currency)
  - Form validators (email, password, URLs)
  - Responsive breakpoint hooks
  - Skeleton loader variants (card, table, chart, metric, list, text)
  
- 🎯 **Enhanced Tailwind Configuration**
  - Custom Orbit color system
  - Gradient backgrounds (oceanic, nebula, primary)
  - Glass shadows and backdrop blur utilities
  - Custom animations and keyframes
  - Inter font family integration
  
- 📦 **Production Environment**
  - Production environment files for frontend and backend
  - Docker-ready configuration
  - Environment-specific configurations
  - Security best practices implemented

### v2.0.0 (January 2026)
**Complete Frontend Redesign with Orbit Glassmorphism UI**

- Initial glassmorphism UI implementation
- Complete component library
- Dashboard with analytics
- Project and technology management
- Authentication system

### v1.0.0
- � Initial release with interactive dashboard
- 🍞 Toast notifications
- 🔐 JWT authentication
- 🐛 Bug fixes and improvements

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
