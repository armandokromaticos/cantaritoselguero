import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductModifierResponseDto } from "../product-modifiers/product-modifier-response.dto";

export class ProductModifierGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nameEs: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  nameEn: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  description: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  descriptionEs: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  descriptionEn: string | null;

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
