# Step 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build jar file
RUN mvn clean package -DskipTests


# Step 2: Run the application
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run app
CMD ["java", "-jar", "app.jar"]