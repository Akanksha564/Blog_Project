# Use Node.js for building the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend project
COPY . .

# Set environment variables (update as needed)
ENV REACT_APP_API_URL=http://localhost:8005

# Build the React app for production
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static files
RUN rm -rf ./*

# Copy built React app from the previous stage
COPY --from=build /app/build ./

# Expose port 5005
EXPOSE 5005

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
