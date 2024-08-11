import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsDate,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import { IApiErrorResponse, IApiSuccessResponse } from '../interfaces/response.interface';

export class ApiGenericResponseDto {
  @ApiProperty({ description: 'Indicates if the operation was successful', example: true })
  @Expose()
  @IsBoolean()
  success: boolean;

  @ApiProperty({ description: 'Response message', example: 'Operation completed successfully' })
  @Expose()
  @IsString()
  message: string;

  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }

  static success(message: string): ApiGenericResponseDto {
    return new ApiGenericResponseDto(true, message);
  }

  static error(message: string): ApiGenericResponseDto {
    return new ApiGenericResponseDto(false, message);
  }
}

export class ApiSuccessResponseDto<T> implements IApiSuccessResponse<T> {
  @ApiProperty({ description: 'HTTP status code', example: 200 })
  @Expose()
  @IsNumber()
  statusCode: number;

  @ApiProperty({ description: 'Response message', example: 'Operation successful' })
  @Expose()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Timestamp of the response', example: new Date().toISOString() })
  @Expose()
  @IsDate()
  @Type(() => Date)
  timestamp: string;

  @ApiPropertyOptional({ description: 'Response data or error details' })
  @Expose()
  @IsOptional()
  data: T;

  constructor(statusCode: number, message: string, timestamp: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = timestamp;
    this.data = data;
  }
}

export class ApiErrorResponseDto implements IApiErrorResponse {
  @ApiProperty({ description: 'HTTP status code', example: 200 })
  @Expose()
  @IsNumber()
  statusCode: number;

  @ApiProperty({ description: 'Response message', example: 'Operation successful' })
  @Expose()
  @IsString()
  message: string;

  @ApiProperty({ description: 'Timestamp of the response', example: new Date().toISOString() })
  @Expose()
  @IsDate()
  @Type(() => Date)
  timestamp: string;

  @ApiPropertyOptional({ description: 'Response data or error details' })
  @Expose()
  @IsOptional()
  error?: string | string[] | Record<string, unknown>;

  constructor(
    statusCode: number,
    message: string,
    timestamp: string,
    error?: string | string[] | Record<string, unknown>,
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = timestamp;
    this.error = error;
  }
}

export class ApiPaginationMetadataDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  @Expose()
  @IsNumber()
  currentPage: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @Expose()
  @IsNumber()
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  @Expose()
  @IsNumber()
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  @Expose()
  @IsNumber()
  totalPages: number;
}

export class ApiPaginatedDataDto<T> {
  @ApiProperty({ description: 'Array of data items', isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  items: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  @ValidateNested()
  @Type(() => ApiPaginationMetadataDto)
  metadata: ApiPaginationMetadataDto;
}
