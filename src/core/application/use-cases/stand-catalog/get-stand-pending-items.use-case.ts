import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import type { IOrderRepository } from "../../../domain/repositories/order.repository.interface";
import { ORDER_REPOSITORY } from "../../../domain/repositories/order.repository.interface";
import { Role } from "../../../domain/enums/role.enum";
import {
  StandPendingItemsResponseDto,
  PendingOrderGroupDto,
  PendingOrderItemDto,
  PendingOrderItemModifierDto,
} from "../../dto/stands/stand-pending-items.dto";

@Injectable()
export class GetStandPendingItemsUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(
    standId: string,
    operatorUserId: string,
    userRole: Role,
  ): Promise<StandPendingItemsResponseDto> {
    const stand = await this.standRepository.findById(standId);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${standId} not found`);
    }

    if (userRole !== Role.ADMIN && !stand.hasOperator(operatorUserId)) {
      throw new ForbiddenException(
        "You are not assigned as an operator of this stand",
      );
    }

    const pendingGroups =
      await this.orderRepository.findPendingItemsByStand(standId);

    const dto = new StandPendingItemsResponseDto();
    dto.standId = stand.id;
    dto.standName = stand.name;
    dto.orders = pendingGroups.map((order) => {
      const group = new PendingOrderGroupDto();
      group.orderId = order.orderId;
      group.shortCode = order.shortCode;
      group.qrCode = order.qrCode;
      group.createdAt = order.createdAt;
      group.items = order.items.map((item) => {
        const itemDto = new PendingOrderItemDto();
        itemDto.itemId = item.itemId;
        itemDto.productNameEs = item.productNameEs;
        itemDto.productNameEn = item.productNameEn;
        itemDto.sizeName = item.sizeName;
        itemDto.quantity = item.quantity;
        itemDto.modifiers = item.modifiers.map((mod) => {
          const modDto = new PendingOrderItemModifierDto();
          modDto.nameEs = mod.nameEs;
          modDto.nameEn = mod.nameEn;
          return modDto;
        });
        return itemDto;
      });
      return group;
    });

    return dto;
  }
}
