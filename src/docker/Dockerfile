FROM openjdk:8-jre-alpine

ENV SPRING_OUTPUT_ANSI_ENABLED=ALWAYS \
    JHIPSTER_SLEEP=0 \
    JAVA_OPTS=""

# add directly the jar
# ADD *.jar /app.jar

EXPOSE 8082
CMD echo "The application will start in ${JHIPSTER_SLEEP}s..." && \
    sleep ${JHIPSTER_SLEEP} && \
    node build/build.js BASE_API=10.254.100.203:8010
   # java ${JAVA_OPTS} -Djava.security.egd=file:/dev/./urandom -jar /app.jar
