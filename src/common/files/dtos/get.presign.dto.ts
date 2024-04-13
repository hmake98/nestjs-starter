import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileMimeType, FileModuleType } from 'src/app/app.enum';

export class GetPresignDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'file name is required.' })
  name: string;

  @ApiProperty()
  @IsEnum(FileModuleType, {
    message: '[Profile, Posts] should be enum',
  })
  @IsNotEmpty({ message: 'store type is required.' })
  storeType: FileModuleType;

  @ApiProperty()
  @IsEnum(FileMimeType, {
    message: ' type is required',
  })
  @IsNotEmpty({ message: 'store type is required.' })
  mimeType: FileMimeType;
}
