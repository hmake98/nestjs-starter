import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { I18n } from 'i18n';
const i18n = new I18n();

i18n.configure({
  locales: ['en'],
  defaultLocale: 'en',
  autoReload: true,
  directory: 'src/i18n',
});

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    i18n.setLocale(i18n.getLocale(request));

    const error = exception.getResponse() as {
      response: string;
      status: number;
    };

    let message: string;
    if (error.response) {
      message = i18n.__(error.response);
      response.status(error.status).json({ statusCode: error.status, message });
    } else {
      response.status(error['statusCode']).json({ ...error });
    }
  }
}
