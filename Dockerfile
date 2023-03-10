FROM node:18-slim

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
