import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TagResponseDto } from "../tags/tag-response.dto";

export class ProductModifierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priceAdjustment: number;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ type: () => [TagResponseDto] })
  tags?: TagResponseDto[];
}
