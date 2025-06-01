import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { ENUM_FILE_STORE } from '../../enums/files.enum';

export class FilePresignDto {
    @ApiProperty({
        example: faker.system.commonFileName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({
        example: ENUM_FILE_STORE.USER_PROFILES,
        required: true,
        enum: ENUM_FILE_STORE,
    })
    @IsEnum(ENUM_FILE_STORE)
    @IsNotEmpty()
    storeType: ENUM_FILE_STORE;

    @ApiProperty({
        example: faker.system.mimeType(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    contentType: string;
}
