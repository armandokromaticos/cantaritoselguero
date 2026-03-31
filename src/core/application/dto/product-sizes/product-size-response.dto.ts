import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProductSizeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  price: number;

  @ApiProperty({ nullable: true, type: Number })
  stock: number | null;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;
}
