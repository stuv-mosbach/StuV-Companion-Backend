FROM node:10-alpine

# Creating directory
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Setting app directory
WORKDIR /home/node/app

# Copying the package.json
COPY package*.json ./

# Using node user to npm i
USER node
RUN npm install

# Copying the code with right permission
COPY --chown=node:node . .

# Publish the app port
EXPOSE 8080

# run
CMD [ "node", "./backend.js" ]
