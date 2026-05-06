import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { ClassConstructor } from 'class-transformer';

import { DocGenericResponse } from './doc.generic.decorator';
import { DocResponse } from './doc.response.decorator';

interface BaseOptions {
    summary: string;
    messageKey: string;
    httpStatus?: HttpStatus;
}

interface TypedOptions<T> extends BaseOptions {
    serialization: ClassConstructor<T>;
}

/**
 * Single decorator covering the @ApiOperation + @DocResponse|@DocGenericResponse
 * combo every controller method needs. Pass `serialization` for typed payloads;
 * omit it for boolean-style success responses.
 */
export function ApiEndpoint<T>(options: TypedOptions<T>): MethodDecorator;
export function ApiEndpoint(options: BaseOptions): MethodDecorator;
export function ApiEndpoint<T>(
    options: BaseOptions & { serialization?: ClassConstructor<T> }
): MethodDecorator {
    const httpStatus = options.httpStatus ?? HttpStatus.OK;

    return applyDecorators(
        ApiOperation({ summary: options.summary }),
        options.serialization
            ? DocResponse({
                  serialization: options.serialization,
                  httpStatus,
                  messageKey: options.messageKey,
              })
            : DocGenericResponse({
                  httpStatus,
                  messageKey: options.messageKey,
              })
    );
}
