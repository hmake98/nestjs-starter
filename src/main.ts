import { config } from 'dotenv';
config({ path: `.${process.env.NODE_ENV}.env` });
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors';
import { AppModule } from './app.module';
import 'reflect-metadata';
import * as morgan from 'morgan';
import * as json from 'morgan-json';
import * as express from 'express';
import * as helmet from 'helmet';
import * as session from 'express-session';
import { LogService } from './shared/services/logger.service';

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
  const config = new DocumentBuilder()
    .setTitle('ShefaHealth-API')
    .setDescription('ShefaHealth API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsEndpoint, app, document);
}

async function bootstrap(): Promise<void> {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  const expressServer = express();

  // configure logging
  const logger = isDevelopment ? new Logger() : new LogService();
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
  logger.log(`Listening on ${port}`);
}

declare let global: any;

if (require.main === module || global.PhusionPassenger) {
  bootstrap();
}
