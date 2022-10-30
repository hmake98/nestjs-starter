import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Role } from "@prisma/client";

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "No email provided" })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "No password provided" })
  public password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "No firstname provided" })
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "No lastname provided" })
  public lastName: string;

  @IsEnum(Role)
  @IsOptional()
  public role: Role;
}
