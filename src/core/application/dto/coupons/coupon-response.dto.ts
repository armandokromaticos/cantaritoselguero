import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CouponUsageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  usedAt: Date;
}

export class CouponResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  discountPercent: number;

  @ApiProperty()
  maxDiscount: number;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  usedQuantity: number;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => [CouponUsageResponseDto] })
  usages?: CouponUsageResponseDto[];
}
