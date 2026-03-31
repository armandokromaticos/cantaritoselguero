import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";
import type { IProductModifierGroupRepository } from "../../../domain/repositories/product-modifier-group.repository.interface";
import { PRODUCT_MODIFIER_GROUP_REPOSITORY } from "../../../domain/repositories/product-modifier-group.repository.interface";

@Injectable()
export class DeleteProductModifierUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly modifierRepository: IProductModifierRepository,
    @Inject(PRODUCT_MODIFIER_GROUP_REPOSITORY)
    private readonly groupRepository: IProductModifierGroupRepository,
  ) {}

  async execute(
    productId: string,
    groupId: string,
    modifierId: string,
  ): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group || group.productId !== productId) {
      throw new NotFoundException(
        `Modifier group with id ${groupId} not found for product ${productId}`,
      );
    }

    const modifier = await this.modifierRepository.findById(modifierId);
    if (!modifier || modifier.groupId !== groupId) {
      throw new NotFoundException(
        `Modifier with id ${modifierId} not found in group ${groupId}`,
      );
    }

    await this.modifierRepository.delete(modifierId);
  }
}
