services:  
  dashboard:
    build:
      context: ./dashboard
    container_name: "front"
    #entrypoint: "dockerize -template .docker/.env:.env -template .docker/Sao_Paulo:/etc/localtime ./.docker/docker-entrypoint.sh"
    tty: true
    volumes:
      - ./dashboard:/usr/src/app
    ports:
      - "3000:3000"

  backend:
    build:
      context: ./backend
    entrypoint: "dockerize -template .docker/.env:.env"
    volumes:
      - ./backend:/usr/src/app
    container_name: "backend"
    command: "npm start"
    ports:
      - "8000:8000"
      - "8001:8001"

  db-back:
    image: "postgres:13"
    container_name: db-back
    restart: always
    tty: true
    environment:
      POSTGRES_DB: backend
      POSTGRES_USER: esp
      POSTGRES_PASSWORD: esp
    volumes:
      - ./db/:/var/lib/postgresql/data/
      - ./init:/docker-entrypoint-initdb.d
    ports:
      - 5435:5435
    command: -p 5435

  mqtt-broker:
    image: eclipse-mosquitto:latest
    container_name: mqtt-broker
    ports:
      - "1884:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
