FROM node:18-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . ./
# Probably not ideal as there will be unused files in the container
RUN npm run build

EXPOSE 80
CMD [ "npm", "run", "serve" ]
