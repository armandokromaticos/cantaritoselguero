import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";

export class ReorderItemDto {
  @ApiProperty()
  @IsUUID()
  itemId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderSectionItemsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @IsArray()
  @ArrayUnique((item: ReorderItemDto) => item.itemId, {
    message: "Duplicate itemId values are not allowed",
  })
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
