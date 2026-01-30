import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductSizeResponseDto } from "../product-sizes/product-size-response.dto";
import { ProductModifierGroupResponseDto } from "../product-modifier-groups/product-modifier-group-response.dto";

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  basePrice: number;

  @ApiPropertyOptional({ nullable: true, type: String })
  image: string | null;

  @ApiPropertyOptional({ nullable: true, type: Number })
  stock: number | null;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional({ nullable: true, type: String })
  standId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => [ProductSizeResponseDto] })
  sizes?: ProductSizeResponseDto[];

  @ApiPropertyOptional({ type: () => [ProductModifierGroupResponseDto] })
  modifierGroups?: ProductModifierGroupResponseDto[];
}
