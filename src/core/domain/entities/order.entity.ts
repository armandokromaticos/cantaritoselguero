import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  OrderItemModifier as PrismaOrderItemModifier,
  OrderItemDelivery as PrismaOrderItemDelivery,
} from "@prisma/client";
import { OrderStatus } from "../enums/order-status.enum";
import {
  OrderResponseDto,
  OrderItemResponseDto,
  OrderItemModifierResponseDto,
  OrderItemDeliveryResponseDto,
} from "../../application/dto/orders/order-response.dto";
import { OrderStateMachine } from "../services/order-state-machine";
import { Money } from "../value-objects/money.vo";

type PrismaOrderWithRelations = PrismaOrder & {
  couponId?: string | null;
  subtotal?: unknown;
  discount?: unknown;
  items?: (PrismaOrderItem & {
    modifiers?: PrismaOrderItemModifier[];
    deliveries?: PrismaOrderItemDelivery[];
  })[];
};

interface OrderItemModifierInfo {
  id: string | undefined;
  modifierId: string;
  priceAdjustment: number;
}

interface OrderItemDeliveryInfo {
  id: string;
  standId: string;
  deliveredByUserId: string;
  deliveredAt: Date;
}

interface OrderItemInfo {
  id: string | undefined;
  productId: string;
  productSizeId: string | null;
  comboId: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  modifiers: OrderItemModifierInfo[];
  deliveries: OrderItemDeliveryInfo[];
}

interface OrderProps {
  id: string | undefined;
  userId: string;
  standId: string | null;
  couponId: string | null;
  status: OrderStatus;
  qrCode: string;
  shortCode: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemInfo[];
}

export interface CreateOrderItemModifierParams {
  modifierId: string;
  priceAdjustment: number;
}

export interface CreateOrderItemParams {
  productId: string;
  productSizeId?: string;
  comboId?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  modifiers: CreateOrderItemModifierParams[];
}

export interface CreateOrderParams {
  userId: string;
  standId?: string;
  couponId?: string;
  qrCode: string;
  shortCode: string;
  subtotal: number;
  discount: number;
  total: number;
  items: CreateOrderItemParams[];
}

export class OrderEntity {
  private static readonly stateMachine = new OrderStateMachine();
  private props: OrderProps;

