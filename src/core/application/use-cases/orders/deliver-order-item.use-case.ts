import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IOrderRepository } from "../../../domain/repositories/order.repository.interface";
import { ORDER_REPOSITORY } from "../../../domain/repositories/order.repository.interface";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { OrderEntity } from "../../../domain/entities/order.entity";
import { OrderStatus } from "../../../domain/enums/order-status.enum";

@Injectable()
export class DeliverOrderItemUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(
    orderId: string,
    itemId: string,
    standId: string,
    operatorUserId: string,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (
      order.status !== OrderStatus.PAID &&
      order.status !== OrderStatus.PARTIAL
    ) {
      throw new BadRequestException(
        "Only PAID or PARTIAL orders can receive deliveries",
      );
    }

    const item = order.items?.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(
        `OrderItem with id ${itemId} not found in order ${orderId}`,
      );
    }

    if (order.isItemDelivered(itemId)) {
      throw new BadRequestException(
        `OrderItem ${itemId} has already been delivered`,
      );
    }

    const stand = await this.standRepository.findById(standId);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${standId} not found`);
    }

    if (!stand.hasOperator(operatorUserId)) {
      throw new ForbiddenException(
        "You are not assigned as an operator of this stand",
      );
    }

    await this.orderRepository.createDelivery(itemId, standId, operatorUserId);

    // Re-fetch to determine correct status after delivery
    const updatedOrder = await this.orderRepository.findById(orderId);
    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    // Determine target status: COMPLETED if all items delivered, otherwise PARTIAL
    const targetStatus = updatedOrder.areAllItemsDelivered()
      ? OrderStatus.COMPLETED
      : OrderStatus.PARTIAL;

    if (updatedOrder.canTransitionTo(targetStatus)) {
      return this.orderRepository.updateStatus(orderId, targetStatus);
    }

    return updatedOrder;
  }
}
