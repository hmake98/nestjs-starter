import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Post } from '@prisma/client';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';

import { UserResponseDto } from 'src/modules/user/dtos/response/user.response';

import { PostImagesResponseDto } from './post.images.response';

export class PostResponseDto implements Partial<Post> {
    @ApiProperty({
        enum: $Enums.PostStatus,
        example: faker.helpers.arrayElement(Object.values($Enums.PostStatus)),
    })
    @IsEnum($Enums.PostStatus)
    status: $Enums.PostStatus;

    @ApiProperty({
        example: faker.string.uuid(),
    })
    @IsUUID()
    authorId: string;

    @ApiProperty({
        example: faker.lorem.paragraphs(),
    })
    @IsString()
    content: string;

    @ApiProperty({
        example: faker.date.past().toISOString(),
    })
    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({
        required: false,
        nullable: true,
        example: faker.date.future().toISOString(),
    })
    @IsDate()
    @Type(() => Date)
    deletedAt: Date | null;

    @ApiProperty({
        example: faker.string.uuid(),
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        example: faker.lorem.sentence(),
    })
    @IsString()
    title: string;

    @ApiProperty({
        example: faker.date.recent().toISOString(),
    })
    @IsDate()
    @Type(() => Date)
    updatedAt: Date;

    @ApiProperty({
        type: () => UserResponseDto,
        example: {
            id: faker.string.uuid(),
            email: faker.internet.email(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            createdAt: faker.date.past().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
        },
    })
    @ValidateNested()
    @Type(() => UserResponseDto)
    author: UserResponseDto;

    @ApiProperty({
        type: [PostImagesResponseDto],
        example: [
            {
                id: faker.string.uuid(),
                key: faker.system.filePath(),
                createdAt: faker.date.past().toISOString(),
                updatedAt: faker.date.recent().toISOString(),
                deletedAt: null,
            },
            {
                id: faker.string.uuid(),
                key: faker.system.filePath(),
                createdAt: faker.date.past().toISOString(),
                updatedAt: faker.date.recent().toISOString(),
                deletedAt: faker.date.future().toISOString(),
            },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => PostImagesResponseDto)
    images: PostImagesResponseDto[];
}

export class PostCreateResponseDto extends PostResponseDto {}

export class PostUpdateResponseDto extends PostResponseDto {}
