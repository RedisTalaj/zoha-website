# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Create a directory inside the container
WORKDIR /app

# Copy the contents of the Java project folder into the /app directory
COPY ./ArchitectureWebsite/ .

# --- THIS IS THE CRITICAL DEBUGGING STEP ---
# List all files in the current directory (/app) to see what was copied.
# This will be printed in the Render build log.
RUN ls -la

# Attempt to add executable permissions to the Maven wrapper script
RUN chmod +x mvnw

# Run the Maven commands
RUN ./mvnw dependency:go-offline
RUN ./mvnw clean package -DskipTests

# Expose the correct port
EXPOSE 8085

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]