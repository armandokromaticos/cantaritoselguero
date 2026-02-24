import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IOrderRepository } from "../../../domain/repositories/order.repository.interface";
import { ORDER_REPOSITORY } from "../../../domain/repositories/order.repository.interface";
import { OrderEntity } from "../../../domain/entities/order.entity";

@Injectable()
export class GetOrderByQrUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(qrCode: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findByQrCode(qrCode);
    if (!order) {
      throw new NotFoundException(`Order with qrCode ${qrCode} not found`);
    }

    return order;
  }
}
