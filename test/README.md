# Functional testing our Backend and User Interface with Docker, Cucumber Java, Selenium Java
These are the tests used by our backend to verify functionality. We use them for testing no changes affect any already established behaviour and for testing the requirements are appropriately established.

## Run tests with Docker (Recommended)
To run the tests you only need to have docker installed in your system and docker compose. You can then cd into the test directory and run **docker-compose up --abort-on-container-exit --exit-code-from tester db rest tester** which will run the backend tests currently implemented.

## Run test locally (For development)
To run the tests locally you need to have the database and backend running. You would need java 11 and maven 3.6 installed in your system for this to work. After the backend and databse are running, you can cd into the test directory and run **mvn clean package** which will generate the jar needed for running the tests and then run **java -cp target/tester.jar:target/libs/\* org.testng.TestNG -testclass express.cucumber.runners.RestAPITestRunner** which will run the backend tests currently implemented. You would also need to export some environment variables needed for the tests: REST_API_URI for the URI of the running backend. 

**IMPORTANT:** Test are sometimes based on hardcoded data which could be affected when running locally with an already established database with previous data.