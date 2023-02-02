

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Docker Compose
- First install docker desktop

- Fill the .env file from .env.example file
```bash
# This repository includes an .env.example file. Make a copy and rename it as .env
# If you have a different database connection fill it here
MONGO_CONNECTION_STRING=mongodb://test:test@mongodb:27017
JWT_SECRET=example_secret
```
- Run docker compose
```bash
$ docker-compose up

```
It will create and start a couple of containers
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
