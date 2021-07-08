FROM node:alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

COPY . .

RUN npm install

RUN npm run test

ENV NODE_ENV=production
RUN npm run db:seed

CMD ["npm", "start"]