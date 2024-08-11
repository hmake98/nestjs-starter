import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { RESPONSE_SERIALIZATION_META_KEY } from 'src/app/app.constant';

import {
  ApiPaginationMetadataDto,
  ApiPaginatedDataDto,
  ApiGenericResponseDto,
  ApiSuccessResponseDto,
  ApiErrorResponseDto,
} from '../dtos/response.dto';
import { IResponseDocOptions } from '../interfaces/response.interface';

const HTTP_STATUS_MESSAGES: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  206: 'Partial Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  409: 'Conflict',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
};

function getStatusCodeMessage(statusCode: number): string {
  return HTTP_STATUS_MESSAGES[statusCode] || 'Operation completed';
}

export function DocResponse<T>(options: IResponseDocOptions<T>): MethodDecorator {
  const { httpStatus, serialization } = options;

  const schema: Record<string, any> = {
    allOf: [
      { $ref: getSchemaPath(ApiSuccessResponseDto) },
      {
        properties: {
          statusCode: { type: 'number', example: httpStatus },
          message: { type: 'string', example: getStatusCodeMessage(httpStatus) },
          timestamp: { type: 'string', example: new Date().toISOString() },
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
      description: getStatusCodeMessage(httpStatus),
      schema,
    }),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, serialization),
  ];

  if (serialization) {
    decorators.push(ApiExtraModels(serialization));
  }

  return applyDecorators(...decorators);
}

export function DocPaginatedResponse<T>(options: IResponseDocOptions<T>): MethodDecorator {
  const { httpStatus, serialization } = options;

  const schema: Record<string, any> = {
    allOf: [
      { $ref: getSchemaPath(ApiSuccessResponseDto) },
      {
        properties: {
          statusCode: { type: 'number', example: httpStatus },
          message: { type: 'string', example: getStatusCodeMessage(httpStatus) },
          timestamp: { type: 'string', example: new Date().toISOString() },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: serialization ? { $ref: getSchemaPath(serialization) } : {},
              },
              metadata: { $ref: getSchemaPath(ApiPaginationMetadataDto) },
            },
          },
        },
      },
    ],
  };

  const decorators = [
    ApiExtraModels(ApiSuccessResponseDto, ApiPaginatedDataDto, ApiPaginationMetadataDto),
    ApiResponse({
      status: httpStatus,
      description: getStatusCodeMessage(httpStatus),
      schema,
    }),
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, serialization),
  ];

  if (serialization) {
    decorators.push(ApiExtraModels(serialization));
  }

  return applyDecorators(...decorators);
}

export function DocErrors(statusCodes: number[]): MethodDecorator {
  const decorators = statusCodes.map(statusCode => {
    const schema: Record<string, any> = {
      allOf: [
        { $ref: getSchemaPath(ApiErrorResponseDto) },
        {
          properties: {
            statusCode: { type: 'number', example: statusCode },
            message: { type: 'string', example: getStatusCodeMessage(statusCode) },
            timestamp: { type: 'string', example: new Date().toISOString() },
            error:
              statusCode !== 400
                ? { type: 'string', example: 'Error description' }
                : {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Validation error 1', 'Validation error 2'],
                  },
          },
        },
      ],
    };

    return ApiResponse({
      status: statusCode,
      description: getStatusCodeMessage(statusCode),
      schema,
    });
  });

  return applyDecorators(ApiExtraModels(ApiErrorResponseDto), ...decorators);
}

export function DocGenericResponse(): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(ApiGenericResponseDto),
    ApiResponse({
      status: 200,
      description: 'Generic response',
      schema: {
        $ref: getSchemaPath(ApiGenericResponseDto),
      },
    }),
  );
}
