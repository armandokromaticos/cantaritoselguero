import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductResponseDto } from "../products/product-response.dto";
import { ComboResponseDto } from "../combos/combo-response.dto";

export class SectionItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ["product", "combo"] })
  type: "product" | "combo";

  @ApiProperty()
  order: number;

  @ApiPropertyOptional({ type: () => ProductResponseDto })
  product?: ProductResponseDto;

  @ApiPropertyOptional({ type: () => ComboResponseDto })
  combo?: ComboResponseDto;
}

export class SectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  nameEs?: string;

  @ApiPropertyOptional({ nullable: true })
  nameEn?: string | null;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => [SectionItemResponseDto] })
  items?: SectionItemResponseDto[];
}
