# Use the official Node.js 16 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies using npm
RUN npm i

# Copy the rest of the application code to the working directory
COPY . .

# Set environment variables for configuration
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port on which the application will run
EXPOSE $PORT
RUN npm run build

# Run the application
CMD npm start -- -H 0.0.0.0