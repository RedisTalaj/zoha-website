FROM openjdk:17-jdk-slim
WORKDIR /app
COPY ./ArchitectureWebsite/ .
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "target/ArchitectureWebsite-0.0.1-SNAPSHOT.jar"]