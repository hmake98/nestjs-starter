import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { MCP_IS_PUBLIC } from '@hmake98/nestjs-mcp';

import {
    DOC_RESPONSE_MESSAGE_META_KEY,
    DOC_RESPONSE_SERIALIZATION_META_KEY,
} from 'src/common/doc/constants/doc.constant';
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
                // Skip response wrapping for MCP routes
                const isMCPPublic = this.reflector.getAllAndOverride<boolean>(
                    MCP_IS_PUBLIC,
                    [context.getHandler(), context.getClass()]
                );
                if (isMCPPublic) {
                    return responseBody; // Return raw response for MCP routes
                }
                const ctx = context.switchToHttp();
                const response = ctx.getResponse();
                const statusCode: number = response.statusCode;

                const classSerialization: ClassConstructor<any> =
                    this.reflector.get(
                        DOC_RESPONSE_SERIALIZATION_META_KEY,
                        context.getHandler()
                    );

                const messageKey = this.reflector.get(
                    DOC_RESPONSE_MESSAGE_META_KEY,
                    context.getHandler()
                );

                const data = classSerialization
                    ? plainToInstance(classSerialization, responseBody, {
                          excludeExtraneousValues: true,
                      })
                    : responseBody;

                // Translate response message
                let message: string;
                if (messageKey) {
                    message = this.messageService.translate(messageKey);
                } else {
                    // Use HTTP success message based on status code
                    message = this.messageService.translateKey(
                        ['http', 'success', statusCode],
                        {
                            defaultValue: 'Success',
                        }
                    );
                }

                // Handle ApiGenericResponseDto message translation
                if (
                    data &&
                    typeof data === 'object' &&
                    'message' in data &&
                    classSerialization?.name === ApiGenericResponseDto.name
                ) {
                    data.message = this.messageService.translate(data.message, {
                        defaultValue: data.message,
                    });
                }

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
