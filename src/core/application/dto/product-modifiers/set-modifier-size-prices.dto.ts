import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsUUID,
  ValidateNested,
} from "class-validator";

export class ModifierSizePriceDto {
  @ApiProperty({ example: "uuid-del-tamaño" })
  @IsUUID()
  productSizeId: string;

  @ApiProperty({ example: 20.0 })
  @IsNumber()
  priceAdjustment: number;
}

export class SetModifierSizePricesDto {
  @ApiProperty({ type: () => [ModifierSizePriceDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ModifierSizePriceDto)
  sizePrices: ModifierSizePriceDto[];
}
