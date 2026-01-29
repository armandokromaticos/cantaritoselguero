import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
}
