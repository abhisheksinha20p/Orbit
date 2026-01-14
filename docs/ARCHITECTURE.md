# Orbit - Architecture Documentation

## 1. High-Level Architecture

### System Overview

Orbit follows a modern microservices-inspired architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│                    (React SPA - Vercel)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              (Express.js - AWS EC2/ECS)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Auth    │  │ Projects │  │   Tech   │                  │
│  │ Routes   │  │  Routes  │  │  Routes  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │    Redis     │  │    Kafka     │
│   (Atlas)    │  │   (Cache)    │  │   (Queue)    │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Design Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **Scalability**: Horizontal scaling capability
3. **Security First**: OWASP compliance, JWT auth, rate limiting
4. **Performance**: Redis caching, database indexing
5. **Observability**: Structured logging with Winston
6. **Resilience**: Error handling, graceful degradation

## 2. Component Architecture

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   └── Layout.jsx      # Main layout with navigation
├── pages/              # Route-based page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   └── Technologies.jsx
├── services/           # API integration layer
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js
│   ├── projectService.js
│   └── technologyService.js
├── store/             # State management
│   └── authStore.js   # Zustand auth store
├── hooks/             # Custom React hooks
└── utils/             # Helper functions
```

**State Management Strategy:**
- Zustand for global auth state (persisted)
- React Query for server state (caching, refetching)
- Local state for UI-only concerns

**Data Flow:**
```
User Action → Component → Service → API → Backend
                ↓
         React Query Cache
                ↓
         Component Re-render
```

### Backend Architecture

```
src/
├── config/             # Configuration modules
│   ├── database.js    # MongoDB connection
│   ├── redis.js       # Redis client
│   └── kafka.js       # Kafka producer
├── models/            # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   └── Technology.js
├── controllers/       # Business logic
│   ├── authController.js
│   ├── projectController.js
│   └── technologyController.js
├── routes/            # API routes
│   ├── auth.js
│   ├── projects.js
│   ├── technologies.js
│   └── health.js
├── middleware/        # Express middleware
│   ├── auth.js        # JWT verification
│   ├── rateLimiter.js
│   └── errorHandler.js
├── services/          # External service integrations
├── utils/             # Helper functions
│   ├── logger.js      # Winston logger
│   └── cache.js       # Redis utilities
└── server.js          # Application entry point
```

**Request Flow:**
```
Request → Rate Limiter → Router → Auth Middleware → Controller
                                                         ↓
                                                    Check Cache
                                                         ↓
                                                    Query Database
                                                         ↓
                                                    Set Cache
                                                         ↓
                                                    Send Kafka Event
                                                         ↓
                                                    Response
```

## 3. Database Schema Design

### Collections & Relationships

```
Users (1) ──────┐
                │
                │ createdBy
                ▼
            Projects (N) ────── technologies ────▶ Technologies (N)
                                (Many-to-Many)
