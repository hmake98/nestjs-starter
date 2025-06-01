import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

import { APP_ENVIRONMENT } from 'src/app/enums/app.enum';

export const createLoggerConfig = (configService: ConfigService): Params => {
    const isLocal = configService.get('app.env') === APP_ENVIRONMENT.LOCAL;

    return {
        pinoHttp: {
            level: configService.get('LOG_LEVEL', 'info'),
            transport: isLocal
                ? {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          levelFirst: true,
                          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                          ignore: 'pid,hostname',
                          singleLine: false,
                      },
                  }
                : undefined,
            formatters: {
                level: (label: string) => ({ level: label.toUpperCase() }),
            },
            timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            messageKey: 'message',
            base: {
                pid: false,
                hostname: false,
                environment: configService.get('app.env'),
                service: configService.get('app.name'),
                version: configService.get('app.version', '1.0.0'),
            },
            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'req.body.password',
                    'req.body.confirmPassword',
                    'res.headers["set-cookie"]',
                ],
                remove: true,
            },
            customProps: (req: any) => ({
                context: req.context || 'HTTP',
            }),
            serializers: {
                req: (req: any) => ({
                    id: req.id,
                    method: req.method,
                    url: req.url,
                    query: req.query,
                    params: req.params,
                    headers: {
                        host: req.headers.host,
                        'user-agent': req.headers['user-agent'],
                        'content-type': req.headers['content-type'],
                    },
                }),
                res: (res: any) => ({
                    statusCode: res.statusCode,
                    headers: {
                        'content-type': res.headers?.['content-type'],
                    },
                }),
                err: (err: any) => ({
                    type: err.type,
                    message: err.message,
                    stack: err.stack,
                }),
            },
            customLogLevel: (req: any, res: any, err: any) => {
                if (res.statusCode >= 400 && res.statusCode < 500)
                    return 'warn';
                if (res.statusCode >= 500 || err) return 'error';
                if (res.statusCode >= 300 && res.statusCode < 400)
                    return 'info';
                return 'info';
            },
            customSuccessMessage: (req: any, res: any) => {
                return `${req.method} ${req.url} - ${res.statusCode}`;
            },
            customErrorMessage: (req: any, res: any, err: any) => {
                return `${req.method} ${req.url} - ${res.statusCode} - ${err.message}`;
            },
        },
        exclude: ['/health', '/metrics', '/favicon.ico'],
    };
};
