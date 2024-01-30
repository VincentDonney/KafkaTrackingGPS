# Use official Node.js image as the base image
FROM node:20 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Build the Angular app
RUN npm run build --omit=dev

# Use NGINX to serve the Angular application
FROM nginx:alpine

# Copy the built app from the 'builder' stage to NGINX html directory
COPY --from=builder /app/dist/* /usr/share/nginx/html/

EXPOSE 4200

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]

# Test NGINX configuration
RUN nginx -t





