import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  basePrice: number;

  @ApiPropertyOptional()
  image: string | null;

  @ApiPropertyOptional()
  stock: number | null;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  standId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
