import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class DeleteUsersDto {
  @ApiProperty()
  @IsArray({ message: "Input should be an array of ids" })
  ids: number[];
}
