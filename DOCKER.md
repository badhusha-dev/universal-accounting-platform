# Docker Configuration Guide

This document provides comprehensive information about the Docker setup for the Universal Accounting Platform.

## 🐳 Overview

The project uses Docker and Docker Compose for containerization and orchestration. All services are containerized with optimized multi-stage builds for production readiness.

## 📁 Docker Files Structure

```
universal-accounting-platform/
├── .dockerignore                 # Root dockerignore for build optimization
├── docker-compose.yml           # Main compose file
├── docker-compose.override.yml  # Development overrides
├── docker-compose.prod.yml      # Production overrides
├── docker-build.sh              # Build optimization script
├── DOCKER.md                    # This documentation
├── frontend/
│   ├── .dockerignore            # Frontend-specific dockerignore
│   └── Dockerfile               # Frontend container definition
├── auth-service/
│   └── Dockerfile               # Auth service container definition
├── gateway/
│   └── Dockerfile               # API Gateway container definition
├── eureka-server/
│   └── Dockerfile               # Eureka server container definition
├── ledger-service/
│   └── Dockerfile               # Ledger service container definition
├── tenant-service/
│   └── Dockerfile               # Tenant service container definition
├── transaction-service/
│   └── Dockerfile               # Transaction service container definition
└── reports-service/
    └── Dockerfile               # Reports service container definition
```

## 🚀 Quick Start

### Prerequisites

- Docker Desktop 4.20+
- Docker Compose 2.20+
- At least 8GB RAM available for Docker
- At least 10GB free disk space

### Development Setup

1. **Start the application in development mode:**
   ```bash
   ./docker-build.sh up dev
   ```

2. **Or use docker-compose directly:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
   ```

### Production Setup

1. **Set environment variables:**
   ```bash
   export POSTGRES_PASSWORD="your_secure_password"
   export REDIS_PASSWORD="your_redis_password"
   export KAFKA_ADVERTISED_HOST="your_domain.com"
   export FRONTEND_API_URL="https://api.yourdomain.com"
   ```

2. **Start the application in production mode:**
   ```bash
   ./docker-build.sh up prod
   ```

3. **Or use docker-compose directly:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## 🛠️ Build Commands

### Using the Build Script

The `docker-build.sh` script provides optimized build commands:

```bash
# Build all services
./docker-build.sh build

# Build specific service
./docker-build.sh build auth-service

# Build without cache (clean build)
./docker-build.sh build --no-cache

# Build in parallel (faster)
./docker-build.sh build --parallel

# Rebuild from scratch
./docker-build.sh rebuild --no-cache
```

### Manual Build Commands

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build auth-service

# Build without cache
docker-compose build --no-cache auth-service

# Build with parallel processing
docker-compose build --parallel
```

## 🏗️ Architecture

### Services Overview

| Service | Port | Description | Dependencies |
|---------|------|-------------|--------------|
| **postgres** | 5432 | Primary database | - |
| **redis** | 6379 | Caching and sessions | - |
| **zookeeper** | 2181 | Kafka coordination | - |
| **kafka** | 9092 | Message broker | zookeeper |
| **kafka-ui** | 8081 | Kafka management UI | kafka |
| **eureka-server** | 8761 | Service discovery | - |
| **gateway** | 8080 | API Gateway | eureka-server |
| **auth-service** | 8082 | Authentication | eureka, postgres, redis, kafka |
| **tenant-service** | 8083 | Tenant management | eureka, postgres, kafka |
| **ledger-service** | 8084 | Core accounting | eureka, postgres, kafka |
| **transaction-service** | 8085 | Transaction processing | eureka, postgres, kafka |
| **reports-service** | 8087 | Financial reports | eureka, postgres, kafka |
| **frontend** | 3000 | React application | gateway |

### Image Specifications

#### Java Services (Spring Boot)
- **Base Image**: `eclipse-temurin:21-jre-alpine`
- **Build Image**: `maven:3.9.6-eclipse-temurin-21`
- **Security**: Non-root user execution
- **Optimization**: Multi-stage builds with layer caching
- **Memory**: JVM optimized for containers with `-XX:+UseContainerSupport`

#### Frontend (React)
- **Base Image**: `nginx:alpine`
- **Build Image**: `node:20-alpine`
- **Security**: Non-root user execution
- **Optimization**: Multi-stage builds with npm ci
- **Performance**: Optimized nginx configuration

