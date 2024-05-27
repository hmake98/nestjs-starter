import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { IResponseOptions } from '../interfaces/response.interface';
import { ResponseDto } from '../dtos/response.dto';
import {
  HTTP_STATUS_MESSAGES,
  RESPONSE_SERIALIZATION_META_KEY,
} from '../constants/core.constant';

export function DocResponse<T>(options: IResponseOptions<T>): MethodDecorator {
  const docs = [];

  const schema: Record<string, any> = {
    allOf: [
      { $ref: getSchemaPath(ResponseDto<T>) },
      {
        properties: {
          message: {
            example: HTTP_STATUS_MESSAGES[options.httpStatus],
          },
          statusCode: {
            type: 'number',
            example: options.httpStatus,
          },
        },
      },
    ],
  };

  if (options.serialization) {
    schema.properties = {
      ...schema.properties,
      data: {
        $ref: getSchemaPath(options.serialization),
      },
    };
    docs.push(ApiExtraModels(options.serialization));
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto<T>),
    ApiResponse({
      description: HTTP_STATUS_MESSAGES[options.httpStatus],
      status: options.httpStatus,
      schema,
    }),
    ...docs,
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
  );
}

export function DocErrors(options: number[]): MethodDecorator {
  const docs = [];

  options.forEach((statusCode) => {
    const schema: Record<string, any> = {
      allOf: [
        {
          properties: {
            message: {
              example: HTTP_STATUS_MESSAGES[statusCode],
            },
            statusCode: {
              type: 'number',
              example: statusCode,
            },
            timestamp: {
              type: 'string',
              example: new Date().toISOString(),
            },
          },
        },
      ],
    };

    docs.push(
      ApiResponse({
        description: HTTP_STATUS_MESSAGES[statusCode],
        status: statusCode,
        schema,
      }),
    );
  });

  return applyDecorators(...docs);
}
