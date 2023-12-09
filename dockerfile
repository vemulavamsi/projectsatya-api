FROM ubuntu:18.04
USER root
RUN apt-get update -qq \
    && apt-get install -qqy apt-transport-https ca-certificates curl gnupg2 software-properties-common
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable \
    $(lsb_release -cs) \
    stable"
RUN apt-get update  -qq \
    && apt-get -y install docker-ce
RUN apt-get install -y \
    unzip \
    curl \
    && apt-get clean \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf \
    awscliv2.zip \
    && apt-get -y purge curl \
    && apt-get -y purge unzip
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl
# Use an official Ubuntu runtime as a parent image

# Install dependencies
# RUN apt-get update && apt-get install -y wget

# Download and install Filebeat
# RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add -
# RUN sh -c 'echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" > /etc/apt/sources.list.d/elastic-7.x.list'
# RUN apt-get update && apt-get install -y filebeat

# # Copy Filebeat configuration file
# COPY filebeat.yml /etc/filebeat/filebeat.yml

# # Use the official Elasticsearch image as the base image
# FROM docker.elastic.co/elasticsearch/elasticsearch:7.16.3

# # Add your custom Elasticsearch configuration
# COPY elasticsearch.yml /usr/share/elasticsearch/config/

# Install nodemon
RUN npm install -g nodemon

ARG NODE_VERSION=14.16.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE ${PORT}

CMD ["nodemon", "server.js"]