#### Infrastructure Services
- **PostgreSQL**: `postgres:16-alpine`
- **Redis**: `redis:7-alpine`
- **Kafka**: `confluentinc/cp-kafka:7.6.0`
- **Zookeeper**: `confluentinc/cp-zookeeper:7.6.0`
- **Kafka UI**: `provectuslabs/kafka-ui:latest`

## 🔧 Configuration

### Environment Variables

#### Development (.env or docker-compose.override.yml)
```yaml
# Database
POSTGRES_DB: accounting_db_dev
POSTGRES_USER: accounting_user
POSTGRES_PASSWORD: accounting_pass_dev

# Redis
REDIS_PASSWORD: redis_pass_dev

# Kafka
KAFKA_ADVERTISED_HOST: localhost

# Frontend
REACT_APP_API_URL: http://localhost:8080
REACT_APP_ENV: development
```

#### Production (docker-compose.prod.yml)
```yaml
# Database
POSTGRES_DB: accounting_db
POSTGRES_USER: accounting_user
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}  # Set via environment

# Redis
REDIS_PASSWORD: ${REDIS_PASSWORD}  # Set via environment

# Kafka
KAFKA_ADVERTISED_HOST: ${KAFKA_ADVERTISED_HOST}

# Frontend
REACT_APP_API_URL: ${FRONTEND_API_URL}
REACT_APP_ENV: production
```

### Resource Limits

All services have configured resource limits:

#### Development
- **Memory**: 512M - 1G per service
- **CPU**: 0.25 - 0.5 cores per service

#### Production
- **Memory**: 1G - 3G per service
- **CPU**: 0.5 - 1.0 cores per service
- **Replicas**: 2 for high availability (except eureka-server)

## 🔍 Monitoring and Health Checks

### Health Checks

All services include health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
```

### Monitoring Endpoints

- **Eureka Dashboard**: http://localhost:8761
- **Kafka UI**: http://localhost:8081
- **Service Health**: `http://localhost:{port}/actuator/health`

### Logging

Logs are available through Docker Compose:

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth-service

# View last 100 lines
docker-compose logs --tail=100 auth-service
```

## 🧹 Maintenance

### Cleanup Commands

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Clean up unused Docker resources
./docker-build.sh clean

# Remove all images and rebuild
./docker-build.sh rebuild --no-cache
```

### Backup and Restore

#### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U accounting_user accounting_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U accounting_user accounting_db < backup.sql
```

#### Volume Backup
```bash
# Backup volumes
docker run --rm -v universal-accounting-platform_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volumes
docker run --rm -v universal-accounting-platform_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using a port
netstat -tulpn | grep :5432

# Kill process using port
sudo kill -9 $(lsof -t -i:5432)
```

#### 2. Memory Issues
```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
```

#### 3. Build Failures
```bash
# Clean build
./docker-build.sh rebuild --no-cache

# Check build logs
docker-compose build auth-service --no-cache --progress=plain
```

#### 4. Service Startup Issues
```bash
# Check service logs
docker-compose logs auth-service

# Check service health
curl http://localhost:8082/actuator/health

# Restart specific service
docker-compose restart auth-service
```

### Performance Optimization

#### 1. Enable BuildKit
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

#### 2. Use Docker Layer Caching
```bash
# Build with cache mount
docker build --cache-from myapp:latest -t myapp:latest .
```

#### 3. Parallel Builds
```bash
# Use parallel builds
./docker-build.sh build --parallel
```

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Guide](https://create-react-app.dev/docs/deployment/#docker)

## 🔒 Security Considerations

1. **Non-root Users**: All containers run as non-root users
2. **Minimal Images**: Using Alpine Linux for smaller attack surface
3. **Secrets Management**: Use Docker secrets or environment variables for sensitive data
4. **Network Isolation**: Services communicate through Docker networks
5. **Resource Limits**: Prevent resource exhaustion attacks
6. **Health Checks**: Ensure services are running properly

## 📊 Performance Metrics

Expected performance with default configuration:

- **Startup Time**: 2-3 minutes for full stack
- **Memory Usage**: 4-6GB total
- **CPU Usage**: 10-20% on modern hardware
- **Build Time**: 5-10 minutes (with cache)
- **Image Sizes**: 200-500MB per service
