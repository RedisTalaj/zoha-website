# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# --- THIS IS THE FIX ---
# Copy files using their full path from the repository root.
# The 'ArchitectureWebsite/' prefix is added to each source path.
COPY ArchitectureWebsite/.mvn/ .mvn
COPY ArchitectureWebsite/mvnw ArchitectureWebsite/pom.xml ./

# Download project dependencies
RUN ./mvnw dependency:go-offline

# Copy the project source code
COPY ArchitectureWebsite/src ./src

# Package the application into a JAR file
RUN ./mvnw clean package -DskipTests

# Expose the port the app runs on
EXPOSE 8085

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]