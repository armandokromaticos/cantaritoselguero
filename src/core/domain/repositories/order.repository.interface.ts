import { OrderEntity } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface OrderFilters {
  standId?: string;
  standIds?: string[];
  userId?: string;
  status?: OrderStatus[];
}

export interface PendingItemModifier {
  nameEs: string;
  nameEn: string | null;
}

export interface PendingItem {
  itemId: string;
  productNameEs: string;
  productNameEn: string | null;
  sizeName: string | null;
  quantity: number;
  modifiers: PendingItemModifier[];
}

export interface PendingOrderGroup {
  orderId: string;
  shortCode: string;
  qrCode: string;
  createdAt: Date;
  items: PendingItem[];
}

export interface IOrderRepository {
  create(entity: OrderEntity): Promise<OrderEntity>;
  findById(id: string): Promise<OrderEntity | null>;
  findByQrCode(qrCode: string): Promise<OrderEntity | null>;
  findByShortCode(shortCode: string): Promise<OrderEntity | null>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
  findAll(filters?: OrderFilters): Promise<OrderEntity[]>;
  updateStatus(id: string, status: OrderStatus): Promise<OrderEntity>;
  createDelivery(
    orderItemId: string,
    standId: string,
    deliveredByUserId: string,
  ): Promise<void>;
  findPendingByStand(standId: string): Promise<OrderEntity[]>;
  findPendingItemsByStand(standId: string): Promise<PendingOrderGroup[]>;
}
