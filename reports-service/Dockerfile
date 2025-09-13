# Multi-stage build for optimized image size
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy dependency files first for better layer caching
COPY pom.xml .
COPY shared/pom.xml shared/
COPY reports-service/pom.xml reports-service/

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -pl reports-service -am

# Copy source code
COPY shared/ shared/
COPY reports-service/ reports-service/

# Build the application
RUN mvn clean package -pl reports-service -am -DskipTests -o

# Runtime stage with distroless image for security
FROM eclipse-temurin:21-jre-alpine

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy the JAR file
COPY --from=build /app/reports-service/target/*.jar app.jar

# Change ownership to non-root user
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8087

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8087/actuator/health || exit 1

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
