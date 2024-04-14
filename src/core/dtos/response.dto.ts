import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDto<T> {
  @ApiProperty({
    name: 'statusCode',
    type: Number,
    required: true,
    example: 201,
  })
  @Expose()
  statusCode: number;

  @ApiProperty({
    name: 'message',
    required: true,
    nullable: false,
  })
  @Expose()
  message: string;

  @ApiProperty({
    name: 'timestamp',
    example: new Date().toISOString(),
    required: true,
    nullable: false,
  })
  @Expose()
  timestamp: string;

  @ApiProperty({
    name: 'data',
    required: true,
    nullable: false,
  })
  @Expose()
  data: T;
}
