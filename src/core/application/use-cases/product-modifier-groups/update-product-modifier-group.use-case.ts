import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IProductModifierGroupRepository } from "../../../domain/repositories/product-modifier-group.repository.interface";
import { PRODUCT_MODIFIER_GROUP_REPOSITORY } from "../../../domain/repositories/product-modifier-group.repository.interface";
import { UpdateProductModifierGroupDto } from "../../dto/product-modifier-groups/update-product-modifier-group.dto";
import { ProductModifierGroupEntity } from "../../../domain/entities/product-modifier-group.entity";

@Injectable()
export class UpdateProductModifierGroupUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_GROUP_REPOSITORY)
    private readonly repository: IProductModifierGroupRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateProductModifierGroupDto,
  ): Promise<ProductModifierGroupEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = (await this.repository.findById(
      id,
    )) as ProductModifierGroupEntity | null;
    if (!existing) {
      throw new NotFoundException(`Modifier group with id "${id}" not found`);
    }
    const minSelect = dto.minSelect ?? existing.minSelect;
    const maxSelect = dto.maxSelect ?? existing.maxSelect;
    if (minSelect > maxSelect) {
      throw new BadRequestException(
        "minSelect must be less than or equal to maxSelect",
      );
    }
    return this.repository.update(
      id,
      dto as Partial<ProductModifierGroupEntity>,
    );
  }
}
