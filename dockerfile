FROM ubuntu:18.04
USER root

# Install Node.js and npm using the package manager
RUN apt-get update -qq \
    && apt-get install -qqy curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -qqy nodejs \
    && apt-get install -y npm \
    && npm install -g npm@6.14.11

# Install Docker
RUN apt-get install -qqy apt-transport-https ca-certificates curl gnupg2 software-properties-common \
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
RUN apt-get -y purge curl gnupg unzip \
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
