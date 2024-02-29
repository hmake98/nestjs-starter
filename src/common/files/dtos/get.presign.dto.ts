import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileModuleType } from '../interfaces/files.interface';

export class GetPresignDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'file name is required.' })
  name: string;

  @ApiProperty()
  @IsEnum(FileModuleType, {
    message: '[Profile, Posts] enum type is required',
  })
  @IsNotEmpty({ message: 'type is required.' })
  type: FileModuleType;
}
