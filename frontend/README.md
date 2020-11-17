# Express Cuts - Frontend

This is the frontend implementation for the Express Cuts project. Implemented for the Software Engineering class using ReactJS and Bootstrap.

## Requirements

- Node.js - 14.15.0+
- Express Cuts Rest API deployment to connect to

## Environment Variables for UI

These are the environment variables used by the User Interface for running. Read below on an example on how to set when running locally.

| Environment Variable | Required | Description |
| ------------- | ------------- | ------------- |
| REST_API_URL | true | The URI on which the Rest API is deployed to connect and run routes. |

## Usage

Its best to use the Dockerfile to build the User Interface as a Docker image to run and set the appropriate environment variables. If you wish to run locally follow the steps below.

- Make sure to install all the required packages by running the following
  command while inside the frontend directory (only required before
  running the app for the first time):

  `npm install`

* To start the server first create an *env-config.js* file in the public folder. Fill in the folder with the required environment variables as listed above as a json object named window._env_ like below
  ```json
  window._env_ = {
      "REST_API_URL":"http://localhost:8000/api/"
  }
  ```

  Then run the following command while inside the frontend directory:

    `npm start`

* Current functional routes are:

1. http://localhost:3000/customers
2. http://localhost:3000/stylists
