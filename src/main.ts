import { config } from 'dotenv';
config({ path: `.env${process.env.NODE_ENV !== 'development' ? '.' + process.env.NODE_ENV : ''}` });
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './core/interceptors';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as morgan from 'morgan';
import * as json from 'morgan-json';
import * as express from 'express';
import * as helmet from 'helmet';
import * as session from 'express-session';
// import { fork, on, isMaster } from 'cluster';
// import * as os from 'os';

const baseUrl = process.env.BASE_URL || '/api';
const docsEndpoint = process.env.DOCS_ENDPOINT || '/docs';
export function configureApp(app): void {
  app.setGlobalPrefix(baseUrl);
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
}

function configureSwagger(app): void {
  const config = new DocumentBuilder().setTitle('Nest-Starter').setDescription('demo description').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsEndpoint, app, document);
}

async function bootstrap(): Promise<void> {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  const expressServer = express();

  // configure logging
  const logger = new Logger();
  if (!isDevelopment) {
    const format = json(':remote-addr :method :url :status :res[content-length] :referrer :user-agent');
    expressServer.use(
      morgan(format, {
        stream: {
          write: (objString: string) => {
            // Yes, the JSON.parse() is terrible.
            // But morgan concatenates the obj with "\n" before calling write().
            logger.log({ ...JSON.parse(objString), tag: 'request' });
          },
        },
      }),
    );
  } else {
    expressServer.use(morgan('dev'));
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressServer), { logger });

  configureApp(app);
  configureSwagger(app);

  app.use(helmet());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors();

  await app.init();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server is listening on port ${port}`);
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
