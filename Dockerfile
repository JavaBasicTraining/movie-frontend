# Step 1: Build the React app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Remove existing Yarn if it exists
RUN rm -f /usr/local/bin/yarn

# Install Yarn with force
RUN npm install -g yarn --force

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN yarn build

# Step 2: Serve the app with Node.js
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the build output to the new image
COPY --from=build /app/build /app/build

# Install serve globally
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "build", "-l", "3000"]