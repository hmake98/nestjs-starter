import {
    Catch,
    HttpException,
    HttpStatus,
    ExceptionFilter,
    ArgumentsHost,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { getI18nContextFromArgumentsHost } from "nestjs-i18n";
import { ConfigService } from 'src/config/config.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private env: string;
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly configService: ConfigService,
    ) {
        this.env = this.configService.get('env')
    }

    catch(exception: HttpException, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const i18n = getI18nContextFromArgumentsHost(host);
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus,
            timestamp: Date.now(),
            message: exception instanceof HttpException ? i18n.t(exception.message) : 'Internal Server Error',
            ...(this.env === 'development') && { path: httpAdapter.getRequestUrl(ctx.getRequest()) },
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
