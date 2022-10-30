import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "No email provided" })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: "No password provided" })
  public password: string;
}
