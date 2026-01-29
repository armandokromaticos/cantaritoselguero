import { Inject, Injectable } from "@nestjs/common";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";
import { ProductModifierEntity } from "../../../domain/entities/product-modifier.entity";

@Injectable()
export class GetProductModifiersUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly repository: IProductModifierRepository,
  ) {}

  async execute(groupId: string): Promise<ProductModifierEntity[]> {
    return this.repository.findByGroupId(groupId);
  }
}
