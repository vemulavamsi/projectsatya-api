FROM ubuntu:18.04
USER root

# Install Node.js and npm
ARG NODE_VERSION=20.5.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

# Install curl and dependencies
RUN apt-get update -qq \
    && apt-get install -qqy curl \
    && apt-get install -y software-properties-common

# Install Node.js
RUN curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/

# Install npm globally
RUN $NODE_HOME/bin/npm install -g npm@6.14.11

# Install Docker
RUN apt-get update -qq \
    && apt-get install -qqy apt-transport-https ca-certificates curl gnupg2 software-properties-common \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable $(lsb_release -cs) stable" \
    && apt-get update -qq \
    && apt-get -y install docker-ce

# Install AWS CLI
RUN apt-get install -y unzip \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip

# Clean up unnecessary packages
RUN apt-get -y purge curl unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application files
COPY . .

# Expose the port
ENV PORT=3000
EXPOSE $PORT

# Run the application
CMD ["node", "app.js"]
