import { Inject, Injectable } from "@nestjs/common";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";
import { UpdateProductModifierDto } from "../../dto/product-modifiers/update-product-modifier.dto";
import { ProductModifierEntity } from "../../../domain/entities/product-modifier.entity";

@Injectable()
export class UpdateProductModifierUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly repository: IProductModifierRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateProductModifierDto,
  ): Promise<ProductModifierEntity> {
    return this.repository.update(id, dto as Partial<ProductModifierEntity>);
  }
}
