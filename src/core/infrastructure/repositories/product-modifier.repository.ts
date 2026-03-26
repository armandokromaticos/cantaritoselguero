import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma/prisma.service";
import { IProductModifierRepository } from "../../domain/repositories/product-modifier.repository.interface";
import { ProductModifierEntity } from "../../domain/entities/product-modifier.entity";

@Injectable()
export class ProductModifierRepository implements IProductModifierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ProductModifierEntity): Promise<ProductModifierEntity> {
    const data = entity.toPrismaCreate();
    const modifier = await this.prisma.productModifier.create({
      data: data as never,
    });
    return ProductModifierEntity.fromPrisma(modifier);
  }

  async findById(id: string): Promise<ProductModifierEntity | null> {
    const modifier = await this.prisma.productModifier.findUnique({
      where: { id },
    });
    return modifier ? ProductModifierEntity.fromPrisma(modifier) : null;
  }

  async findByGroupId(groupId: string): Promise<ProductModifierEntity[]> {
    const modifiers = await this.prisma.productModifier.findMany({
      where: { groupId },
    });
    return modifiers.map((modifier) =>
      ProductModifierEntity.fromPrisma(modifier),
    );
  }

  async update(
    id: string,
    entity: Partial<ProductModifierEntity>,
  ): Promise<ProductModifierEntity> {
    const data: Record<string, unknown> = {};
    if (entity.nameEs !== undefined) data.nameEs = entity.nameEs;
    if (entity.nameEn !== undefined) data.nameEn = entity.nameEn;
    if (entity.priceAdjustment !== undefined) {
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
