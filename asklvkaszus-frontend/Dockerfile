FROM node:lts-slim

WORKDIR /asklvkaszus/frontend

ENV TZ="Europe/Warsaw"

ENV DOMAIN="https://ask.lvkasz.us"
ENV YOUR_NICKNAME="@me"

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3031

CMD ["sh", "start.sh"]