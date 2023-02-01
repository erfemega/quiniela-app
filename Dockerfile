
# Specify node version and choose image
# also name our image as development (can be anything)
FROM node:18-alpine

# Specify our working directory, this is in our container/in our image
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json /usr/src

# Here we install all the deps
RUN yarn install

# Bundle app source / copy all other files
COPY . /usr/src

# Build the app to the /dist folder
# RUN npm run build

EXPOSE 3001
CMD ["yarn", "start"]

