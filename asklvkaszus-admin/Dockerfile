FROM node:current-alpine3.18

WORKDIR /asklvkaszus/admin

ENV YOUR_NICKNAME="me"

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3032

CMD ["sh", "start.sh"]