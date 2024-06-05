import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationTypes } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class NotificationCreateDto {
  @ApiProperty({
    description: 'title content',
    example: faker.lorem.lines(2),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'title is not provided' })
  public title: string;

  @ApiProperty({
    description: 'notification body',
    example: faker.lorem.words(),
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'body is not provided' })
  public body: string;

  @ApiProperty({
    description: 'payload',
    example: {},
    required: false,
  })
  @IsString()
  @IsOptional()
  public payload: Record<string, any>;

  @ApiProperty({
    description: 'recipients',
    example: [],
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsArray()
  public recipients: string[];

  @ApiProperty({
    description: 'notification type',
    example: NotificationTypes.EMAIL,
    required: true,
    enum: NotificationTypes,
  })
  @IsNotEmpty({ message: 'notification type is required' })
  @IsEnum(NotificationTypes, {
    message: 'notification type should be enum value',
  })
  public type: NotificationTypes;
}
