FROM node:18

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install

EXPOSE 8080

CMD ["npx", "webpack", "serve"]
