# NestJS Starter Boilerplate [![CodeQL](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/hmake98/nestjs-starter/actions/workflows/github-code-scanning/codeql)

## Installation

```bash
$ yarn
```

## Running Server

```bash
# development
$ yarn dev

# production
$ yarn start
```

## Running all services on Docker

```bash
docker-compose up --build
```

## Run only database and redis services on Docker

```bash
docker-compose up postgres redis
```

## Build

```bash
yarn build
```

## Tests

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
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

## Author

🇮🇳 Harsh Makwana <br>
[Github](https://github.com/hmake98/nestjs-starter)
[Linkedin](https://www.linkedin.com/in/hmake98)
[Instagram](https://www.instagram.com/hmake98)
