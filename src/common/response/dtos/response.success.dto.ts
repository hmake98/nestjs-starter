import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { IApiSuccessResponse } from '../interfaces/response.interface';

export class ApiSuccessResponseDto<T> implements IApiSuccessResponse<T> {
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
    @IsDate()
    @Type(() => Date)
    timestamp: string;

    @ApiPropertyOptional({ description: 'Response data or error details' })
    @Expose()
    @IsOptional()
    data: T;

    constructor(
        statusCode: number,
        message: string,
        timestamp: string,
        data: T
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = timestamp;
        this.data = data;
    }
}
