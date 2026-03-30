import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PendingOrderItemModifierDto {
  @ApiProperty()
  nameEs: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  nameEn: string | null;
}

export class PendingOrderItemDto {
  @ApiProperty()
  itemId: string;

  @ApiProperty()
  productNameEs: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  productNameEn: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  sizeName: string | null;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: () => [PendingOrderItemModifierDto] })
  modifiers: PendingOrderItemModifierDto[];
}

export class PendingOrderGroupDto {
  @ApiProperty()
  orderId: string;

  @ApiProperty()
  shortCode: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => [PendingOrderItemDto] })
  items: PendingOrderItemDto[];
}

export class StandPendingItemsResponseDto {
  @ApiProperty()
  standId: string;

  @ApiProperty()
  standName: string;

  @ApiProperty({ type: () => [PendingOrderGroupDto] })
  orders: PendingOrderGroupDto[];
}
