# ===== Build Stage =====
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom and source
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ===== Run Stage =====
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]