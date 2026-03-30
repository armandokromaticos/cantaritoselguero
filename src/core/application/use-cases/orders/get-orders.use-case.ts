import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
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
      const operatorStandIds =
        await this.standRepository.findStandIdsByOperator(userId);

      if (operatorStandIds.length === 0) {
        throw new BadRequestException(
          "You are not assigned as an operator of any stand",
        );
      }

      if (standId) {
        if (!operatorStandIds.includes(standId)) {
          throw new ForbiddenException(
            "You are not an operator of the requested stand",
          );
        }
        return this.orderRepository.findAll({ standId });
      }

      // No specific stand requested: return orders across all operator stands
      return this.orderRepository.findAll({ standIds: operatorStandIds });
    }

    return this.orderRepository.findByUserId(userId);
  }
}
