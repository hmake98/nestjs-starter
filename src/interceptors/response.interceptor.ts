import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { of } from 'rxjs';
import { statusMessages } from 'src/common/constant';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public constructor(private readonly reflector: Reflector, private readonly i18n: I18nService) {}

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const body = await next.handle().toPromise();
    const request = context.switchToHttp().getRequest<Request>();
    const status =
      this.reflector.get<number>('__httpCode__', context.getHandler()) || (request.method === 'POST' ? 201 : 200);
    return of({
      statusCode: status,
      message: statusMessages[status],
      data: body,
    });
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    let message = exception.getResponse() as {
      key: string;
      args: Record<string, any>;
    };

    message = await this.i18n.translate(message.key, {
      lang: ctx.getRequest().i18nLang,
      args: message.args,
    });

    response.status(statusCode).json({ statusCode, message });
  }
}
