import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductModifierResponseDto } from "../product-modifiers/product-modifier-response.dto";

export class ProductModifierGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  minSelect: number;

  @ApiProperty()
  maxSelect: number;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty({ description: "Derived from minSelect > 0" })
  isRequired: boolean;

  @ApiPropertyOptional({ type: () => [ProductModifierResponseDto] })
  modifiers?: ProductModifierResponseDto[];
}
