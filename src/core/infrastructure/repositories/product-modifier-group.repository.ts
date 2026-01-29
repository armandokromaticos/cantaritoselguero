import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IProductModifierGroupRepository } from "../../domain/repositories/product-modifier-group.repository.interface";
import { ProductModifierGroupEntity } from "../../domain/entities/product-modifier-group.entity";

@Injectable()
export class ProductModifierGroupRepository implements IProductModifierGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    entity: ProductModifierGroupEntity,
  ): Promise<ProductModifierGroupEntity> {
    const data = entity.toPrismaCreate();
    const group = await this.prisma.productModifierGroup.create({ data: data as never });
    return ProductModifierGroupEntity.fromPrisma(group);
  }

  async findByProductId(productId: string): Promise<ProductModifierGroupEntity[]> {
    const groups = await this.prisma.productModifierGroup.findMany({
      where: { productId },
      include: { modifiers: true },
    });
    return groups.map((group) => ProductModifierGroupEntity.fromPrisma(group));
  }

  async update(
    id: string,
    entity: Partial<ProductModifierGroupEntity>,
  ): Promise<ProductModifierGroupEntity> {
    const data: Record<string, unknown> = {};
    if (entity.name !== undefined) data.name = entity.name;
    if (entity.description !== undefined) data.description = entity.description;
    if (entity.minSelect !== undefined) data.minSelect = entity.minSelect;
    if (entity.maxSelect !== undefined) data.maxSelect = entity.maxSelect;
    if (entity.sortOrder !== undefined) data.sortOrder = entity.sortOrder;
    if (entity.isRequired !== undefined) data.isRequired = entity.isRequired;
    if (entity.productId !== undefined) {
      data.product = { connect: { id: entity.productId } };
    }
    const group = await this.prisma.productModifierGroup.update({
      where: { id },
      data: data as never,
    });
    return ProductModifierGroupEntity.fromPrisma(group);
  }
}
