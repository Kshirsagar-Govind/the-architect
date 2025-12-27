# 📚 The Architect - Backend API Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Authentication & Authorization](#authentication--authorization)
8. [Middlewares](#middlewares)
9. [Utilities & Services](#utilities--services)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Environment Variables](#environment-variables)
13. [Getting Started](#getting-started)

---

## 🎯 Project Overview

**The Architect** is a comprehensive backend API for a security testing and vulnerability management platform. It facilitates collaboration between clients, administrators, managers, and team members to manage security testing projects, track vulnerabilities, handle subscriptions, and manage credits.

### Key Concepts

- **Security Testing Platform**: Clients submit their applications for security testing
- **Vulnerability Management**: Team members report vulnerabilities found during testing
- **Subscription-Based**: Clients purchase plans (Basic, Standard, Advanced) with different credit allocations
- **Credit System**: Credits are used for project testing and can be purchased separately
- **Role-Based Access Control**: Different user roles (admin, manager, member, client) with specific permissions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **Database** | MongoDB (with Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcryptjs |
| **Validation** | Joi |
| **Email Service** | Nodemailer |
| **Testing** | Jest + Supertest |
| **Test Database** | MongoDB Memory Server |
| **Logging** | Custom Logger Utility |
| **Error Handling** | Centralized middleware-based handler |
| **Environment Management** | dotenv |
| **Containerization** | Docker + Docker Compose |
| **Reverse Proxy** | Nginx |

---

## 📁 Project Structure

```
the-architect/
├── app/
│   ├── app.ts                    # Main Express application setup
│   ├── config/
│   │   ├── db.ts                 # MongoDB connection configuration
│   │   └── mail.config.ts        # Nodemailer configuration
│   ├── constants/
│   │   └── plan/
│   │       ├── plan.ts           # Plan types and pricing
│   │       └── features.ts       # Plan features configuration
│   ├── controller/               # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── client.controller.ts
│   │   ├── credit.controller.ts
│   │   ├── notification.controller.ts
│   │   ├── project.controller.ts
│   │   ├── subscription.controller.ts
│   │   ├── user.controller.ts
│   │   └── vulnerability.controller.ts
│   ├── emailTemplates/           # HTML email templates
│   │   ├── forgetPassword.html
│   │   └── test.html
│   ├── middlewares/              # Express middlewares
│   │   ├── activityLog.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── verifyToken.middleware.ts
│   ├── models/                   # Mongoose schemas
│   │   ├── activityLog.model.ts
│   │   ├── client.model.ts
│   │   ├── credits.model.ts
│   │   ├── internalNotification.model.ts
│   │   ├── notification.model.ts
│   │   ├── project.model.ts
│   │   ├── projectDetail.model.ts
│   │   ├── session.model.ts
│   │   ├── subscription.mode.ts
│   │   ├── user.model.ts
│   │   └── vulnerability.model.ts
│   ├── routes/                   # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── client.routes.ts
│   │   ├── project.routes.ts
│   │   ├── subscription.routes.ts
│   │   ├── user.routes.ts
│   │   └── vulnerabilities.routes.ts
│   ├── services/                 # External service integrations
│   │   └── email.service.ts
│   └── utils/                    # Utility functions
│       ├── asyncHandler.ts
│       ├── errorHandler.ts
│       ├── generateHash.ts
│       ├── generateID.ts
│       ├── logger.ts
│       └── validateSchema.ts
├── test/                         # Test files
│   └── controller/
│       ├── auth.test.ts
│       ├── client.test.ts
│       ├── project.test.ts
│       ├── subscription.test.ts
│       ├── user.test.ts
│       └── vulnerability.test.ts
├── dist/                         # Compiled JavaScript output
├── logs/                         # Application logs
├── coverage/                     # Test coverage reports
├── jest-stare/                   # Jest test reports
├── server.ts                     # Application entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── Dockerfile                    # Docker image definition
├── docker-compose.yml            # Docker Compose configuration
├── nginx.conf                    # Nginx reverse proxy configuration
└── README.md                     # Project readme

```

---

## ✨ Features

### 1. **User Management**
- User registration and authentication
- Role-based access control (admin, manager, member)
- Password reset functionality
- Session management with refresh tokens

### 2. **Client Management**
- Client registration and profile management
- Client authentication (separate from user authentication)
- Search and filter clients by email, name, or company

### 3. **Project Management**
- Create, read, update, and delete projects
- Assign managers to projects
- Associate projects with clients
- Assign team members to projects
- Support for different project types (web, mobile, product)
- File upload support for application files

### 4. **Vulnerability Management**
- Report vulnerabilities with detailed information
- Track vulnerability status (open, in-progress, duplicate, resolved, closed)
- Severity levels (low, medium, high, critical)
- Attach proof of concept files
- Filter vulnerabilities by project, reporter, severity, status, and type
- Update vulnerability status and severity independently

### 5. **Subscription & Credits System**
- Three subscription plans: Basic, Standard, Advanced
- Each plan includes:
  - Initial credits allocation
  - Testing time period
  - Project closing days
  - Number of assets
  - Extra credit cost
  - Security certificate and badge eligibility
- Credit balance management
- Credit history tracking
- Add/deduct credits functionality

### 6. **Activity Logging**
- Automatic logging of all API requests
- Tracks URL, user email, IP address, HTTP method, and request body
- Sensitive data (passwords, tokens) are automatically sanitized

### 7. **Email Service**
- Password reset emails
- HTML email templates
- Configurable email service

### 8. **Error Handling**
- Centralized error handling middleware
- Custom error class with status codes
- Detailed error logging

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/login` | No | User login (returns JWT token and refresh token) |
| POST | `/logout` | No | User logout (invalidates refresh token) |
| POST | `/reset-password` | Yes | Reset user password |
| POST | `/refresh-token` | No | Refresh access token using refresh token |
| POST | `/forget-password` | No | Request password reset email |
| POST | `/file-upload` | No | File upload endpoint (placeholder) |

### Users (`/api/user`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Get all users (supports query params: `id`, `email`, `name`) |
| POST | `/` | No | Create new user |
| PUT | `/:id` | Yes | Update user by ID |
| DELETE | `/:id` | Yes | Delete user by ID |

### Clients (`/api/client`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/` | No | Get all clients (supports query params: `email`, `name`, `company`) |
| GET | `/:id` | Yes | Get client by ID |
| POST | `/login` | No | Client login |
| POST | `/` | No | Create new client |
| PUT | `/:id` | Yes | Update client by ID |
| DELETE | `/:id` | Yes | Delete client by ID |

### Projects (`/api/project`)

| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | No | - | Get all projects (supports query params: `title`, `desc`) |
| POST | `/` | Yes | Admin | Create new project |
| PUT | `/:id` | Yes | - | Update project by ID |
| DELETE | `/:id` | Yes | Admin | Delete project by ID |
| PUT | `/:id/assign-manager` | Yes | Admin | Assign manager to project |

### Vulnerabilities (`/api/vulnerability`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/:projectId` | No | Get vulnerabilities for a project (supports query params: `reportedBy`, `severity`, `status`, `type`) |
| POST | `/:projectId` | Yes | Create new vulnerability |
| PUT | `/:id` | No | Update vulnerability by ID |
| PATCH | `/:id/update-severity` | No | Update vulnerability severity only |
| PATCH | `/:id/update-status` | No | Update vulnerability status only |
| DELETE | `/:id` | No | Delete vulnerability by ID |

### Subscriptions & Credits (`/api/plan`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/subscription/:clientId` | No | Get subscription plans for a client |
| POST | `/subscription/:clientId/` | Yes | Purchase a subscription plan |
| PATCH | `/subscription/:subscriptionId` | Yes | Update payment status of subscription |
| PATCH | `/credit/:clientId` | Yes | Add credits to client account |
| PATCH | `/credit/:clientId` | Yes | Deduct credits from client account |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server health check |
| GET | `/api/health` | API health check |

---

## 📊 Data Models

### User Model

```typescript
{
  id: string;              // Auto-generated 12-character hex ID
  name: string;            // Required
  email: string;           // Required
  role: string;            // Enum: 'admin', 'manager', 'member' (default: 'member')
  password: string;        // Required, hashed using bcrypt
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```

**Methods:**
- `hashPassword()`: Hashes the password before saving

### Client Model

```typescript
{
  id: string;              // Auto-generated 12-character hex ID
  name: string;           // Required
  company?: string;
  email: string;          // Required, unique
  password: string;       // Required, hashed
  phone?: string;
  address?: string;
  country?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Methods:**
- `hashPassword()`: Hashes the password before saving

### Project Model

```typescript
{
  id: string;              // Auto-generated 16-character hex ID
  title: string;          // Required
  desc: string;           // Default: ''
  projectType: string;    // Enum: 'web', 'mobile', 'product' (default: 'web')
  client: ObjectId;       // Reference to Client, required
  manager: ObjectId;      // Reference to User, required
  members: ObjectId[];    // Array of User references, default: []
  appFile: {
    name: string;
    url: string;
    size: number;
    uploadedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Vulnerability Model

```typescript
{
  id: string;              // Auto-generated 'VULN-' + 16-digit numeric ID
  title: string;          // Required
  vulnerabilityType: string;  // Default: 'General'
  desc: string;           // Default: ''
  stepToReproduce: string;   // Default: ''
  severity: string;       // Enum: 'low', 'medium', 'high', 'critical' (default: 'medium')
  status: string;         // Enum: 'open', 'in-progress', 'duplicate', 'resolved', 'closed' (default: 'open')
  impact?: string;
  recommendation?: string;
  affectedEndpoint?: string;
  proofOfConcept: string[];   // Array of strings, default: []
  attachments: [{
    fileName: string;
    fileUrl: string;
    fileType: string;     // Enum: 'image', 'video', 'ppt', 'pdf', 'other' (default: 'image')
    size?: number;
    uploadedAt?: Date;
  }];
  tags?: string[];
  reportedBy: ObjectId;   // Reference to User, required
  verifiedBy?: ObjectId;  // Reference to User
  projectId: ObjectId;    // Reference to Project, required
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Subscription Model

```typescript
{
  clientId: ObjectId;     // Reference to Client, required
  plan: string;           // Enum: 'basic', 'standard', 'advanced' (default: 'standard')
  boughtOn: Date;         // Default: Date.now()
  paymentStatus: string;  // Enum: 'in-progress', 'cancelled', 'paid' (default: 'in-progress')
  createdAt: Date;
  updatedAt: Date;
}
```

**Post-save Hook:**
- Automatically creates a Credits account for the client with initial credits based on the plan

### Credits Model

```typescript
{
  clientId: ObjectId;     // Reference to Client, required
  balance: number;        // Default: 0
  history: [{
    statement: string;    // Required
    amount: number;       // Required
    date: Date;           // Default: Date.now()
  }];
  createdAt: Date;
  updatedAt: Date;
}
```

**Methods:**
- `deductCredits(amount, statement)`: Deducts credits and adds to history
- `addCredits(amount, statement)`: Adds credits and adds to history

### Session Model

```typescript
{
  id: string;             // Auto-generated 6-character alphanumeric ID
  user_id: string;        // Required
  refresh_token: string;   // Required
  createdAt: Date;
  updatedAt: Date;
}
```

**Index:**
- Auto-expires documents older than 7 days

### Notification Model

```typescript
{
  id: ObjectId;           // Required
  notification: string;   // Required
  user_id: ObjectId;     // Reference to User
  seen: boolean;          // Default: false
  type: string;          // Enum: 'info', 'success', 'warning', 'error', 'promo' (default: 'info')
  meta: Object;           // Default: {}
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Activity Log Model

```typescript
{
  url: string;            // Default: ''
  email: string;          // Default: ''
  ip: string;             // Default: ''
  body: string;           // Default: ''
  method: string;         // Default: ''
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

1. **Login**: User/Client provides email and password
   - Password is verified against hashed password in database
   - JWT access token and refresh token are generated
   - Refresh token is stored in Session collection
   - Tokens are returned to client

2. **Token Verification**: Protected routes use `VerifyToken` middleware
   - Extracts token from `Authorization` header (format: `Bearer <token>`)
   - Verifies token signature using `SECRET_KEY`
   - Fetches user from database and attaches to `req.user`
   - Proceeds to next middleware/controller

3. **Refresh Token**: Client can refresh expired access tokens
   - Validates refresh token
   - Generates new access and refresh tokens
   - Updates session with new refresh token

4. **Logout**: Invalidates refresh token
   - Deletes session from database

### Password Reset Flow

1. User requests password reset via `/forget-password`
2. System generates time-limited JWT token (15 minutes)
3. Email is sent with reset link containing token
4. User clicks link and provides new password
5. Token is verified and password is updated

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: Create/delete projects, assign managers, manage users |
| **Manager** | Manage assigned projects, review vulnerabilities |
| **Member** | Report vulnerabilities, view assigned projects |
| **Client** | View own projects, view vulnerabilities for their projects |

---

## 🛡️ Middlewares

### 1. VerifyToken Middleware
- **Location**: `app/middlewares/verifyToken.middleware.ts`
- **Purpose**: Validates JWT tokens and attaches user to request
- **Usage**: Applied to protected routes
- **Behavior**:
  - Extracts token from `Authorization` header
  - Verifies token signature
  - Fetches user from database
  - Attaches user to `req.user`
  - Returns 401 if token is invalid or missing

### 2. ErrorHandler Middleware
- **Location**: `app/middlewares/errorHandler.middleware.ts`
- **Purpose**: Centralized error handling
- **Usage**: Applied as last middleware in Express app
- **Behavior**:
  - Catches all errors from controllers
  - Logs errors with sanitized request data
  - Returns appropriate HTTP status codes
  - Hides sensitive information (passwords, tokens) in logs

### 3. ActivityLog Middleware
- **Location**: `app/middlewares/activityLog.middleware.ts`
- **Purpose**: Logs all API requests for audit trail
- **Usage**: Applied to routes that need logging
- **Behavior**:
  - Captures URL, user email, IP address, HTTP method, and request body
  - Sanitizes sensitive data (passwords, tokens, OTPs)
  - Saves to ActivityLog collection
  - Skips logging for root path and favicon requests

### 4. Validate Middleware
- **Location**: `app/middlewares/validate.middleware.ts`
- **Purpose**: Validates request body against Joi schemas
- **Usage**: Applied before controllers that need validation
- **Behavior**:
  - Validates request body using provided Joi schema
  - Returns 400 with validation errors if invalid
  - Proceeds to next middleware if valid

---

## 🧰 Utilities & Services

### ErrorHandler (`app/utils/errorHandler.ts`)
Custom error class extending JavaScript Error:
- `statusCode`: HTTP status code
- `errorMessage`: User-friendly error message
- Static factory methods: `badRequest()`, `notFound()`, `unauthorized()`, `serverError()`

### AsyncHandler (`app/utils/asyncHandler.ts`)
Wraps async route handlers to automatically catch errors and forward them to error middleware.

### GenerateHash (`app/utils/generateHash.ts`)
Password and token utilities:
- `generateHash()`: Hashes passwords using bcrypt
- `verifyPassword()`: Verifies password against hash
- `generateAuthToken()`: Creates JWT tokens
- `generateForgetPasswordToken()`: Creates time-limited reset tokens
- `decodeJWTToken()`: Decodes and verifies JWT tokens

### GenerateID (`app/utils/generateID.ts`)
ID generation utilities:
- `generateUserId()`: 12-character hex ID
- `generateProjectId()`: 16-character hex ID
- `generateVulnerabilityId()`: 'VULN-' + 16-digit numeric ID
- `generateRowId()`: 6-character alphanumeric ID

### Logger (`app/utils/logger.ts`)
File-based logging utility:
- `Logger.INFO()`: Logs info messages
- `Logger.ERROR()`: Logs error messages
- `Logger.WARNING()`: Logs warning messages
- Logs are written to `logs/app.logs.txt`

### ValidateSchema (`app/utils/validateSchema.ts`)
Joi validation schemas:
- `vulnerabilitySchema`: Validates vulnerability creation requests

### Email Service (`app/services/email.service.ts`)
Email sending functionality:
- `sendMail()`: Sends HTML emails using Nodemailer
- Uses configured mail transporter
- Logs email sending events

---

## 🧪 Testing

### Test Setup
- **Framework**: Jest with ts-jest
- **Test Database**: MongoDB Memory Server (in-memory database for tests)
- **Test Runner**: Supertest for HTTP assertions
- **Coverage**: Jest coverage reports

### Test Structure
Tests are located in `test/controller/` directory:
- `auth.test.ts`: Authentication tests
- `client.test.ts`: Client management tests
- `project.test.ts`: Project management tests
- `subscription.test.ts`: Subscription and credits tests
- `user.test.ts`: User management tests
- `vulnerability.test.ts`: Vulnerability management tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage
```

### Test Configuration
- Tests run in `test` environment
- Database automatically switches to in-memory MongoDB
- Server does not start in test mode
- Test reports generated in `jest-stare/` directory

---

## 🚀 Deployment

### Docker Deployment

#### Dockerfile
Multi-stage build process:
1. Uses Node.js 18 base image
2. Sets working directory to `/app`
3. Copies package files and installs dependencies
4. Copies application code
5. Exposes port 8080
6. Runs `npm start` command

#### Docker Compose
Two services:
1. **node-app**: Backend application container
2. **nginx**: Reverse proxy container

**Usage:**
```bash
docker-compose up -d
```

### Nginx Configuration
- Listens on port 80
- Proxies requests to `node-app:8080`
- Supports WebSocket upgrades
- Handles HTTP/1.1 connections

### Environment-Specific Behavior
- **Development**: Uses MongoDB URI from environment
- **Test**: Uses in-memory MongoDB (MongoDB Memory Server)
- **Production**: Uses production MongoDB URI

---

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/the-architect

# JWT Secret
SECRET_KEY=your_secret_key_here

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 8080) |
| `NODE_ENV` | Environment (development/test/production) | No (default: development) |
| `MONGO_URI` | MongoDB connection string | Yes (except in test mode) |
| `SECRET_KEY` | JWT secret key | Yes |
| `EMAIL_SERVICE` | Email service provider | Yes (if using email) |
| `EMAIL_USER` | Email account username | Yes (if using email) |
| `EMAIL_PASS` | Email account password/app password | Yes (if using email) |
| `FRONTEND_URL` | Frontend application URL | Yes (for password reset) |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-architect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build TypeScript**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:8080/api/health
   # Should return: {"ok":true,"from":"🔥 SERVER WORKING PROPERLY 🔥"}
   ```

### Development Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start server (production mode) |
| `npm run dev` | Start server in development mode with nodemon |
| `npm test` | Run test suite |
| `npm run coverage` | Run tests with coverage report |

### Database Setup

1. **Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Update `MONGO_URI` in `.env`: `mongodb://localhost:27017/the-architect`

2. **MongoDB Atlas (Cloud)**
   - Create account at mongodb.com/cloud/atlas
   - Create cluster and database
   - Get connection string
   - Update `MONGO_URI` in `.env` with Atlas connection string

### Creating First Admin User

After starting the server, create an admin user via API:

```bash
POST /api/user
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepassword",
  "role": "admin"
}
```

---

## 📝 Plan Features Reference

### Basic Plan
- Credits: 50
- Testing Time: 7 days
- Project Closing Days: 2 days
- Assets: 2
- Extra Credit Cost: $10 per credit
- Secured Certificate: No
- Secured Badge: No
- Price: $100

### Standard Plan
- Credits: 150
- Testing Time: 14 days
- Project Closing Days: 3 days
- Assets: 2
- Extra Credit Cost: $6 per credit
- Secured Certificate: Yes
- Secured Badge: Yes
- Price: $200

### Advanced Plan
- Credits: 500
- Testing Time: 28 days
- Project Closing Days: 7 days
- Assets: 5
- Extra Credit Cost: $3 per credit
- Secured Certificate: Yes
- Secured Badge: Yes
- Price: $280

---

## 🔍 API Request/Response Examples

### User Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Loggin Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Project

**Request:**
```http
POST /api/project
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "E-commerce Website Security Test",
  "desc": "Comprehensive security testing for e-commerce platform",
  "projectType": "web",
  "client": "507f1f77bcf86cd799439011",
  "manager": "507f191e810c19729de860ea",
  "members": ["507f191e810c19729de860eb"],
  "appFile": {
    "name": "app.apk",
    "url": "https://example.com/files/app.apk",
    "size": 5242880
  }
}
```

**Response:**
```json
{
  "message": "New project created successfully",
  "data": {
    "id": "a1b2c3d4e5f6g7h8",
    "title": "E-commerce Website Security Test",
    "desc": "Comprehensive security testing for e-commerce platform",
    "projectType": "web",
    "client": {...},
    "manager": {...},
    "members": [...],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Create Vulnerability

**Request:**
```http
POST /api/vulnerability/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "SQL Injection in Login Form",
  "vulnerabilityType": "SQL Injection",
  "desc": "The login form is vulnerable to SQL injection attacks",
  "stepToReproduce": "1. Navigate to login page\n2. Enter: admin' OR '1'='1\n3. Submit form",
  "severity": "high",
  "status": "open",
  "proofOfConcept": ["Screenshot1.png", "Screenshot2.png"],
  "reportedBy": "507f191e810c19729de860ea",
  "projectId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vulnerability reported successfully.",
  "data": {
    "id": "VULN-1234567890123456",
    "title": "SQL Injection in Login Form",
    "severity": "high",
    "status": "open",
    ...
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check `MONGO_URI` in `.env`
   - Ensure network connectivity

2. **JWT Token Invalid**
   - Verify `SECRET_KEY` matches between token generation and verification
   - Check token expiration
   - Ensure token is sent in `Authorization` header with `Bearer` prefix

3. **Port Already in Use**
   - Change `PORT` in `.env`
   - Or kill process using port 8080

4. **Email Not Sending**
   - Verify email credentials in `.env`
   - For Gmail, use App Password instead of regular password
   - Check email service configuration

---

## 📄 License

This project is part of a learning journey in backend development and system design.

---

## 👥 Contributing

This is a learning project. Contributions and suggestions are welcome!

---

## 📞 Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

**Last Updated**: January 2024
**Version**: 0.0.0

