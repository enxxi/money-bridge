#Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy environment variables file
COPY .production.env .production.env

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with he production build
RUN npm run build

# Start the server using the production build
CMD ["npm","run", "start:prod"]