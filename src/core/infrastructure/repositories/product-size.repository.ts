import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IProductSizeRepository } from "../../domain/repositories/product-size.repository.interface";
import { ProductSizeEntity } from "../../domain/entities/product-size.entity";

@Injectable()
export class ProductSizeRepository implements IProductSizeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ProductSizeEntity): Promise<ProductSizeEntity> {
    const data = entity.toPrismaCreate();
    const size = await this.prisma.productSize.create({ data: data as never });
    return ProductSizeEntity.fromPrisma(size);
  }

  async findByProductId(productId: string): Promise<ProductSizeEntity[]> {
    const sizes = await this.prisma.productSize.findMany({ where: { productId } });
    return sizes.map((size) => ProductSizeEntity.fromPrisma(size));
  }

  async update(
    id: string,
    entity: Partial<ProductSizeEntity>,
  ): Promise<ProductSizeEntity> {
    const data: Record<string, unknown> = {};
    if (entity.name !== undefined) data.name = entity.name;
    if (entity.price !== undefined) {
      const { Prisma } = await import("@prisma/client");
      data.price = new Prisma.Decimal(entity.price);
    }
    if (entity.sortOrder !== undefined) data.sortOrder = entity.sortOrder;
    if (entity.isDefault !== undefined) data.isDefault = entity.isDefault;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;
    if (entity.productId !== undefined) {
      data.product = { connect: { id: entity.productId } };
    }
    const size = await this.prisma.productSize.update({
      where: { id },
      data: data as never,
    });
    return ProductSizeEntity.fromPrisma(size);
  }
}
