import { OrderEntity } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface CreateOrderData {
  userId: string;
  standId?: string;
  qrCode: string;
  shortCode: string;
  total: number;
  items: CreateOrderItemData[];
}

export interface CreateOrderItemData {
  productId: string;
  productSizeId?: string;
  comboId?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  modifiers: CreateOrderItemModifierData[];
}

export interface CreateOrderItemModifierData {
  modifierId: string;
  priceAdjustment: number;
}

export interface IOrderRepository {
  create(data: CreateOrderData): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
  findAll(): Promise<OrderEntity[]>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderEntity>;
}
