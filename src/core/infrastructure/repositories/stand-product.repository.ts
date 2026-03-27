import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IStandProductRepository } from "../../domain/repositories/stand-product.repository.interface";
import { ProductEntity } from "../../domain/entities/product.entity";
import { StandEntity } from "../../domain/entities/stand.entity";

@Injectable()
export class StandProductRepository implements IStandProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly PRODUCT_INCLUDE = {
    sizes: true,
    modifierGroups: {
      include: { modifiers: true },
    },
    tags: {
      include: { tag: true },
    },
  };

  private static readonly STAND_INCLUDE = {
    operators: {
      include: { user: true },
    },
  };

  async add(
    standId: string,
    productId: string,
    sortOrder = 0,
  ): Promise<void> {
    await this.prisma.standProduct.create({
      data: { standId, productId, sortOrder },
    });
  }

  async remove(standId: string, productId: string): Promise<void> {
    await this.prisma.standProduct.delete({
      where: { standId_productId: { standId, productId } },
    });
  }

  async findByStand(
    standId: string,
    activeOnly = true,
  ): Promise<ProductEntity[]> {
    const where: Record<string, unknown> = { standId };
    if (activeOnly) {
      where.isActive = true;
    }

    const entries = await this.prisma.standProduct.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        product: {
          include: StandProductRepository.PRODUCT_INCLUDE,
        },
      },
    });

    return entries.map((entry) => ProductEntity.fromPrisma(entry.product));
  }

  async findByProduct(productId: string): Promise<StandEntity[]> {
    const entries = await this.prisma.standProduct.findMany({
      where: { productId, isActive: true },
      include: {
        stand: {
          include: StandProductRepository.STAND_INCLUDE,
        },
      },
    });

    return entries.map((entry) => StandEntity.fromPrisma(entry.stand));
  }

  async exists(standId: string, productId: string): Promise<boolean> {
    const entry = await this.prisma.standProduct.findUnique({
      where: { standId_productId: { standId, productId } },
    });
    return entry !== null;
  }

  async updateSortOrder(
    standId: string,
    productId: string,
    sortOrder: number,
  ): Promise<void> {
    await this.prisma.standProduct.update({
      where: { standId_productId: { standId, productId } },
      data: { sortOrder },
    });
  }

  async findStandIdsForProduct(productId: string): Promise<string[]> {
    const records = await this.prisma.standProduct.findMany({
      where: { productId, isActive: true },
      select: { standId: true },
    });
    return records.map((r) => r.standId);
  }
}
