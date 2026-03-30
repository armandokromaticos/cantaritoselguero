import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma/prisma.service";
import { IProductRepository } from "../../domain/repositories/product.repository.interface";
import { ProductEntity } from "../../domain/entities/product.entity";

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ProductEntity): Promise<ProductEntity> {
    const data = entity.toPrismaCreate();
    const product = await this.prisma.product.create({ data: data as never });
    return ProductEntity.fromPrisma(product);
  }

  private static readonly PRODUCT_INCLUDE = {
    sizes: true,
    modifierGroups: {
      include: {
        modifiers: {
          include: { tags: { include: { tag: true } } },
        },
      },
    },
    tags: {
      include: { tag: true },
    },
  };

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: ProductRepository.PRODUCT_INCLUDE,
    });
    return product ? ProductEntity.fromPrisma(product) : null;
  }

  async findAll(tagId?: string): Promise<ProductEntity[]> {
    const where = tagId ? { tags: { some: { tagId } } } : undefined;
    const products = await this.prisma.product.findMany({
      where,
      include: ProductRepository.PRODUCT_INCLUDE,
    });
    return products.map((product) => ProductEntity.fromPrisma(product));
  }

  async update(
    id: string,
    entity: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const data: Record<string, unknown> = {};
    if (entity.nameEs !== undefined) data.nameEs = entity.nameEs;
    if (entity.nameEn !== undefined) data.nameEn = entity.nameEn;
    if (entity.descriptionEs !== undefined)
      data.descriptionEs = entity.descriptionEs;
    if (entity.descriptionEn !== undefined)
      data.descriptionEn = entity.descriptionEn;
    if (entity.basePrice !== undefined) {
      data.basePrice = new Prisma.Decimal(entity.basePrice);
    }
    if (entity.image !== undefined) data.image = entity.image;
    if (entity.stock !== undefined) data.stock = entity.stock;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;
    if (entity.standId !== undefined) {
      data.stand = entity.standId
        ? { connect: { id: entity.standId } }
        : { disconnect: true };
    }
    const product = await this.prisma.product.update({
      where: { id },
      data: data as never,
      include: ProductRepository.PRODUCT_INCLUDE,
    });
    return ProductEntity.fromPrisma(product);
  }

  async updateStock(id: string, stock: number | null): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { stock },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async assignTags(
    productId: string,
    tagIds: string[],
  ): Promise<ProductEntity> {
    await this.prisma.productTag.createMany({
      data: tagIds.map((tagId) => ({ productId, tagId })),
      skipDuplicates: true,
    });
    return (await this.findById(productId))!;
  }

  async removeTag(productId: string, tagId: string): Promise<void> {
    await this.prisma.productTag.delete({
      where: { productId_tagId: { productId, tagId } },
    });
  }
}
