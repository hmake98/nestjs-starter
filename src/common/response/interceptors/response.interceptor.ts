import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

import { DOC_RESPONSE_SERIALIZATION_META_KEY } from 'src/common/doc/constants/doc.constant';
import { MessageService } from 'src/common/message/services/message.service';

import { ApiGenericResponseDto } from '../dtos/response.generic.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly messageService: MessageService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(responseBody => {
                const ctx = context.switchToHttp();
                const response = ctx.getResponse();
                const request = ctx.getRequest();
                const statusCode: number = response.statusCode;
                const lang = request.headers['accept-language'] || 'en';

                const classSerialization: ClassConstructor<any> =
                    this.reflector.get(
                        DOC_RESPONSE_SERIALIZATION_META_KEY,
                        context.getHandler()
                    );

                const data = classSerialization
                    ? plainToInstance(classSerialization, responseBody)
                    : responseBody;

                const baseResponse = {
                    statusCode,
                    timestamp: new Date().toISOString(),
                    message: this.messageService.translateSuccess(
                        statusCode,
                        lang
                    ),
                    data,
                };

                if (classSerialization?.name === ApiGenericResponseDto.name) {
                    data.message = this.messageService.translateResponseMessage(
                        data.message,
                        lang
                    );
                }

                return baseResponse;
            })
        );
    }
}
