import { Inject, Injectable } from "@nestjs/common";
import type { IOrderRepository } from "../../../domain/repositories/order.repository.interface";
import { ORDER_REPOSITORY } from "../../../domain/repositories/order.repository.interface";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { OrderEntity } from "../../../domain/entities/order.entity";
import { Role } from "../../../domain/enums/role.enum";

@Injectable()
export class GetOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(
    userId: string,
    userRole: Role,
    standId?: string,
  ): Promise<OrderEntity[]> {
    if (userRole === Role.ADMIN) {
      return this.orderRepository.findAll(standId ? { standId } : undefined);
    }

    if (userRole === Role.STAND_OPERATOR) {
      // If standId provided, use it; otherwise auto-detect from operator's stands
      const filterStandId =
        standId ?? (await this.resolveOperatorStandId(userId));
      if (filterStandId) {
        return this.orderRepository.findAll({ standId: filterStandId });
      }
      return [];
    }

    return this.orderRepository.findByUserId(userId);
  }

  private async resolveOperatorStandId(userId: string): Promise<string | null> {
    const standIds = await this.standRepository.findStandIdsByOperator(userId);
    return standIds.length > 0 ? standIds[0] : null;
  }
}
