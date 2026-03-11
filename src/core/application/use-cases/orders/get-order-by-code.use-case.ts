import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IOrderRepository } from "../../../domain/repositories/order.repository.interface";
import { ORDER_REPOSITORY } from "../../../domain/repositories/order.repository.interface";
import { OrderEntity } from "../../../domain/entities/order.entity";

@Injectable()
export class GetOrderByCodeUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(shortCode: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findByShortCode(shortCode);
    if (!order) {
      throw new NotFoundException(
        `Order with shortCode ${shortCode} not found`,
      );
    }

    return order;
  }
}
