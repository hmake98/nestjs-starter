import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { ClassConstructor } from 'class-transformer';

import { DocGenericResponse } from './doc.generic.decorator';
import { DocPaginatedResponse } from './doc.paginated.decorator';
import { DocResponse } from './doc.response.decorator';
import type {
    IDocBaseOptions,
    IDocPaginatedOptions,
    IDocTypedOptions,
} from '../interfaces/doc.interface';

export function ApiEndpoint<T>(
    options: IDocPaginatedOptions<T>
): MethodDecorator;
export function ApiEndpoint<T>(options: IDocTypedOptions<T>): MethodDecorator;
export function ApiEndpoint(options: IDocBaseOptions): MethodDecorator;
export function ApiEndpoint<T>(
    options: IDocBaseOptions & {
        serialization?: ClassConstructor<T>;
        paginated?: true;
    }
): MethodDecorator {
    const httpStatus = options.httpStatus ?? HttpStatus.OK;

    return applyDecorators(
        ApiOperation({ summary: options.summary }),
        options.paginated && options.serialization
            ? DocPaginatedResponse({
                  serialization: options.serialization,
                  httpStatus,
                  messageKey: options.messageKey,
              })
            : options.serialization
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
