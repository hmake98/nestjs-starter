import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NotificationGetDto {
  @ApiProperty({
    description: 'limit',
    example: 10,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'limit is required' })
  public limit: number;

  @ApiProperty({
    description: 'page',
    example: 0,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'page is required' })
  public page: number;

  @ApiProperty({
    description: 'search',
    example: faker.lorem.word(),
    required: true,
  })
  @IsString()
  @IsOptional()
  public search?: string;
}
