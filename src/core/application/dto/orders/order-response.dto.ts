import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OrderItemModifierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  modifierId: string;

  @ApiProperty()
  priceAdjustment: number;
}

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  productSizeId: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  comboId: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subtotal: number;

  @ApiPropertyOptional({ type: () => [OrderItemModifierResponseDto] })
  modifiers?: OrderItemModifierResponseDto[];
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  standId: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  shortCode: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => [OrderItemResponseDto] })
  items?: OrderItemResponseDto[];
}
