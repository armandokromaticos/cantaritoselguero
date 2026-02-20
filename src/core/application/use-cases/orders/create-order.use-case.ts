import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import type { IOrderRepository } from "../../../domain/repositories/order.repository.interface";
import {
  ORDER_REPOSITORY,
  CreateOrderData,
  CreateOrderItemData,
  CreateOrderItemModifierData,
} from "../../../domain/repositories/order.repository.interface";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import type { IProductSizeRepository } from "../../../domain/repositories/product-size.repository.interface";
import { PRODUCT_SIZE_REPOSITORY } from "../../../domain/repositories/product-size.repository.interface";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";
import type { IComboRepository } from "../../../domain/repositories/combo.repository.interface";
import { COMBO_REPOSITORY } from "../../../domain/repositories/combo.repository.interface";
import { CreateOrderDto } from "../../dto/orders/create-order.dto";
import { OrderEntity } from "../../../domain/entities/order.entity";

function generateShortCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(PRODUCT_SIZE_REPOSITORY)
    private readonly productSizeRepository: IProductSizeRepository,
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly productModifierRepository: IProductModifierRepository,
    @Inject(COMBO_REPOSITORY)
    private readonly comboRepository: IComboRepository,
  ) {}

  async execute(userId: string, dto: CreateOrderDto): Promise<OrderEntity> {
    const items: CreateOrderItemData[] = [];

    for (const itemDto of dto.items) {
      let unitPrice: number;

      if (itemDto.comboId) {
        const combo = await this.comboRepository.findById(itemDto.comboId);
        if (!combo) {
          throw new NotFoundException(
            `Combo with id ${itemDto.comboId} not found`,
          );
        }
        unitPrice = combo.price;
      } else if (itemDto.productSizeId) {
        const size = await this.productSizeRepository.findById(
          itemDto.productSizeId,
        );
        if (!size) {
          throw new NotFoundException(
            `ProductSize with id ${itemDto.productSizeId} not found`,
          );
        }
        unitPrice = size.price;
      } else {
        const product = await this.productRepository.findById(
          itemDto.productId,
        );
        if (!product) {
          throw new NotFoundException(
            `Product with id ${itemDto.productId} not found`,
          );
        }
        unitPrice = product.basePrice;
      }

      const modifiers: CreateOrderItemModifierData[] = [];
      let modifierTotal = 0;

      if (itemDto.modifiers && itemDto.modifiers.length > 0) {
        for (const modDto of itemDto.modifiers) {
          const modifier = await this.productModifierRepository.findById(
            modDto.modifierId,
          );
          if (!modifier) {
            throw new NotFoundException(
              `ProductModifier with id ${modDto.modifierId} not found`,
            );
          }
          const adj = modifier.priceAdjustment;
          modifierTotal += adj;
          modifiers.push({
            modifierId: modDto.modifierId,
            priceAdjustment: adj,
          });
        }
      }

      const subtotal =
        Math.round((unitPrice + modifierTotal) * itemDto.quantity * 100) / 100;

      items.push({
        productId: itemDto.productId,
        productSizeId: itemDto.productSizeId,
        comboId: itemDto.comboId,
        quantity: itemDto.quantity,
        unitPrice,
        subtotal,
        modifiers,
      });
    }

    const total =
      Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) /
      100;

    const qrCode = randomUUID();
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const shortCode = generateShortCode();
        const data: CreateOrderData = {
          userId,
          standId: dto.standId,
          qrCode,
          shortCode,
          total,
          items,
        };
        return await this.orderRepository.create(data);
      } catch (error: unknown) {
        const isUniqueViolation =
          error instanceof Error &&
          error.message.includes("Unique constraint failed");
        if (isUniqueViolation && attempt < maxRetries - 1) {
          continue;
        }
        throw error;
      }
    }

    throw new BadRequestException(
      "Failed to generate unique shortCode after multiple attempts",
    );
  }
}
