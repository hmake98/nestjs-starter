<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Installation

```bash
$ npm install
```

## Running the Server

```bash
# development
$ npm run dev

# production
$ npm start
```

## Running services on Docker

```bash

docker-compose up
```

## Build

```bash
npm run build
```

## Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# run tests in local
$ npm run test:local

# run e2e tests in local
$ npm run test:local-e2e
```

## Run Database commands using Nesjs Console

```bash
# will list down all commands related with database.
$ npm run console:dev db
```

## Swagger Documentation

- Swagger documentation endpoint will be running at <b> `/docs` </b>.

## K8s Deployment Local

```bash
# first start minikube
minikube start

# deployment
kubectl apply -f k8s/

# get endpoint of k8s cluster
minikube service nestjs-starter-service
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
