FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy tsconfig.json and source files
COPY tsconfig.json ./
COPY src ./src

# Build the app
RUN npm run build

# Verify the dist directory exists after build
RUN ls -la dist

EXPOSE 3000

CMD ["npm", "start"]