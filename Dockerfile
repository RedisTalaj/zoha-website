# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Set a working directory for the whole build process
WORKDIR /build

# --- THIS IS THE FIX ---
# Copy the ENTIRE Java project folder into the build environment
COPY ./ArchitectureWebsite .

# Now, all subsequent commands will run from inside the '/build' directory,
# which now contains your project structure (pom.xml, src, .mvn, etc.)

# Download project dependencies
RUN ./mvnw dependency:go-offline

# Package the application into a JAR file, skipping tests
RUN ./mvnw clean package -DskipTests

# Expose the correct port
EXPOSE 8085

# The command to run when the container starts
# The path to the JAR file is now relative to our WORKDIR
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]