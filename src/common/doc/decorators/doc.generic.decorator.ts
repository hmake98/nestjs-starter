import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

import { type IGenericResponseOptions } from '../interfaces/doc.interface';

export function DocGenericResponse(
    options: IGenericResponseOptions
): MethodDecorator {
    const { messageKey, httpStatus } = options;
    return applyDecorators(
        ApiExtraModels(ApiGenericResponseDto),
        ApiResponse({
            status: httpStatus,
            description: messageKey,
            schema: {
                $ref: getSchemaPath(ApiGenericResponseDto),
            },
        })
    );
}
