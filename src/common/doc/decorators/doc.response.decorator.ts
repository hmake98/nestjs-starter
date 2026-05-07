import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiSuccessResponseDto } from 'src/common/response/dtos/response.success.dto';

import {
    DOC_RESPONSE_MESSAGE_META_KEY,
    DOC_RESPONSE_SERIALIZATION_META_KEY,
} from '../constants/doc.constant';
import { type IResponseDocOptions } from '../interfaces/doc.interface';

export function DocResponse<T>(
    options: IResponseDocOptions<T>
): MethodDecorator {
    const { httpStatus, serialization, messageKey } = options;

    const schema: Record<string, unknown> = {
        allOf: [
            { $ref: getSchemaPath(ApiSuccessResponseDto) },
            {
                properties: {
                    statusCode: { type: 'number', example: httpStatus },
                    message: {
                        type: 'string',
                        example: messageKey,
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
            description: messageKey,
            schema,
        }),
        SetMetadata(DOC_RESPONSE_SERIALIZATION_META_KEY, serialization),
        SetMetadata(DOC_RESPONSE_MESSAGE_META_KEY, messageKey),
    ];

    if (serialization) {
        decorators.push(ApiExtraModels(serialization));
    }

    return applyDecorators(...decorators);
}
