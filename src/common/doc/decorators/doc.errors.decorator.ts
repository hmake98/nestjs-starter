import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ApiErrorResponseDto } from 'src/common/response/dtos/response.error.dto';

import { HTTP_STATUS_MESSAGES_SWAGGER } from '../constants/doc.constant';

export function DocErrors(statusCodes: number[]): MethodDecorator {
    const decorators = statusCodes.map(statusCode => {
        const schema: Record<string, any> = {
            allOf: [
                { $ref: getSchemaPath(ApiErrorResponseDto) },
                {
                    properties: {
                        statusCode: { type: 'number', example: statusCode },
                        message: {
                            type: 'string',
                            example: HTTP_STATUS_MESSAGES_SWAGGER[statusCode],
                        },
                        timestamp: {
                            type: 'string',
                            example: new Date().toISOString(),
                        },
                        error:
                            statusCode !== 400
                                ? {
                                      type: 'string',
                                      example: 'Error description',
                                  }
                                : {
                                      type: 'array',
                                      items: { type: 'string' },
                                      example: [
                                          'Validation error 1',
                                          'Validation error 2',
                                      ],
                                  },
                    },
                },
            ],
        };

        return ApiResponse({
            status: statusCode,
            description: HTTP_STATUS_MESSAGES_SWAGGER[statusCode],
            schema,
        });
    });

    return applyDecorators(ApiExtraModels(ApiErrorResponseDto), ...decorators);
}
