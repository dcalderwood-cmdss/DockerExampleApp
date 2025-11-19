## Dockerfile for the Node.js application.
## Each instruction is annotated to clarify build intent and optimization rationale.

## Base image: official Node.js (latest). For production builds, pin a version like 'node:20-alpine'.
FROM node:14

## Set working directory inside the container. All subsequent relative paths are resolved from here.
WORKDIR /app

## Copy dependency manifest first to leverage Docker layer caching.
COPY package.json /app

## Install production + (currently) any listed dependencies. Use `npm ci` if you have a lockfile for reproducible builds.
RUN npm install 

## Copy the remainder of the application source into the image.
COPY . /app

## Document that the container listens on port 80. (This does not actually publish the port.)
EXPOSE 80

## Default startup command: run the Node.js server.
CMD ["node", "server.js"] 