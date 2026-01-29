import { Inject, Injectable } from "@nestjs/common";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";
import { CreateProductModifierDto } from "../../dto/product-modifiers/create-product-modifier.dto";
import { ProductModifierEntity } from "../../../domain/entities/product-modifier.entity";

@Injectable()
export class CreateProductModifierUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly repository: IProductModifierRepository,
  ) {}

  async execute(
    groupId: string,
    dto: CreateProductModifierDto,
  ): Promise<ProductModifierEntity> {
    const entity = ProductModifierEntity.fromCreateDto(groupId, dto);
    return this.repository.create(entity);
  }
}
