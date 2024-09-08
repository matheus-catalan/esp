FROM node:20.16.0-alpine

RUN apk update && apk add --no-cache --no-progress python3 make g++ gcc tzdata wget

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz --quiet \
  && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

COPY . .

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["yarn", "dev"]
