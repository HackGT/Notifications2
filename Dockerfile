FROM node:alpine
MAINTAINER Anthony Liu <ajliu@gatech.edu>

RUN mkdir -p /usr/src/notifications
WORKDIR /usr/src/notifications

# Bundle app source
COPY . /usr/src/notifications
RUN npm install
EXPOSE 3000
CMD ["npm", "run start"]