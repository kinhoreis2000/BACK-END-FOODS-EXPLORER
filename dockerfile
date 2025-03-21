FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with production flag
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 5000

# Start the app
CMD ["node", "src/server.js"]