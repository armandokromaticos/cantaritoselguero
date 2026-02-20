import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma/prisma.service";
import {
  IOrderRepository,
  CreateOrderData,
} from "../../domain/repositories/order.repository.interface";
import { OrderEntity } from "../../domain/entities/order.entity";
import { OrderStatus } from "../../domain/enums/order-status.enum";

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly ORDER_INCLUDE = {
    items: {
      include: { modifiers: true },
    },
  };

  async create(data: CreateOrderData): Promise<OrderEntity> {
    const order = await this.prisma.order.create({
      data: {
        userId: data.userId,
        standId: data.standId ?? null,
        qrCode: data.qrCode,
        shortCode: data.shortCode,
        total: new Prisma.Decimal(data.total),
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productSizeId: item.productSizeId ?? null,
            comboId: item.comboId ?? null,
            quantity: item.quantity,
            unitPrice: new Prisma.Decimal(item.unitPrice),
            subtotal: new Prisma.Decimal(item.subtotal),
            modifiers: {
              create: item.modifiers.map((mod) => ({
                modifierId: mod.modifierId,
                priceAdjustment: new Prisma.Decimal(mod.priceAdjustment),
              })),
            },
          })),
        },
      },
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

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: OrderRepository.ORDER_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return orders.map((order) => OrderEntity.fromPrisma(order));
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      include: OrderRepository.ORDER_INCLUDE,
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
}
