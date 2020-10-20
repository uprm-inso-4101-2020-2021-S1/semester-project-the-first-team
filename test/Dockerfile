FROM maven:3.6.3-openjdk-11

# Add jar with dependencies to container
COPY target/tester.jar /usr/share/tag/tester.jar
COPY target/libs /usr/share/tag/libs

# Include source in container
COPY src/test/resources /usr/share/tag/src/test/resources
COPY src/test/java /usr/share/tag/src/test/java
COPY pom.xml /usr/share/tag/pom.xml

# Include start test script
COPY start-test.sh /usr/share/tag/start-test.sh

WORKDIR /usr/share/tag/

CMD ./start-test.sh