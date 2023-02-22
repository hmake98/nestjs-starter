import 'reflect-metadata';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter, ResponseInterceptor } from './core/interceptors';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { JwtAuthGuard, RolesGuard } from './core';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

const baseUrl = '/api';
const port = process.env.PORT || 3000;

function configureSwagger(app): void {
  const config = new DocumentBuilder()
    .setTitle('nestjs-starter')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(baseUrl, app, document);
}

async function bootstrap(): Promise<void> {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: false,
    bufferLogs: true,
    cors: true,
  });
  const logger = app.get(Logger);
  const moduleRef = app.select(AppModule);
  const reflector = moduleRef.get(Reflector);
  app.useLogger(logger);
  app.setGlobalPrefix(baseUrl);
  app.useGlobalInterceptors(
    new ResponseInterceptor(reflector),
    new ClassSerializerInterceptor(reflector),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  app.use(morgan('combined'));
  app.use(helmet());
  configureSwagger(app);
  await app.init();
  await app.listen(port);
  logger.log(`Server running on ${await app.getUrl()}`);
}

bootstrap();
