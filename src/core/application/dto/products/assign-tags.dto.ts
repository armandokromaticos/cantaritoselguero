import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class AssignTagsDto {
  @ApiProperty({ example: ["uuid1", "uuid2"], type: [String] })
  @IsArray()
  @IsUUID("4", { each: true })
  tagIds: string[];
}
