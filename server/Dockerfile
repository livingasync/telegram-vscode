
FROM node:14

WORKDIR /app

COPY src/package*.json ./

RUN npm install --only=production

COPY src/telegram-proxy-server.js .

EXPOSE 49152

CMD [ "node", "telegram-proxy-server.js" ]
