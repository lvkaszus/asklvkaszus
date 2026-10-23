FROM node:lts-alpine3.22

WORKDIR /asklvkaszus/frontend

# WORKDIR is created by root. The application runs as the unprivileged "node" user
# and needs to write here (node_modules, the build output and index.html).
RUN chown node:node /asklvkaszus/frontend

ENV TZ="Europe/Warsaw"

ENV DOMAIN="https://ask.lvkasz.us"
ENV YOUR_NICKNAME="@me"

USER node

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3031

ENV NODE_ENV="production"

CMD ["sh", "start.sh"]
