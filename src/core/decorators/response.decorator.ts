import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';

import { IResponseOptions } from '../interfaces/response.interface';
import { ResponseDto } from '../dtos/response.dto';
import { RESPONSE_SERIALIZATION_META_KEY } from '../constants/core.constant';

export function DocResponse<T>(
  options: IResponseOptions<T>,
  i18n: I18nService,
): MethodDecorator {
  const docs = [];

  const schema: Record<string, any> = {
    allOf: [
      { $ref: getSchemaPath(ResponseDto<T>) },
      {
        properties: {
          message: {
            example: i18n.translate(`http.status.${options.httpStatus}`, {
              lang: 'en',
              defaultValue: 'Operation completed.',
            }),
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
    schema.allOf[1].properties.data = {
      $ref: getSchemaPath(options.serialization),
    };
    docs.push(ApiExtraModels(options.serialization));
  }

  return applyDecorators(
    ApiExtraModels(ResponseDto<T>),
    ApiResponse({
      description: i18n.translate(`http.status.${options.httpStatus}`, {
        lang: 'en',
        defaultValue: 'Operation completed.',
      }),
      status: options.httpStatus,
      schema,
    }),
    ...docs,
    SetMetadata(RESPONSE_SERIALIZATION_META_KEY, options?.serialization),
  );
}

export function DocErrors(
  options: number[],
  i18n: I18nService,
): MethodDecorator {
  const docs = options.map((statusCode) => {
    const schema: Record<string, any> = {
      properties: {
        message: {
          example: i18n.translate(`http.status.${statusCode}`, {
            lang: 'en',
            defaultValue: 'Operation completed.',
          }),
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
    };

    return ApiResponse({
      description: i18n.translate(`http.status.${statusCode}`, {
        lang: 'en',
        defaultValue: 'Operation completed.',
      }),
      status: statusCode,
      schema,
    });
  });

  return applyDecorators(...docs);
}