```

### Indexing Strategy

**Users:**
- Primary: `_id` (auto)
- Unique: `email`

**Projects:**
- Primary: `_id` (auto)
- Text Index: `name`, `description` (for search)
- Compound: `status`, `createdAt`

**Technologies:**
- Primary: `_id` (auto)
- Unique: `name`
- Index: `category`

### Data Access Patterns

1. **List Projects**: Filter by status, search text, technology
2. **Project Details**: Populate technologies and creator
3. **Technology Filter**: Group by category
4. **User Projects**: Filter by createdBy

## 4. API Design

### RESTful Principles

- Resource-based URLs
- HTTP methods for CRUD
- Proper status codes
- JSON responses
- Pagination support

### Response Format

**Success:**
```json
{
  "success": true,
  "data": {...},
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Authentication Flow

```
1. User registers/logs in
2. Server generates JWT token
3. Client stores token (localStorage)
4. Client sends token in Authorization header
5. Server verifies token on protected routes
6. Token expires after 7 days
```

## 5. Caching Strategy

### Redis Cache Layers

**Level 1: Query Results**
- Projects list (TTL: 10 minutes)
- Technologies list (TTL: 1 hour)
- Key pattern: `projects:{query_params}`

**Level 2: Session Data**
- User sessions
- Rate limit counters

**Cache Invalidation:**
- On CREATE: Clear related list caches
- On UPDATE: Clear specific item + list caches
- On DELETE: Clear specific item + list caches

## 6. Event-Driven Architecture

### Kafka Topics

**project-events:**
- `created`: New project created
- `updated`: Project modified
- `deleted`: Project removed

**Use Cases:**
- Audit logging
- Real-time notifications
- Analytics tracking
- Webhook triggers

## 7. Security Architecture

### Defense in Depth

**Layer 1: Network**
- HTTPS only
- CORS configuration
- Rate limiting

**Layer 2: Application**
- Helmet.js security headers
- Input validation
- SQL injection prevention (NoSQL)
- XSS protection

**Layer 3: Authentication**
- JWT tokens
- Password hashing (bcrypt, 12 rounds)
- Token expiration

**Layer 4: Authorization**
- Role-based access control
- Resource ownership validation

### OWASP Top 10 Mitigation

1. **Injection**: Mongoose parameterized queries
2. **Broken Auth**: JWT + secure password hashing
3. **Sensitive Data**: Environment variables, no credentials in code
4. **XXE**: JSON only, no XML parsing
5. **Broken Access Control**: Middleware authorization
6. **Security Misconfiguration**: Helmet.js, secure defaults
7. **XSS**: React auto-escaping, CSP headers
8. **Insecure Deserialization**: JSON.parse with validation
9. **Known Vulnerabilities**: Regular npm audit
10. **Insufficient Logging**: Winston structured logging

## 8. Scalability Considerations

### Horizontal Scaling

**Frontend:**
- Static assets on CDN (Vercel)
- Edge caching
- Code splitting

**Backend:**
- Stateless API servers
- Load balancer (AWS ALB)
- Multiple EC2 instances

**Database:**
- MongoDB Atlas auto-scaling
- Read replicas for queries
- Sharding for large datasets

### Performance Optimization

1. **Database**: Indexes, connection pooling
2. **Caching**: Redis for hot data
3. **API**: Pagination, field selection
4. **Frontend**: Lazy loading, memoization

## 9. Monitoring & Observability

### Logging Strategy

**Levels:**
- ERROR: Application errors
- WARN: Degraded performance
- INFO: Important events
- DEBUG: Detailed diagnostics

**Log Aggregation:**
- CloudWatch Logs (AWS)
- Structured JSON format
- Correlation IDs for tracing

### Metrics

- Request rate
- Response time
- Error rate
- Cache hit ratio
- Database query time

### Health Checks

**Endpoint:** `/api/v1/health`
- Server uptime
- Database connectivity
- Redis connectivity
- Memory usage

## 10. Deployment Architecture

### Frontend (Vercel)

```
GitHub → Vercel Build → CDN Distribution → Users
```

**Features:**
- Automatic deployments
- Preview deployments for PRs
- Edge network
- SSL certificates

### Backend (AWS EC2)

```
GitHub → GitHub Actions → EC2 Instance → PM2 Process Manager
```

**Infrastructure:**
- EC2 t3.medium instance
- Security groups (port 5000)
- Elastic IP
- PM2 for process management

### Database (MongoDB Atlas)

- M10 cluster (production)
- Automated backups
- Point-in-time recovery
- VPC peering

## 11. CI/CD Pipeline

```
Code Push → GitHub Actions
              ↓
         Run Tests
              ↓
         Build Assets
              ↓
    ┌─────────┴─────────┐
    ▼                   ▼
Deploy Frontend    Deploy Backend
  (Vercel)           (EC2)
```

**Quality Gates:**
- Linting
- Unit tests
- Build success
- Security scan

## 12. Disaster Recovery

### Backup Strategy

**Database:**
- Daily automated backups
- 7-day retention
- Point-in-time recovery

**Code:**
- Git version control
- Multiple branches
- Tagged releases

### Recovery Procedures

1. **Database Failure**: Restore from Atlas backup
2. **Server Failure**: Launch new EC2, deploy latest
3. **Cache Failure**: Redis rebuild from database
4. **Complete Outage**: Multi-region failover (future)

## 13. Future Enhancements

1. **Microservices**: Split into separate services
2. **GraphQL**: Alternative API layer
3. **WebSockets**: Real-time updates
4. **Elasticsearch**: Advanced search
5. **Kubernetes**: Container orchestration
6. **Multi-region**: Global deployment
7. **Mobile Apps**: React Native clients
8. **AI/ML**: Project recommendations
