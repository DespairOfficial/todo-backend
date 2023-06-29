FROM node:18-alpine

WORKDIR /usr/src/app

COPY prisma ./prisma/

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:migrate:prod" ]