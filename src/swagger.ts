import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default async function setupSwagger(
    app: INestApplication
): Promise<void> {
    const configService = app.get(ConfigService);
    const logger = new Logger('SwaggerSetup');

    const swaggerConfig = {
        name: configService.get<string>('doc.name', 'API Documentation'),
        description: configService.get<string>(
            'doc.description',
            'API Description'
        ),
        version: configService.get<string>('doc.version', '1.0'),
        prefix: configService.get<string>('doc.prefix', 'docs'),
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
            'accessToken'
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
            'refreshToken'
        )
        .build();

    const document = SwaggerModule.createDocument(app, documentBuild, {
        deepScanRoutes: true,
    });

    const darkModeTheme = `
        body {
            background-color: #1a1a1a;
            color: #ffffff;
            font-family: Arial, sans-serif;
        }
        .swagger-ui { background-color: #1a1a1a; color: #ffffff; }
        .swagger-ui .topbar { background-color: #1a1a1a; }
        .swagger-ui .topbar .download-url-wrapper .select-label select { background-color: #333333; color: #ffffff; }
        .swagger-ui .info .title {
            color: #ffffff;
            font-size: 36px;
            font-weight: bold;
        }
        .swagger-ui .info .title small.version-stamp { background-color: #4a4a4a; color: #ffffff; }
        .swagger-ui .info .base-url { color: #ffffff; }
        .swagger-ui .opblock-tag {
            background-color: #252525;
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
        }
        .swagger-ui .opblock { background-color: #252525; border-color: #333333; }
        .swagger-ui .opblock .opblock-summary-method { background-color: #4a4a4a; color: #ffffff; }
        .swagger-ui .opblock .opblock-summary-path { color: #ffffff; }
        .swagger-ui .opblock .opblock-summary-description { color: #cccccc; }
        .swagger-ui .opblock-description-wrapper p { color: #ffffff; }
        .swagger-ui .scheme-container { background-color: #252525; }
        .swagger-ui .btn { background-color: #4a4a4a; color: #ffffff; }
        .swagger-ui select { background-color: #333333; color: #ffffff; }
        .swagger-ui input[type=text] { background-color: #333333; color: #ffffff; }
        .swagger-ui textarea { background-color: #333333; color: #ffffff; }
        .swagger-ui .parameter__name { color: #ffffff; font-weight: bold; }
        .swagger-ui .parameter__type { color: #cccccc; }
        .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #ffffff; }
        .swagger-ui .response-col_status { color: #ffffff; }
        .swagger-ui .response-col_description { color: #ffffff; }
        .swagger-ui .opblock-tag-section h4 { color: #ffffff; }
        .swagger-ui .opblock .opblock-summary-operation-id { color: #cccccc; }
        .swagger-ui .model-title { color: #ffffff; }
        .swagger-ui .prop-type { color: #cccccc; }
        .swagger-ui .prop-format { color: #cccccc; }
        .swagger-ui section.models h4 { color: #ffffff; }
        .swagger-ui .servers-title { color: #ffffff; }
        .swagger-ui .servers > label select { background-color: #333333; color: #ffffff; }
        .swagger-ui .opblock-summary { border-color: #333333; }
        .swagger-ui .opblock-summary:hover { background-color: #2a2a2a; }
        .swagger-ui .opblock-summary-control:focus { outline-color: #4a4a4a; }
        .swagger-ui .tab li button.tablinks { color: #cccccc; }
        .swagger-ui .tab li button.tablinks.active { color: #ffffff; border-color: #4a4a4a; }
        .swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-external-docs-wrapper, .swagger-ui .opblock-title_normal { color: #cccccc; }
        .swagger-ui .opblock-description-wrapper h4, .swagger-ui .opblock-external-docs-wrapper h4, .swagger-ui .opblock-title_normal h4 { color: #ffffff; }
        .swagger-ui .opblock-body pre { color: #ffffff; background-color: #2a2a2a; }
        .swagger-ui .expand-methods svg, .swagger-ui .expand-operation svg { fill: #cccccc; }
        .swagger-ui .expand-methods:hover svg, .swagger-ui .expand-operation:hover svg { fill: #ffffff; }

        /* Authorization Modal Styles */
        .swagger-ui .dialog-ux .modal-ux { background-color: #252525; border-color: #333333; }
        .swagger-ui .dialog-ux .modal-ux-header h3 { color: #ffffff; }
        .swagger-ui .dialog-ux .modal-ux-content { color: #cccccc; }
        .swagger-ui .auth-container { background-color: #1a1a1a; }
        .swagger-ui .auth-container h4, .swagger-ui .auth-container label { color: #ffffff; }
        .swagger-ui .auth-container input[type=text], .swagger-ui .auth-container input[type=password] { background-color: #333333; color: #ffffff; border-color: #4a4a4a; }
        .swagger-ui .auth-container .authorize { background-color: #4a4a4a; border-color: #4a4a4a; color: #ffffff; }
        .swagger-ui .auth-container .authorize:hover { background-color: #5a5a5a; }
        .swagger-ui .auth-container .btn-done { background-color: #4a4a4a; color: #ffffff; }
        .swagger-ui .auth-container .btn-done:hover { background-color: #5a5a5a; }
        .swagger-ui .auth-btn-wrapper { display: flex; justify-content: flex-end; }
        .swagger-ui .auth-btn-wrapper .btn { margin-left: 5px; }
        .swagger-ui .authorization__btn { background-color: #4a4a4a; border-color: #4a4a4a; color: #ffffff; }
        .swagger-ui .authorization__btn:hover { background-color: #5a5a5a; }

        /* Improve visibility of authorization type labels */
        .swagger-ui .auth-container .wrapper { background-color: #252525; border-color: #333333; }
        .swagger-ui .auth-container .wrapper > span { color: #ffffff !important; } /* Force white color for auth type labels */
        .swagger-ui .auth-container .wrapper > small { color: #cccccc; }
    `;

    SwaggerModule.setup(swaggerConfig.prefix, app, document, {
        explorer: true,
        customSiteTitle: swaggerConfig.name,
        customCss: darkModeTheme,
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
