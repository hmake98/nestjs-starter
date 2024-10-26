import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiSuccessResponseDto } from 'src/common/response/dtos/response.success.dto';
import { IResponseDocOptions } from 'src/common/response/interfaces/response.interface';

import {
    DOC_RESPONSE_SERIALIZATION_META_KEY,
    HTTP_STATUS_MESSAGES_SWAGGER,
} from '../constants/doc.constant';

export function DocResponse<T>(
    options: IResponseDocOptions<T>
): MethodDecorator {
    const { httpStatus, serialization } = options;

    const schema: Record<string, any> = {
        allOf: [
            { $ref: getSchemaPath(ApiSuccessResponseDto) },
            {
                properties: {
                    statusCode: { type: 'number', example: httpStatus },
                    message: {
                        type: 'string',
                        example: HTTP_STATUS_MESSAGES_SWAGGER[httpStatus],
                    },
                    timestamp: {
                        type: 'string',
                        example: new Date().toISOString(),
                    },
                    data: serialization
                        ? { $ref: getSchemaPath(serialization) }
                        : { type: 'object', example: {} },
                },
            },
        ],
    };

    const decorators = [
        ApiExtraModels(ApiSuccessResponseDto),
        ApiResponse({
            status: httpStatus,
            description: HTTP_STATUS_MESSAGES_SWAGGER[httpStatus],
            schema,
        }),
        SetMetadata(DOC_RESPONSE_SERIALIZATION_META_KEY, serialization),
    ];

    if (serialization) {
        decorators.push(ApiExtraModels(serialization));
    }

    return applyDecorators(...decorators);
}