  constructor(props: OrderProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get standId(): string | null {
    return this.props.standId;
  }
  get couponId(): string | null {
    return this.props.couponId;
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
  get subtotal(): number {
    return this.props.subtotal;
  }
  get discount(): number {
    return this.props.discount;
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

  canTransitionTo(status: OrderStatus): boolean {
    return OrderEntity.stateMachine.canTransition(this.props.status, status);
  }

  isItemDelivered(itemId: string): boolean {
    const item = this.props.items?.find((orderItem) => orderItem.id === itemId);
    if (!item) return false;
    return item.deliveries.length > 0;
  }

  areAllItemsDelivered(): boolean {
    if (!this.props.items || this.props.items.length === 0) return false;
    return this.props.items.every((item) => item.deliveries.length > 0);
  }

  calculateTotal(): Money {
    if (!this.props.items || this.props.items.length === 0) {
      return Money.zero();
    }

    let total = Money.zero();
    for (const item of this.props.items) {
      const unitPrice = Money.create(item.unitPrice);
      const modifiersAdjustment = Money.create(
        item.modifiers.reduce(
          (sum, modifier) => sum + modifier.priceAdjustment,
          0,
        ),
      );
      const itemTotal = unitPrice
        .add(modifiersAdjustment)
        .multiply(item.quantity);
      total = total.add(itemTotal);
    }

    return total;
  }

  static fromCreateDto(params: CreateOrderParams): OrderEntity {
    return new OrderEntity({
      id: undefined,
      userId: params.userId,
      standId: params.standId ?? null,
      couponId: params.couponId ?? null,
      status: OrderStatus.PENDING,
      qrCode: params.qrCode,
      shortCode: params.shortCode,
      subtotal: params.subtotal,
      discount: params.discount,
      total: params.total,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: params.items.map((item) => ({
        id: undefined,
        productId: item.productId,
        productSizeId: item.productSizeId ?? null,
        comboId: item.comboId ?? null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        modifiers: item.modifiers.map((modifier) => ({
          id: undefined,
          modifierId: modifier.modifierId,
          priceAdjustment: modifier.priceAdjustment,
        })),
        deliveries: [],
      })),
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    return {
      userId: this.props.userId,
      standId: this.props.standId,
      couponId: this.props.couponId,
      qrCode: this.props.qrCode,
      shortCode: this.props.shortCode,
      subtotal: this.props.subtotal,
      discount: this.props.discount,
      total: this.props.total,
      items: {
        create: (this.props.items ?? []).map((item) => ({
          productId: item.productId,
          productSizeId: item.productSizeId,
          comboId: item.comboId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          modifiers: {
            create: item.modifiers.map((modifier) => ({
              modifierId: modifier.modifierId,
              priceAdjustment: modifier.priceAdjustment,
            })),
          },
        })),
      },
    };
  }

  static fromPrisma(prisma: PrismaOrderWithRelations): OrderEntity {
    const props: OrderProps = {
      id: prisma.id,
      userId: prisma.userId,
      standId: prisma.standId,
      couponId: prisma.couponId ?? null,
      status: prisma.status as OrderStatus,
      qrCode: prisma.qrCode,
      shortCode: prisma.shortCode,
      subtotal: Number(prisma.subtotal ?? prisma.total),
      discount: Number(prisma.discount ?? 0),
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
        modifiers: (item.modifiers ?? []).map((modifier) => ({
          id: modifier.id,
          modifierId: modifier.modifierId,
          priceAdjustment: Number(modifier.priceAdjustment),
        })),
        deliveries: (item.deliveries ?? []).map((delivery) => ({
          id: delivery.id,
          standId: delivery.standId,
          deliveredByUserId: delivery.deliveredByUserId,
          deliveredAt: delivery.deliveredAt,
        })),
      }));
    }

    return new OrderEntity(props);
  }

  toResponseDto(): OrderResponseDto {
    if (!this.props.id) {
      throw new Error("Cannot convert unpersisted entity to response DTO");
    }
    const dto = new OrderResponseDto();
    dto.id = this.props.id;
    dto.userId = this.props.userId;
    dto.standId = this.props.standId;
    dto.couponId = this.props.couponId;
    dto.status = this.props.status;
    dto.qrCode = this.props.qrCode;
    dto.shortCode = this.props.shortCode;
    dto.subtotal = this.props.subtotal;
    dto.discount = this.props.discount;
    dto.total = this.props.total;
    dto.createdAt = this.props.createdAt;
    dto.updatedAt = this.props.updatedAt;

    if (this.props.items) {
      dto.items = this.props.items.map((item) => {
        if (!item.id) {
          throw new Error(
            "Cannot convert unpersisted order item to response DTO",
          );
        }
        const itemDto = new OrderItemResponseDto();
        itemDto.id = item.id;
        itemDto.productId = item.productId;
        itemDto.productSizeId = item.productSizeId;
        itemDto.comboId = item.comboId;
        itemDto.quantity = item.quantity;
        itemDto.unitPrice = item.unitPrice;
        itemDto.subtotal = item.subtotal;
        itemDto.modifiers = item.modifiers.map((modifier) => {
          if (!modifier.id) {
            throw new Error(
              "Cannot convert unpersisted order item modifier to response DTO",
            );
          }
          const modDto = new OrderItemModifierResponseDto();
          modDto.id = modifier.id;
          modDto.modifierId = modifier.modifierId;
          modDto.priceAdjustment = modifier.priceAdjustment;
          return modDto;
        });
        itemDto.deliveries = item.deliveries.map((delivery) => {
          const delDto = new OrderItemDeliveryResponseDto();
          delDto.id = delivery.id;
          delDto.standId = delivery.standId;
          delDto.deliveredByUserId = delivery.deliveredByUserId;
          delDto.deliveredAt = delivery.deliveredAt;
          return delDto;
        });
        return itemDto;
      });
    }

    return dto;
  }
}
