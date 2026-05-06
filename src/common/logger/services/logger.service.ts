import type { IncomingMessage, ServerResponse } from 'node:http';

import type { ConfigService } from '@nestjs/config';
import type { Params } from 'nestjs-pino';

import { APP_ENVIRONMENT } from 'src/app/enums/app.enum';

type LoggedRequest = IncomingMessage & {
    id?: string | number;
    body?: unknown;
};

type LoggedError = Error & { type?: string };

export const createLoggerConfig = (configService: ConfigService): Params => {
    const env = configService.get<string>('app.env', APP_ENVIRONMENT.LOCAL);
    const isLocal = env === APP_ENVIRONMENT.LOCAL;
    const logLevel = configService.get<string>('app.logLevel', 'info');

    return {
        pinoHttp: {
            level: logLevel,
            transport: isLocal
                ? {
                      target: 'pino-pretty',
                      options: {
                          colorize: true,
                          levelFirst: true,
                          translateTime: 'yyyy-mm-dd HH:MM:ss.l',
                          ignore: 'pid,hostname',
                          singleLine: false,
                          messageFormat: '{context} {msg}',
                      },
                  }
                : undefined,
            formatters: {
                level: (label: string) => ({ level: label.toUpperCase() }),
                bindings: () => ({}),
            },
            timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            messageKey: 'message',
            base: {
                environment: env,
                service: configService.get<string>('app.name', 'nestjs-app'),
                version: configService.get<string>(
                    'app.versioning.version',
                    '1'
                ),
            },
            redact: {
                paths: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'req.body.password',
                    'req.body.confirmPassword',
                    'req.body.currentPassword',
                    'req.body.newPassword',
                    'req.body.token',
                    'res.headers["set-cookie"]',
                ],
                remove: true,
            },
            customProps: (req: IncomingMessage) => ({
                correlationId: (req as LoggedRequest).id,
            }),
            serializers: {
                req: (req: LoggedRequest) => ({
                    method: req.method,
                    url: req.url,
                    userAgent: req.headers?.['user-agent'],
                }),
                res: (res: ServerResponse) => ({ statusCode: res.statusCode }),
                err: (err: LoggedError) => ({
                    type: err.type ?? err.name,
                    message: err.message,
                    stack: isLocal ? err.stack : undefined,
                }),
            },
            customLogLevel: (
                _req: IncomingMessage,
                res: ServerResponse,
                err?: Error
            ) => {
                if (res.statusCode >= 500 || err) return 'error';
                if (res.statusCode >= 400) return 'warn';
                return 'info';
            },
            customSuccessMessage: (req: IncomingMessage, res: ServerResponse) =>
                `${req.method} ${req.url} ${res.statusCode}`,
            customErrorMessage: (
                _req: IncomingMessage,
                _res: ServerResponse,
                err: Error
            ) => err.message,
            genReqId: (req: IncomingMessage) => {
                const r = req as LoggedRequest;
                return (
                    r.id ??
                    r.headers['x-request-id']?.toString() ??
                    crypto.randomUUID()
                );
            },
        },
        exclude: ['/health', '/health/live', '/health/ready', '/favicon.ico'],
    };
};
