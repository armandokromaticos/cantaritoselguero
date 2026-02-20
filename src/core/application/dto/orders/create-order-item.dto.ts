import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsUUID,
  IsInt,
  Min,
  IsOptional,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemModifierDto } from "./create-order-item-modifier.dto";

export class CreateOrderItemDto {
  @ApiProperty({ example: "uuid-of-product" })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ example: "uuid-of-product-size" })
  @IsOptional()
  @IsUUID()
  productSizeId?: string;

  @ApiPropertyOptional({ example: "uuid-of-combo" })
  @IsOptional()
  @IsUUID()
  comboId?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ type: () => [CreateOrderItemModifierDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemModifierDto)
  modifiers?: CreateOrderItemModifierDto[];
}
