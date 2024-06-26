# Use an official Node.js runtime as a parent image
FROM node:20.10.0-alpine

# Set the working directory in the container
WORKDIR /ovarc
COPY . .

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY .env .env
RUN npm run build

# Bundle your app source

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start"]
