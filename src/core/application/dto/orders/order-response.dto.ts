import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OrderItemModifierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  modifierId: string;

  @ApiProperty()
  priceAdjustment: number;
}

export class OrderItemDeliveryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  standId: string;

  @ApiProperty()
  deliveredByUserId: string;

  @ApiProperty()
  deliveredAt: Date;
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

  @ApiPropertyOptional({ nullable: true, type: String })
  standId: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  subtotal: number;

  @ApiPropertyOptional({ type: () => [OrderItemModifierResponseDto] })
  modifiers?: OrderItemModifierResponseDto[];

  @ApiPropertyOptional({ type: () => [OrderItemDeliveryResponseDto] })
  deliveries?: OrderItemDeliveryResponseDto[];
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  userId: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  guestEmail: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  guestName: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  guestPhone: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  standId: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  couponId: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  shortCode: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => [OrderItemResponseDto] })
  items?: OrderItemResponseDto[];
}
