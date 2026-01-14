# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Validation:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Errors:**
- `401`: Invalid credentials

---

#### Get Current User

```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

**Errors:**
- `401`: Not authorized / Invalid token

---

### Projects

#### List Projects

```http
GET /projects?search=&status=&technology=&page=1&limit=10
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (optional): Text search in name and description
- `status` (optional): Filter by status (planning, active, completed, archived)
- `technology` (optional): Filter by technology ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "E-commerce Platform",
      "description": "Full-stack e-commerce solution",
      "status": "active",
      "deploymentStatus": {
        "environment": "production",
        "url": "https://shop.example.com",
        "lastDeployed": "2024-01-15T10:30:00.000Z",
        "health": "healthy"
      },
      "technologies": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "name": "React",
          "category": "frontend",
          "icon": "react-icon-url"
        }
      ],
      "deadline": "2024-12-31T00:00:00.000Z",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

#### Get Project

```http
GET /projects/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "E-commerce Platform",
    "description": "Full-stack e-commerce solution",
    "status": "active",
    "deploymentStatus": {
      "environment": "production",
      "url": "https://shop.example.com",
      "lastDeployed": "2024-01-15T10:30:00.000Z",
      "health": "healthy"
    },
    "technologies": [...],
    "deadline": "2024-12-31T00:00:00.000Z",
    "createdBy": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `404`: Project not found

---

#### Create Project

```http
POST /projects
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "E-commerce Platform",
  "description": "Full-stack e-commerce solution",
  "status": "planning",
  "deploymentStatus": {
    "environment": "staging",
    "url": "https://staging.shop.example.com",
    "health": "healthy"
  },
  "technologies": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "deadline": "2024-12-31"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "E-commerce Platform",
    ...
  }
}
```

**Validation:**
- `name`: Required, non-empty string
- `description`: Required, non-empty string
- `status`: Optional, enum (planning, active, completed, archived)
- `technologies`: Optional, array of valid ObjectIds
- `deadline`: Optional, valid date

---

#### Update Project

```http
PUT /projects/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Project Name",
  "status": "active",
  "deploymentStatus": {
    "health": "degraded"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Project Name",
    ...
  }
}
```

**Errors:**
- `404`: Project not found

---

#### Delete Project

```http
DELETE /projects/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Project deleted"
}
```

**Errors:**
- `404`: Project not found

---

### Technologies

#### List Technologies

```http
GET /technologies?category=&search=
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `category` (optional): Filter by category (frontend, backend, database, devops, other)
- `search` (optional): Search by name (case-insensitive)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "React",
      "category": "frontend",
      "version": "18.2.0",
      "icon": "https://example.com/react-icon.png",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Get Technology

```http
GET /technologies/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "React",
    "category": "frontend",
    "version": "18.2.0",
    "icon": "https://example.com/react-icon.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `404`: Technology not found

---

#### Create Technology

```http
POST /technologies
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "React",
  "category": "frontend",
  "version": "18.2.0",
  "icon": "https://example.com/react-icon.png"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "React",
    "category": "frontend",
    "version": "18.2.0",
    "icon": "https://example.com/react-icon.png",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation:**
- `name`: Required, unique, non-empty string
- `category`: Required, enum (frontend, backend, database, devops, other)
- `version`: Optional, string
- `icon`: Optional, string (URL)

---

#### Update Technology

```http
PUT /technologies/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "version": "18.3.0"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "React",
    "category": "frontend",
    "version": "18.3.0",
    ...
  }
}
```

**Errors:**
- `404`: Technology not found

---

#### Delete Technology

```http
DELETE /technologies/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Technology deleted"
}
```

**Errors:**
- `404`: Technology not found

---

### Health Check

#### Get Health Status

```http
GET /health
```

**No authentication required**

**Response:** `200 OK`
```json
{
  "uptime": 123456.789,
  "timestamp": 1705334400000,
  "status": "OK",
  "database": "connected"
}
```

---

## Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

## Error Examples

### Validation Error

```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error

```json
{
  "message": "Not authorized"
}
```

### Rate Limit Error

```json
{
  "message": "Too many requests, please try again later"
}
```

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Projects

```bash
curl -X GET http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Project

```bash
curl -X POST http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Project description","status":"active"}'
```

## Postman Collection

Import the following URL into Postman:
```
https://api.postman.com/collections/YOUR_COLLECTION_ID
```

Or use the provided `postman_collection.json` file in the repository.
