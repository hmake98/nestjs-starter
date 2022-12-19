import 'reflect-metadata';
import { config } from 'dotenv';
config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './core/interceptors';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import * as express from 'express';
import * as helmet from 'helmet';
import * as session from 'express-session';

const baseUrl = '/api';
const docsEndpoint = process.env.DOCS_ENDPOINT || '/docs';
const port = process.env.PORT || 3000;

function configureSwagger(app): void {
  const config = new DocumentBuilder()
    .setTitle('nestjs-starter')
    .setDescription('Api documentation for nestjs-starter')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docsEndpoint, app, document);
}

async function bootstrap(): Promise<void> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    bufferLogs: true,
  });
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix(baseUrl);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
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
}

bootstrap();
