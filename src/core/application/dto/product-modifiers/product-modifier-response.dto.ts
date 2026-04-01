import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TagResponseDto } from "../tags/tag-response.dto";

export class ModifierSizePriceResponseDto {
  @ApiProperty()
  productSizeId: string;

  @ApiProperty()
  priceAdjustment: number;
}

export class ProductModifierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nameEs: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  nameEn: string | null;

  @ApiProperty()
  priceAdjustment: number;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sizeRestricted: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ type: () => [TagResponseDto] })
  tags?: TagResponseDto[];

  @ApiProperty({ type: () => [ModifierSizePriceResponseDto] })
  sizePrices: ModifierSizePriceResponseDto[];
}
