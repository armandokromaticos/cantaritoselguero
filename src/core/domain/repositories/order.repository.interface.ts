import { OrderEntity } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface OrderFilters {
  standId?: string;
  userId?: string;
  status?: OrderStatus[];
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
}
