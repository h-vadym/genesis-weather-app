FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 9000

ENV NODE_ENV=production

CMD ["node", "dist/src/main"]
