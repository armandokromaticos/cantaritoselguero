import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { OrderStatus } from "../../../domain/enums/order-status.enum";
import { Role } from "../../../domain/enums/role.enum";
import { PrismaService } from "../../../infrastructure/database/prisma/prisma.service";
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
    private readonly prisma: PrismaService,
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

    // Find orders with pending items for this stand
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

    const dto = new StandPendingItemsResponseDto();
    dto.standId = stand.id;
    dto.standName = stand.name;
    dto.orders = orders.map((order) => {
      const group = new PendingOrderGroupDto();
      group.orderId = order.id;
      group.shortCode = order.shortCode;
      group.qrCode = order.qrCode;
      group.createdAt = order.createdAt;
      group.items = order.items.map((item) => {
        const itemDto = new PendingOrderItemDto();
        itemDto.itemId = item.id;
        itemDto.productNameEs = item.product.nameEs;
        itemDto.productNameEn = item.product.nameEn;
        itemDto.sizeName = item.productSize?.nameEs ?? null;
        itemDto.quantity = item.quantity;
        itemDto.modifiers = item.modifiers.map((mod) => {
          const modDto = new PendingOrderItemModifierDto();
          modDto.nameEs = mod.modifier.nameEs;
          modDto.nameEn = mod.modifier.nameEn;
          return modDto;
        });
        return itemDto;
      });
      return group;
    });

    return dto;
  }
}
