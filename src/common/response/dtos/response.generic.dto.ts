import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class ApiGenericResponseDto {
    @ApiProperty({
        description: 'Indicates if the operation was successful',
        example: true,
    })
    @Expose()
    @IsBoolean()
    success: boolean;

    @ApiProperty({
        description: 'Response message',
        example: 'Operation completed successfully',
    })
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
