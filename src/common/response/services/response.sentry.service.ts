import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Request } from 'express';

@Injectable()
export class SentryService {
    capture(exception: unknown, request: Request): void {
        if (!Sentry.getClient()) return;

        Sentry.withScope(scope => {
            scope.setExtra('requestUrl', request.url);
            scope.setExtra('method', request.method);
            scope.setExtra('body', request.body);
            scope.setExtra('query', request.query);
            scope.setExtra('params', request.params);
            scope.setExtra('headers', this.sanitizeHeaders(request.headers));

            if (exception instanceof Error) {
                Sentry.captureException(exception);
            } else {
                Sentry.captureMessage('Non-Error exception thrown');
            }
        });
    }

    private sanitizeHeaders(
        headers: Record<string, unknown>
    ): Record<string, unknown> {
        const sanitized = { ...headers };
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }
}
