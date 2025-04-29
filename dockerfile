FROM node:21-alpine3.19

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./

RUN npm install 
RUN npm install -g @nestjs/cli

COPY . .

RUN npx prisma generate

EXPOSE 3001