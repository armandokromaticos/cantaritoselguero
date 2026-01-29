import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Modifier with id "${id}" not found`);
    }
    return this.repository.update(id, dto as Partial<ProductModifierEntity>);
  }
}
