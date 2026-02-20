import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateOrderItemModifierDto {
  @ApiProperty({ example: "uuid-of-modifier" })
  @IsUUID()
  modifierId: string;
}
