import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProductModifierGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiProperty()
  minSelect: number;

  @ApiProperty()
  maxSelect: number;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isRequired: boolean;
}
