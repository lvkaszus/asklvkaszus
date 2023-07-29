FROM node:current-alpine3.18

WORKDIR /asklvkaszus/frontend

ENV API_DOMAIN_NAME="127.0.0.1"
ENV YOUR_NICKNAME="me"

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3031

CMD ["sh", "start.sh"]