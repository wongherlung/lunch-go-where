# Stage 1: Build the React application
# We use a Node.js image to build our static files.
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json ./
# If you have a package-lock.json, copy it too
# COPY package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app for production
RUN npm run build

# Stage 2: Serve the application using a lightweight Node server
# This image only contains the built app and a server, making it small and secure.
FROM node:22-alpine

WORKDIR /app

# Install 'serve', a static file serving library
RUN npm install -g serve

# Copy the built static files from the 'build' stage
COPY --from=build /app/dist ./dist

# Expose the port 'serve' will run on (default is 8080)
EXPOSE 8080

# Start the server and serve the 'dist' folder.
# The '-s' flag is important for single-page apps (like React)
# as it redirects all requests to index.html.
CMD ["serve", "-s", "dist"]
