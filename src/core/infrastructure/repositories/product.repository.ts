import { Injectable } from "@nestjs/common";
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

  async findById(id: string): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    return product ? ProductEntity.fromPrisma(product) : null;
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany();
    return products.map((product) => ProductEntity.fromPrisma(product));
  }

  async update(
    id: string,
    entity: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const data: Record<string, unknown> = {};
    if (entity.name !== undefined) data.name = entity.name;
    if (entity.description !== undefined) data.description = entity.description;
    if (entity.basePrice !== undefined) {
      const { Prisma } = await import("@prisma/client");
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
    });
    return ProductEntity.fromPrisma(product);
  }
}
