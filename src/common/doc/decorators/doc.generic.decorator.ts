import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiGenericResponseDto } from 'src/common/response/dtos/response.generic.dto';

export function DocGenericResponse(): MethodDecorator {
    return applyDecorators(
        ApiExtraModels(ApiGenericResponseDto),
        ApiResponse({
            status: 200,
            description: 'Generic response',
            schema: {
                $ref: getSchemaPath(ApiGenericResponseDto),
            },
        })
    );
}
