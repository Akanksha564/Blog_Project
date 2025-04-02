# Use official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend project
COPY . .

# Expose the frontend port
EXPOSE 5005

# Start the React app
CMD ["npm", "start"]

