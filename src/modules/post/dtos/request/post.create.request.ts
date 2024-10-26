import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostCreateDto {
    @ApiProperty({
        example: faker.lorem.sentence(4),
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: faker.lorem.paragraph(2),
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        example: [faker.system.fileName(), faker.system.fileName()],
        required: false,
        isArray: true,
        type: String,
    })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    images?: string[];
}
