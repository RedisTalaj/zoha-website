# Use an official OpenJDK 17 runtime as a parent image
FROM openjdk:17-jdk-slim

# Create a directory inside the container
WORKDIR /app

# --- THIS IS THE FIX ---
# Copy the contents of the Java project folder into the /app directory
COPY ./ArchitectureWebsite/ .

# Now, we are certain that mvnw, pom.xml, etc., are in our current directory (/app)

# Add executable permissions to the Maven wrapper script
RUN chmod +x mvnw

# Run the Maven commands
RUN ./mvnw dependency:go-offline
RUN ./mvnw clean package -DskipTests

# Expose the correct port
EXPOSE 8085

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]