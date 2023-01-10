<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Prerequisite

- Create `.env` file based on your environment like,
  - for development > `.env.development`
  - for staging > `.env.stage`
  - for production > `.env.proudction`
- For more information about env variables, refer `example.env` file.

## Installation

```bash
$ npm install
```

## Running the Server

```bash
# development
$ npm start

# production
$ npm run start:prod
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

### Run Database commands using Console

- `npm run console:dev db` will list down all commands related with database.

### Swagger Documentation

- Swagger documentation endpoint will be running at <b>`http://host:port/api` </b>.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
