# Universal Accounting Platform

A comprehensive, multi-tenant accounting platform built with microservices architecture, featuring Spring Boot backend services and a modern React frontend.

## 🏗️ Architecture

### Backend Services
- **Eureka Server** (Port 8761) - Service discovery and registration
- **API Gateway** (Port 8080) - Centralized routing and authentication
- **Auth Service** (Port 8082) - JWT-based authentication and authorization
- **Tenant Service** (Port 8083) - Multi-tenant business management
- **Ledger Service** (Port 8084) - Journal entries and double-entry bookkeeping
- **Reports Service** (Port 8087) - Financial reports and analytics

### Frontend
- **React + TypeScript + Vite** - Modern frontend framework
- **Tailwind CSS + shadcn/ui** - Beautiful, responsive UI components
- **React Query** - Efficient data fetching and caching
- **React Router v6** - Client-side routing

### Infrastructure
- **PostgreSQL** - Primary database with multi-tenant support
- **Redis** - Caching and session management
- **Apache Kafka** - Event streaming and messaging
- **Docker** - Containerized deployment

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Docker Compose
- Node.js 18+ (for local frontend development)
- Java 17+ (for local backend development)

### Demo Users

The platform comes with pre-configured demo users for testing different business scenarios:

| Username | Password | Role | Tenant | Description |
|----------|----------|------|--------|-------------|
| `admin` | `admin123` | ADMIN | Universal Accounting Demo | Full system access with all permissions |
| `accountant` | `accountant123` | ACCOUNTANT | Universal Accounting Demo | Accounting operations and reporting |
| `user` | `user123` | USER | Universal Accounting Demo | Basic user access for data entry |
| `restaurant` | `restaurant123` | ACCOUNTANT | Bella Vista Restaurant | Restaurant business management |
| `retail` | `retail123` | ACCOUNTANT | TechMart Electronics | Retail business management |
| `freelancer` | `freelancer123` | USER | Alex Freelancer Services | Freelancer business management |

**Demo Tenants:**
- **Universal Accounting Demo** - General business type
- **Bella Vista Restaurant** - Restaurant business type  
- **TechMart Electronics** - Retail business type
- **Alex Freelancer Services** - Freelancer business type

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd universal-accounting-platform
   ```

2. **Start all services**
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Eureka Server: http://localhost:8761
   - Kafka UI: http://localhost:8081

### Local Development

1. **Start infrastructure services**
   ```bash
   docker-compose up -d postgres redis kafka zookeeper
   ```

2. **Start backend services**
   ```bash
   # Terminal 1 - Eureka Server
   cd eureka-server && mvn spring-boot:run
   
   # Terminal 2 - API Gateway
   cd gateway && mvn spring-boot:run
   
   # Terminal 3 - Auth Service
   cd auth-service && mvn spring-boot:run
   
   # Terminal 4 - Tenant Service
   cd tenant-service && mvn spring-boot:run
   
   # Terminal 5 - Ledger Service
   cd ledger-service && mvn spring-boot:run
   
   # Terminal 6 - Reports Service
   cd reports-service && mvn spring-boot:run
   ```

3. **Start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📋 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, ACCOUNTANT, USER)
- Secure password hashing with BCrypt
- Session management with Redis

### Multi-Tenant Support
- Tenant onboarding and management
- Configurable business types
- Per-tenant data isolation
- Schema-based multi-tenancy

### Ledger Management
- Double-entry bookkeeping enforcement
- Journal entry creation and management
- Real-time balance validation
- Journal entry explorer with filtering
- Trial balance generation

### Financial Reports
- Profit & Loss statements
- Balance Sheet reports
- Trial Balance reports
- Interactive charts with Recharts
- Export to PDF/Excel/CSV

### Real-time Features
- Server-Sent Events (SSE) for real-time updates
- Kafka event streaming
- Activity feed
- Live notifications

## 🔧 Configuration

### Environment Variables

#### Backend Services
```yaml
# Database
SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/accounting_db
SPRING_DATASOURCE_USERNAME: accounting_user
SPRING_DATASOURCE_PASSWORD: accounting_pass

# Redis
SPRING_REDIS_HOST: localhost
SPRING_REDIS_PORT: 6379

# Kafka
SPRING_KAFKA_BOOTSTRAP_SERVERS: localhost:9092

# JWT
JWT_SECRET: your-secret-key-here
JWT_EXPIRATION: 86400000

# Eureka
EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://localhost:8761/eureka/
```

#### Frontend
```env
REACT_APP_API_URL=http://localhost:8080
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Tenant Endpoints
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/{id}` - Get tenant
- `GET /api/tenants` - List all tenants
- `PUT /api/tenants/{id}` - Update tenant
- `DELETE /api/tenants/{id}` - Delete tenant

### Ledger Endpoints
- `POST /api/ledger/journal-entries` - Create journal entry
- `GET /api/ledger/journal-entries` - List journal entries
- `GET /api/ledger/journal-entries/{id}` - Get journal entry
- `POST /api/ledger/journal-entries/{id}/post` - Post journal entry

### Reports Endpoints
- `GET /api/reports/profit-loss` - Profit & Loss report
- `GET /api/reports/balance-sheet` - Balance Sheet report
- `GET /api/reports/trial-balance` - Trial Balance report

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
mvn test

# Run specific service tests
cd auth-service && mvn test
cd tenant-service && mvn test
cd ledger-service && mvn test
cd reports-service && mvn test
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## 📦 Deployment

### Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy to production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Kubernetes Deployment

1. **Apply Kubernetes manifests**
   ```bash
   kubectl apply -f k8s/
   ```

2. **Check deployment status**
   ```bash
   kubectl get pods
   kubectl get services
   ```

## 🔍 Monitoring & Logging

### Health Checks
All services expose health check endpoints:
- Eureka Server: http://localhost:8761/actuator/health
- API Gateway: http://localhost:8080/actuator/health
- Auth Service: http://localhost:8082/actuator/health
- Tenant Service: http://localhost:8083/actuator/health
- Ledger Service: http://localhost:8084/actuator/health
- Reports Service: http://localhost:8087/actuator/health

### Logging
- Structured JSON logging
- Centralized log aggregation
- Log levels configurable per service

### Metrics
- Spring Boot Actuator metrics
- Custom business metrics
- Prometheus integration ready

## 🛠️ Development

### Project Structure
```
universal-accounting-platform/
├── shared/                    # Shared modules
│   ├── common-models/        # Domain entities
│   └── event-contracts/      # Event definitions
├── eureka-server/            # Service discovery
├── gateway/                  # API Gateway
├── auth-service/             # Authentication
├── tenant-service/           # Tenant management
├── ledger-service/           # Journal entries
├── reports-service/           # Financial reports
├── frontend/                 # React application
├── docker-compose.yml        # Docker orchestration
├── start.sh                 # Startup script
└── README.md                # This file
```

### Code Standards
- Java 17 with Spring Boot 3.2
- TypeScript with React 18
- Clean Architecture principles
- DTO pattern for API contracts
- Comprehensive error handling
- Unit and integration tests

### Database Schema
- Multi-tenant PostgreSQL database
- Flyway migrations for schema management
- Optimized indexes for performance
- Data validation constraints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints
- Examine the test cases

## 🔮 Roadmap

- [ ] Advanced reporting features
- [ ] Mobile application
- [ ] Third-party integrations
- [ ] Advanced analytics
- [ ] Workflow automation
- [ ] Multi-currency support
- [ ] Advanced security features
- [ ] Performance optimizations

---

**Happy Accounting! 📊✨**