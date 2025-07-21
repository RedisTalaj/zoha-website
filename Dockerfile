# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Create a directory for our application
WORKDIR /app

# Copy the entire Java project into the /app directory
COPY ./ArchitectureWebsite /app

# --- THIS IS THE CRITICAL LINE ---
# Add executable permissions to the Maven wrapper script inside the container
RUN chmod +x mvnw

# Now, run the Maven commands
RUN ./mvnw dependency:go-offline
RUN ./mvnw clean package -DskipTests

# Expose the correct port
EXPOSE 8085

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]