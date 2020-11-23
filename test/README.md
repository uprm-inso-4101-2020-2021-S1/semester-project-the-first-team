# Functional testing our Backend and User Interface with Docker, Cucumber Java, Selenium Java
These are the tests used by our backend to verify functionality. We use them for testing no changes affect any already established behaviour and for testing the requirements are appropriately established.

## Requirements

- Postgresql database - 12+
- Express Cuts Rest API running
- Express Cuts UI running
- Maven - 3.6.3+
- Java - 11+
- Docker Client - 19.03.12+
- Docker Engine - 19.03.13+
- Docker Compose - 1.27.4+

## Environment Variables for tests

These are the environment variables used by the tests for running

| Environment Variable | Required | Description |
| ------------- | ------------- | ------------- |
| REST_API_URI | true | The URI on which the Rest API is deployed to connect and run routes. |
| EXPRESS_UI_URL | true | The URI on which the Express Cuts UI is deployed to connect to. |
| SELENIUM_HUB_URL | false | The URL on which the Selenium hub grid is located. |


## Run tests with Docker (Recommended)
Make sure all the requirements are met before running the tests. To start, cd into the test directory and first run **mvn clean package** to move into a jar all the tests and then run **docker-compose up --abort-on-container-exit --exit-code-from tester** which will run all the backend tests and frontend tests currently implemented. It is recommended to later delete the image for the tests in order to recreate them each time so after the tests finish, run **docker-compose down; docker rmi verification-tests**

## Run test locally (For development)
After the backend and databse are running, you can cd into the test directory and run **mvn clean package** which will generate the jar needed for running the tests and then run **java -cp target/tester.jar:target/libs/\* org.testng.TestNG -testclass express.cucumber.runners.RestAPITestRunner** which will run the backend tests currently implemented or if you want to run the UI tests then you would need to download the chrome-webdriver from the [selenium website](https://sites.google.com/a/chromium.org/chromedriver/downloads), start it manually running on **localhost:9515** and then run **java -Dwebdriver.chrome.driver=<Path/to/chrome-driver> -cp target/tester.jar:target/libs/\* org.testng.TestNG -testclass express.cucumber.runners.UITestRunner**. You would also need to export some environment variables needed for the tests: REST_API_URI for the URI of the running backend, and EXPRESS_UI_URL for the URL of the UI for the tests to run correctly.

**IMPORTANT:** Test are sometimes based on hardcoded data which could be affected when running locally with an already established database with previous data.