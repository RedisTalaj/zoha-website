# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Create a directory for our application
WORKDIR /app

# --- THIS IS THE FIX ---
# Copy the entire Java project into the /app directory we just created.
# The files will now be at /app/pom.xml, /app/src, etc.
COPY ./ArchitectureWebsite /app

# Add executable permissions to the Maven wrapper script inside /app
RUN chmod +x mvnw

# Now, run the Maven commands
RUN ./mvnw dependency:go-offline
RUN ./mvnw clean package -DskipTests

# Expose the correct port
EXPOSE 8085

# The command to run when the container starts
# The path to the JAR file is now relative to our WORKDIR /app
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]