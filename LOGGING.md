# Universal Accounting Platform - Logging Documentation

## Overview

The Universal Accounting Platform implements comprehensive structured logging across all microservices with centralized log aggregation using the ELK (Elasticsearch, Logstash, Kibana) stack.

## Logging Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Services      │    │   Filebeat      │    │   Logstash      │
│                 │───▶│                 │───▶│                 │
│ - Auth Service  │    │ - Log Collector │    │ - Log Processor │
│ - Tenant Service│    │ - Log Shipper   │    │ - Log Parser    │
│ - Ledger Service│    │                 │    │                 │
│ - Reports Service│   │                 │    │                 │
│ - Gateway       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │  Elasticsearch  │
                                               │                 │
                                               │ - Log Storage   │
                                               │ - Search Engine │
                                               │ - Indexing      │
                                               └─────────────────┘
                                                       │
                                                       ▼
                                               ┌─────────────────┐
                                               │     Kibana      │
                                               │                 │
                                               │ - Log Dashboard │
                                               │ - Visualization │
                                               │ - Analysis      │
                                               └─────────────────┘
```

## Service Logging Configuration

### 1. Logback Configuration

Each service uses a `logback-spring.xml` configuration file that provides:

- **JSON Structured Logging**: All logs are formatted as JSON for easy parsing
- **Console and File Output**: Logs are written to both console and files
- **Log Rotation**: Automatic log rotation with size and time-based policies
- **Service Identification**: Each log entry includes service name and environment

### 2. Log Levels

- **ERROR**: System errors, exceptions, critical failures
- **WARN**: Warning conditions, deprecated usage, potential issues
- **INFO**: General information, service startup, important events
- **DEBUG**: Detailed debugging information, SQL queries, method calls

### 3. Log Patterns

#### Console Logs
```
%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level [%logger{36}] - %msg%n
```

#### File Logs
```
%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level [%logger{36}] - %msg%n
```

#### JSON Logs (for ELK)
```json
{
  "@timestamp": "2025-09-15T20:00:00.000Z",
  "level": "INFO",
  "logger_name": "com.universal.accounting.auth.service.AuthService",
  "message": "User login successful",
  "service": "auth-service",
  "environment": "docker",
  "thread_name": "http-nio-8082-exec-1",
  "user_id": 123,
  "username": "john.doe",
  "tenant_id": 1,
  "request_id": "req-123456"
}
```

## Log Categories

### 1. Authentication & Authorization Logs
- User login/logout events
- Token generation and validation
- Security violations
- Permission checks

### 2. Business Logic Logs
- Tenant operations
- Ledger entries
- Report generation
- Data validation

### 3. System Logs
- Service startup/shutdown
- Health checks
- Database connections
- External API calls

### 4. Performance Logs
- Response times
- Database query performance
- Memory usage
- CPU utilization

## Centralized Logging Setup

### 1. ELK Stack Components

#### Elasticsearch
- **Port**: 9200
- **Purpose**: Log storage and search engine
- **Configuration**: Single-node setup for development

#### Logstash
- **Port**: 5044 (Beats input), 9600 (API)
- **Purpose**: Log processing and transformation
- **Configuration**: Parses JSON logs and adds metadata

#### Kibana
- **Port**: 5601
- **Purpose**: Log visualization and analysis
- **Configuration**: Connected to Elasticsearch

#### Filebeat
- **Purpose**: Log collection and shipping
- **Configuration**: Collects logs from containers and files

### 2. Log Indexes

Logs are indexed by date with the pattern: `universal-accounting-logs-YYYY.MM.DD`

### 3. Log Retention

- **File Logs**: 30 days (configurable)
- **Elasticsearch**: 30 days (configurable)
- **Log Rotation**: 100MB per file, max 30 files

## Monitoring and Alerting

### 1. Key Metrics to Monitor

- **Error Rate**: Percentage of ERROR level logs
- **Response Time**: API response times from logs
- **Authentication Failures**: Failed login attempts
- **Database Errors**: Connection and query failures

### 2. Log Patterns to Watch

- **High Error Rate**: `level:ERROR` frequency
- **Slow Queries**: Database query times > 1 second
- **Authentication Issues**: Multiple failed login attempts
- **Memory Issues**: OutOfMemoryError occurrences

### 3. Kibana Dashboards

#### Application Overview Dashboard
- Service health status
- Request/response metrics
- Error rates by service

#### Security Dashboard
- Authentication events
- Failed login attempts
- Security violations

#### Performance Dashboard
- Response times
- Database performance
- System resource usage

## Log Analysis Examples

### 1. Find All Errors in the Last Hour
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "level": "ERROR"
          }
        },
        {
          "range": {
            "@timestamp": {
              "gte": "now-1h"
            }
          }
        }
      ]
    }
  }
}
```

