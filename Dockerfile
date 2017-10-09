FROM node:8-alpine
MAINTAINER Anthony Liu <ajliu@gatech.edu>

RUN apk update && apk add \
    git \
    expect \
    bash \
    curl

# Install latest npm version (in case Node.js hasn't updated with the newest version yet)
# npm install -g npm@latest doesn't work -> see https://github.com/npm/npm/issues/15611#issuecomment-289133810 for this hack
RUN npm install npm@"~5.4.0" && rm -rf /usr/local/lib/node_modules && mv node_modules /usr/local/lib

RUN mkdir -p /usr/src/pipes
WORKDIR /usr/src/pipes

# Bundle app source
COPY . /usr/src/pipes

RUN npm install 
RUN npm install typescript
RUN npm run build 

EXPOSE 3001
CMD ["npm", "run", "start"]