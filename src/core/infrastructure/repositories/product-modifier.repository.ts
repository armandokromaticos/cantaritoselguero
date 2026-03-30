import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma/prisma.service";
import {
  IProductModifierRepository,
  ModifierSizePriceEntry,
} from "../../domain/repositories/product-modifier.repository.interface";
import { ProductModifierEntity } from "../../domain/entities/product-modifier.entity";

@Injectable()
export class ProductModifierRepository implements IProductModifierRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly MODIFIER_INCLUDE = {
    tags: { include: { tag: true } },
    sizePrices: true,
  };

  async create(entity: ProductModifierEntity): Promise<ProductModifierEntity> {
    const data = entity.toPrismaCreate();
    const modifier = await this.prisma.productModifier.create({
      data: data as never,
      include: ProductModifierRepository.MODIFIER_INCLUDE,
    });
    return ProductModifierEntity.fromPrisma(modifier);
  }

  async findById(id: string): Promise<ProductModifierEntity | null> {
    const modifier = await this.prisma.productModifier.findUnique({
      where: { id },
      include: ProductModifierRepository.MODIFIER_INCLUDE,
    });
    return modifier ? ProductModifierEntity.fromPrisma(modifier) : null;
  }

  async findByGroupId(groupId: string): Promise<ProductModifierEntity[]> {
    const modifiers = await this.prisma.productModifier.findMany({
      where: { groupId },
      include: ProductModifierRepository.MODIFIER_INCLUDE,
    });
    return modifiers.map((modifier) =>
      ProductModifierEntity.fromPrisma(modifier),
    );
  }

  async assignTags(modifierId: string, tagIds: string[]): Promise<void> {
    await this.prisma.productModifierTag.createMany({
      data: tagIds.map((tagId) => ({ modifierId, tagId })),
      skipDuplicates: true,
    });
  }

  async removeTag(modifierId: string, tagId: string): Promise<void> {
    await this.prisma.productModifierTag.delete({
      where: { modifierId_tagId: { modifierId, tagId } },
    });
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
      include: ProductModifierRepository.MODIFIER_INCLUDE,
    });
    return ProductModifierEntity.fromPrisma(modifier);
  }

  async setSizePrices(
    modifierId: string,
    entries: ModifierSizePriceEntry[],
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.modifierSizePrice.deleteMany({ where: { modifierId } }),
      this.prisma.modifierSizePrice.createMany({
        data: entries.map((entry) => ({
          modifierId,
          productSizeId: entry.productSizeId,
          priceAdjustment: new Prisma.Decimal(entry.priceAdjustment),
        })),
      }),
    ]);
  }

  async findSizePrices(modifierId: string): Promise<ModifierSizePriceEntry[]> {
    const records = await this.prisma.modifierSizePrice.findMany({
      where: { modifierId },
    });
    return records.map((r) => ({
      productSizeId: r.productSizeId,
      priceAdjustment: Number(r.priceAdjustment),
    }));
  }

  async findSizePrice(
    modifierId: string,
    productSizeId: string,
  ): Promise<number | null> {
    const record = await this.prisma.modifierSizePrice.findUnique({
      where: { modifierId_productSizeId: { modifierId, productSizeId } },
    });
    return record ? Number(record.priceAdjustment) : null;
  }
}
