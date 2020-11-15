FROM node:12.19.0-alpine3.12 as build
WORKDIR /app
#Copy the react app to the container.
COPY . /app/

ENV REST_API_URL=http://localhost:8000/
# Add bash
# RUN apk add --no-cache bash
# RUN chmod +x env.sh && bash env.sh  && cp env-config.js ./public/
# COPY  ./env-config.js ./public/ 
# Prepare the container for building react.
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm run build

#Prepare NginX
FROM nginx:1.19.3-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d


#Expose the container's http port
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]