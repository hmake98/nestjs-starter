import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUsersDto {
  @ApiProperty({ required: true })
  @IsNumber()
  public id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  public photoId: number;
}
