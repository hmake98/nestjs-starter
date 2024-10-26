import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { IApiErrorResponse } from '../interfaces/response.interface';

export class ApiErrorResponseDto implements IApiErrorResponse {
    @ApiProperty({ description: 'HTTP status code', example: 200 })
    @Expose()
    @IsNumber()
    statusCode: number;

    @ApiProperty({
        description: 'Response message',
        example: 'Operation successful',
    })
    @Expose()
    @IsString()
    message: string;

    @ApiProperty({
        description: 'Timestamp of the response',
        example: new Date().toISOString(),
    })
    @Expose()
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
        error?: string | string[] | Record<string, unknown>
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = timestamp;
        this.error = error;
    }
}
