# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set a working directory for the whole build process
WORKDIR /build

# Copy the ENTIRE Java project folder into the build environment
COPY ./ArchitectureWebsite .

# --- THIS IS THE FIX for "exit code: 127" ---
# Add executable permissions to the Maven wrapper script
RUN chmod +x ./mvnw

# Now that it's executable, we can run it.
# Download project dependencies
RUN ./mvnw dependency:go-offline

# Package the application into a JAR file, skipping tests
RUN ./mvnw clean package -DskipTests

# Expose the correct port
EXPOSE 8085

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]