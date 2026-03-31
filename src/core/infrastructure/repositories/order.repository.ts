import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma/prisma.service";
import {
  IOrderRepository,
  OrderFilters,
  PendingOrderGroup,
} from "../../domain/repositories/order.repository.interface";
import { OrderEntity } from "../../domain/entities/order.entity";
import { OrderStatus } from "../../domain/enums/order-status.enum";

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly ORDER_INCLUDE = {
    items: {
      include: { modifiers: true, deliveries: true },
    },
  };

  async create(entity: OrderEntity): Promise<OrderEntity> {
    const data = entity.toPrismaCreate();
    const order = await this.prisma.order.create({
      data: data as Prisma.OrderCreateInput,
      include: OrderRepository.ORDER_INCLUDE,
    });
    return OrderEntity.fromPrisma(order);
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: OrderRepository.ORDER_INCLUDE,
    });
    return order ? OrderEntity.fromPrisma(order) : null;
  }

  async findByQrCode(qrCode: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { qrCode },
      include: OrderRepository.ORDER_INCLUDE,
    });
    return order ? OrderEntity.fromPrisma(order) : null;
  }

  async findByShortCode(shortCode: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { shortCode },
      include: OrderRepository.ORDER_INCLUDE,
    });
    return order ? OrderEntity.fromPrisma(order) : null;
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: OrderRepository.ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return orders.map((order) => OrderEntity.fromPrisma(order));
  }

  async findAll(filters?: OrderFilters): Promise<OrderEntity[]> {
    const where: Record<string, unknown> = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }

    const standFilter = filters?.standId
      ? filters.standId
      : filters?.standIds
        ? { in: filters.standIds }
        : undefined;

    if (standFilter) {
      where.items = { some: { standId: standFilter } };
    }

    const itemsInclude = standFilter
      ? {
          where: { standId: standFilter },
          include: { modifiers: true, deliveries: true },
        }
      : { include: { modifiers: true, deliveries: true } };

    const orders = await this.prisma.order.findMany({
      where,
      include: { items: itemsInclude },
      orderBy: { createdAt: "desc" },
    });
    return orders.map((order) => OrderEntity.fromPrisma(order));
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderEntity> {
    const order = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: OrderRepository.ORDER_INCLUDE,
    });
    return OrderEntity.fromPrisma(order);
  }

  async createDelivery(
    orderItemId: string,
    standId: string,
    deliveredByUserId: string,
  ): Promise<void> {
    await this.prisma.orderItemDelivery.create({
      data: { orderItemId, standId, deliveredByUserId },
    });
  }

  async findPendingByStand(standId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.PAID, OrderStatus.PARTIAL] },
        items: {
          some: {
            standId,
            deliveries: { none: {} },
          },
        },
      },
      include: {
        items: {
          where: {
            standId,
            deliveries: { none: {} },
          },
          include: {
            modifiers: true,
            deliveries: true,
            product: true,
            productSize: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return orders.map((order) => OrderEntity.fromPrisma(order));
  }

  async findPendingItemsByStand(standId: string): Promise<PendingOrderGroup[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.PAID, OrderStatus.PARTIAL] },
        items: {
          some: {
            standId,
            deliveries: { none: {} },
          },
        },
      },
      include: {
        items: {
          where: {
            standId,
            deliveries: { none: {} },
          },
          include: {
            product: true,
            productSize: true,
            modifiers: {
              include: { modifier: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return orders.map((order) => ({
      orderId: order.id,
      shortCode: order.shortCode,
      qrCode: order.qrCode,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        itemId: item.id,
        productNameEs: item.product.nameEs,
        productNameEn: item.product.nameEn,
        sizeName: item.productSize?.nameEs ?? null,
        quantity: item.quantity,
        modifiers: item.modifiers.map((mod) => ({
          nameEs: mod.modifier.nameEs,
          nameEn: mod.modifier.nameEn,
        })),
      })),
    }));
  }
}
