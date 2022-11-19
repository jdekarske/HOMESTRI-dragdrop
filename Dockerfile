FROM node:16-alpine3.11

WORKDIR /home

COPY . .

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm i

EXPOSE 8080

CMD ["npm", "run", "start"]
