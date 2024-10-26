import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ArrayMaxSize,
} from 'class-validator';

export class PostUpdateDto {
    @ApiProperty({
        example: faker.lorem.sentence(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    @Transform(({ value }) => value?.trim())
    title?: string;

    @ApiProperty({
        example: faker.lorem.paragraph(),
        required: false,
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(1000)
    @Transform(({ value }) => value?.trim())
    content?: string;

    @ApiProperty({
        example: [faker.string.uuid(), faker.string.uuid()],
        required: false,
        type: [String],
    })
    @IsArray()
    @IsOptional()
    @ArrayMaxSize(5)
    @IsString({ each: true })
    @Type(() => String)
    images?: string[];
}
