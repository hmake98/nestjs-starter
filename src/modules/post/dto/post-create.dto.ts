import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class PostCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: "No content provided" })
  public content: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: "No title provided" })
  public title: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  public photoId: number;
}
