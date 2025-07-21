# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and the pom.xml file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download project dependencies
# This is a best practice to leverage Docker layer caching
RUN ./mvnw dependency:go-offline

# Copy the project source
COPY src ./src

# Package the application into a JAR file, skipping tests for faster builds
RUN ./mvnw clean package -DskipTests

# Expose the port the app runs on (must match server.port in application.properties)
EXPOSE 8085

# The command to run when the container starts
# IMPORTANT: Check that this .jar file name matches what's in your /target folder
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]