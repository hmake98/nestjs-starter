import { config } from 'dotenv';
config({ path: `.env${process.env.NODE_ENV !== 'development' ? '.' + process.env.NODE_ENV : ''}` });
import { Logger as NestLogger,ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './core/interceptors';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as express from 'express';
import * as helmet from 'helmet';
import * as session from 'express-session';
import { Logger } from 'nestjs-pino';
// import { fork, on, isMaster } from 'cluster';
// import * as os from 'os';

const baseUrl = '/api';
const docsEndpoint = process.env.DOCS_ENDPOINT || '/docs';
const port = process.env.PORT || 3000;
const logger = new NestLogger();

function configureSwagger(app): void {
  const config = new DocumentBuilder().setTitle('Nest-Starter').setDescription('description').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsEndpoint, app, document);
}

async function bootstrap(): Promise<void> {
  const expressServer = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressServer), { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(baseUrl);
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.use(helmet());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors();
  configureSwagger(app);
  await app.init();
  await app.listen(port);
  logger.log(`Server is listening on port ${port}`);
}

// declare let global: any;

// configuration of new cluster. 
// adv of cluster is if you're using multi-core cpus in ec2 instance, 
// without clustering the server will only able to use single core.
// with clustering the server will able to use multiple cores of the instance.

// if (require.main === module || global.PhusionPassenger) {
//   if (isMaster) {
//     const totalCPUs = os.cpus().length;
//     console.log(`Master ${process.pid} is running`);
//     for (let i = 0; i < totalCPUs; i++) {
//       fork();
//     }
//     on('exit', (worker, code, signal) => {
//       console.log(`worker ${worker.process.pid} died`);
//       console.log("Let's fork another worker!");
//       fork();
//     });
//   } else {
//     bootstrap();
//   }
// }

bootstrap();
