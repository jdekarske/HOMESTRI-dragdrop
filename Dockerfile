FROM node:16-alpine3.11

WORKDIR /home

COPY . .

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm i && npx webpack

EXPOSE 8080

# CMD ["npx http-server -s"]