### 2. Find Slow Database Queries
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "logger_name": "org.hibernate.SQL"
          }
        },
        {
          "range": {
            "duration": {
              "gte": 1000
            }
          }
        }
      ]
    }
  }
}
```

### 3. Find Authentication Failures
```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "event_type": "authentication_failure"
          }
        },
        {
          "range": {
            "@timestamp": {
              "gte": "now-24h"
            }
          }
        }
      ]
    }
  }
}
```

## Best Practices

### 1. Logging Guidelines

- **Use Structured Logging**: Always log in JSON format
- **Include Context**: Add relevant metadata (user_id, request_id, etc.)
- **Avoid Sensitive Data**: Never log passwords, tokens, or PII
- **Use Appropriate Levels**: ERROR for failures, INFO for important events
- **Add Correlation IDs**: Use request_id for tracing across services

### 2. Performance Considerations

- **Async Logging**: Use async appenders for better performance
- **Log Level Management**: Use DEBUG only when needed
- **Log Rotation**: Implement proper log rotation policies
- **Resource Monitoring**: Monitor disk space for log files

### 3. Security Considerations

- **Data Sanitization**: Remove sensitive information from logs
- **Access Control**: Limit access to log files and Kibana
- **Audit Logging**: Log all security-relevant events
- **Compliance**: Ensure logging meets regulatory requirements

## Troubleshooting

### 1. Common Issues

#### Logs Not Appearing in Kibana
- Check Filebeat configuration
- Verify Logstash pipeline
- Check Elasticsearch connection

#### High Disk Usage
- Check log rotation settings
- Verify log retention policies
- Monitor Elasticsearch disk usage

#### Performance Issues
- Check log level settings
- Monitor async appender queues
- Review log processing pipeline

### 2. Debug Commands

```bash
# Check service logs
docker-compose logs auth-service

# Check Filebeat status
docker-compose exec filebeat filebeat status

# Check Elasticsearch indices
curl -X GET "localhost:9200/_cat/indices?v"

# Check Logstash pipeline
curl -X GET "localhost:9600/_node/pipelines"
```

## Configuration Files

### Service Logback Configuration
- `auth-service/src/main/resources/logback-spring.xml`
- `tenant-service/src/main/resources/logback-spring.xml`
- `ledger-service/src/main/resources/logback-spring.xml`
- `reports-service/src/main/resources/logback-spring.xml`
- `gateway/src/main/resources/logback-spring.xml`

### ELK Stack Configuration
- `logging/logstash.conf` - Logstash pipeline configuration
- `logging/filebeat.yml` - Filebeat configuration
- `docker-compose.yml` - ELK stack service definitions

## Getting Started

1. **Start the ELK Stack**:
   ```bash
   docker-compose up -d elasticsearch logstash kibana filebeat
   ```

2. **Access Kibana**:
   - Open http://localhost:5601
   - Create index pattern: `universal-accounting-logs-*`

3. **View Logs**:
   - Go to Discover section in Kibana
   - Filter by service, level, or time range
   - Create dashboards for monitoring

4. **Monitor Services**:
   - Check service health in Kibana
   - Set up alerts for critical errors
   - Monitor performance metrics

## Support

For logging-related issues:
1. Check service logs: `docker-compose logs <service-name>`
2. Verify ELK stack status: `docker-compose ps`
3. Check Kibana for log visualization
4. Review this documentation for configuration details
