import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

export default async function (app: INestApplication) {
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  const docName: string = configService.get<string>('doc.name');
  const docDesc: string = configService.get<string>('doc.description');
  const docVersion: string = configService.get<string>('doc.version');
  const docPrefix: string = configService.get<string>('doc.prefix');

  const documentBuild = new DocumentBuilder()
    .setTitle(docName)
    .setDescription(docDesc)
    .setVersion(docVersion)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refreshToken',
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentBuild, {
    deepScanRoutes: true,
  });

  writeFileSync('./swagger.json', JSON.stringify(document));

  SwaggerModule.setup(docPrefix, app, document, {
    explorer: false,
    customSiteTitle: docName,
  });

  logger.log(`Docs will serve on ${docPrefix}`, 'NestApplication');
}
