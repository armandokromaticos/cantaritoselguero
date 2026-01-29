import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IProductModifierRepository } from "../../domain/repositories/product-modifier.repository.interface";
import { ProductModifierEntity } from "../../domain/entities/product-modifier.entity";

@Injectable()
export class ProductModifierRepository implements IProductModifierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ProductModifierEntity): Promise<ProductModifierEntity> {
    const data = entity.toPrismaCreate();
    const modifier = await this.prisma.productModifier.create({ data: data as never });
    return ProductModifierEntity.fromPrisma(modifier);
  }

  async findByGroupId(groupId: string): Promise<ProductModifierEntity[]> {
    const modifiers = await this.prisma.productModifier.findMany({ where: { groupId } });
    return modifiers.map((modifier) => ProductModifierEntity.fromPrisma(modifier));
  }

  async update(
    id: string,
    entity: Partial<ProductModifierEntity>,
  ): Promise<ProductModifierEntity> {
    const data: Record<string, unknown> = {};
    if (entity.name !== undefined) data.name = entity.name;
    if (entity.priceAdjustment !== undefined) {
      const { Prisma } = await import("@prisma/client");
      data.priceAdjustment = new Prisma.Decimal(entity.priceAdjustment);
    }
    if (entity.isDefault !== undefined) data.isDefault = entity.isDefault;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;
    if (entity.sortOrder !== undefined) data.sortOrder = entity.sortOrder;
    if (entity.groupId !== undefined) {
      data.group = { connect: { id: entity.groupId } };
    }
    const modifier = await this.prisma.productModifier.update({
      where: { id },
      data: data as never,
    });
    return ProductModifierEntity.fromPrisma(modifier);
  }
}
