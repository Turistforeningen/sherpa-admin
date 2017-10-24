FROM node:8-alpine

# Add our user and group first to make sure their IDs get assigned consistently
RUN addgroup -S app && adduser -S -g app app

# Create a directory where the application code should live and set it as the
# current working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install nodemon which we'll use to start and monitor the application
RUN npm install -g nodemon

# Only copy the package.json which specifies package dependencies. This is will
# ensure that packages are only re-installed if they are changed.
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Change the ownership of the application code and switch to the unprivileged
# user.
RUN chown -R app:app /usr/src/app
USER app
