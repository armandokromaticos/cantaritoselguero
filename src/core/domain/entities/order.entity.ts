import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  OrderItemModifier as PrismaOrderItemModifier,
} from "@prisma/client";
import { OrderStatus } from "../enums/order-status.enum";
import {
  OrderResponseDto,
  OrderItemResponseDto,
  OrderItemModifierResponseDto,
} from "../../application/dto/orders/order-response.dto";

type PrismaOrderWithRelations = PrismaOrder & {
  items?: (PrismaOrderItem & {
    modifiers?: PrismaOrderItemModifier[];
  })[];
};

interface OrderItemModifierInfo {
  id: string;
  modifierId: string;
  priceAdjustment: number;
}

interface OrderItemInfo {
  id: string;
  productId: string;
  productSizeId: string | null;
  comboId: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  modifiers: OrderItemModifierInfo[];
}

interface OrderProps {
  id: string;
  userId: string;
  standId: string | null;
  status: OrderStatus;
  qrCode: string;
  shortCode: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemInfo[];
}

export class OrderEntity {
  private props: OrderProps;

  constructor(props: OrderProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get standId(): string | null {
    return this.props.standId;
  }
  get status(): OrderStatus {
    return this.props.status;
  }
  get qrCode(): string {
    return this.props.qrCode;
  }
  get shortCode(): string {
    return this.props.shortCode;
  }
  get total(): number {
    return this.props.total;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get items(): OrderItemInfo[] | undefined {
    return this.props.items;
  }

  static fromPrisma(prisma: PrismaOrderWithRelations): OrderEntity {
    const props: OrderProps = {
      id: prisma.id,
      userId: prisma.userId,
      standId: prisma.standId,
      status: prisma.status as OrderStatus,
      qrCode: prisma.qrCode,
      shortCode: prisma.shortCode,
      total: Number(prisma.total),
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    if (prisma.items) {
      props.items = prisma.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productSizeId: item.productSizeId,
        comboId: item.comboId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        subtotal: Number(item.subtotal),
        modifiers: (item.modifiers ?? []).map((mod) => ({
          id: mod.id,
          modifierId: mod.modifierId,
          priceAdjustment: Number(mod.priceAdjustment),
        })),
      }));
    }

    return new OrderEntity(props);
  }

  toResponseDto(): OrderResponseDto {
    const dto = new OrderResponseDto();
    dto.id = this.props.id;
    dto.userId = this.props.userId;
    dto.standId = this.props.standId;
    dto.status = this.props.status;
    dto.qrCode = this.props.qrCode;
    dto.shortCode = this.props.shortCode;
    dto.total = this.props.total;
    dto.createdAt = this.props.createdAt;
    dto.updatedAt = this.props.updatedAt;

    if (this.props.items) {
      dto.items = this.props.items.map((item) => {
        const itemDto = new OrderItemResponseDto();
        itemDto.id = item.id;
        itemDto.productId = item.productId;
        itemDto.productSizeId = item.productSizeId;
        itemDto.comboId = item.comboId;
        itemDto.quantity = item.quantity;
        itemDto.unitPrice = item.unitPrice;
        itemDto.subtotal = item.subtotal;
        itemDto.modifiers = item.modifiers.map((mod) => {
          const modDto = new OrderItemModifierResponseDto();
          modDto.id = mod.id;
          modDto.modifierId = mod.modifierId;
          modDto.priceAdjustment = mod.priceAdjustment;
          return modDto;
        });
        return itemDto;
      });
    }

    return dto;
  }
}
