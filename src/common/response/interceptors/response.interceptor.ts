import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor } from 'class-transformer';
import { Observable, map } from 'rxjs';

import {
    DOC_RESPONSE_MESSAGE_META_KEY,
    DOC_RESPONSE_SERIALIZATION_META_KEY,
} from 'src/common/doc/constants/doc.constant';
import { MessageService } from 'src/common/message/services/message.service';

import { ResponseSerializerService } from '../services/response.serializer.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly messageService: MessageService,
        private readonly serializerService: ResponseSerializerService
    ) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<unknown> {
        return next.handle().pipe(
            map(responseBody => {
                const ctx = context.switchToHttp();
                const statusCode: number = ctx.getResponse<{
                    statusCode: number;
                }>().statusCode;

                const cls: ClassConstructor<unknown> = this.reflector.get(
                    DOC_RESPONSE_SERIALIZATION_META_KEY,
                    context.getHandler()
                );
                const messageKey: string | undefined = this.reflector.get(
                    DOC_RESPONSE_MESSAGE_META_KEY,
                    context.getHandler()
                );

                const data = this.serializerService.serialize(
                    responseBody,
                    cls
                );
                this.serializerService.patchGenericMessage(data, cls);
                const message = this.messageService.resolveSuccessMessage(
                    messageKey,
                    statusCode
                );

                return {
                    statusCode,
                    message,
                    timestamp: new Date().toISOString(),
                    data,
                };
            })
        );
    }
}
