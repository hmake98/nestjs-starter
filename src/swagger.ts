import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

interface SwaggerConfig {
  name: string;
  description: string;
  version: string;
  prefix: string;
}

export default async function setupSwagger(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  const logger = new Logger('SwaggerSetup');

  const swaggerConfig: SwaggerConfig = {
    name: configService.get<string>('doc.name', 'API Documentation'),
    description: configService.get<string>('doc.description', 'API Description'),
    version: configService.get<string>('doc.version', '1.0'),
    prefix: configService.get<string>('doc.prefix', 'api'),
  };

  const documentBuild = new DocumentBuilder()
    .setTitle(swaggerConfig.name)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'accessToken',
        description: 'Enter your access token',
        in: 'header',
      },
      'accessToken',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'refreshToken',
        description: 'Enter your refresh token',
        in: 'header',
      },
      'refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentBuild, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(swaggerConfig.prefix, app, document, {
    explorer: true,
    customSiteTitle: swaggerConfig.name,
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      displayOperationId: true,
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      filter: true,
      withCredentials: true,
    },
  });

  logger.log(`Swagger documentation available at /${swaggerConfig.prefix}`);
}
