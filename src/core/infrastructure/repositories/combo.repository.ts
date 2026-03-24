import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma/prisma.service";
import { IComboRepository } from "../../domain/repositories/combo.repository.interface";
import { ComboEntity } from "../../domain/entities/combo.entity";

@Injectable()
export class ComboRepository implements IComboRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly COMBO_INCLUDE = {
    items: {
      include: { product: true },
      orderBy: { sortOrder: "asc" as const },
    },
  };

  async create(entity: ComboEntity): Promise<ComboEntity> {
    const data = entity.toPrismaCreate();
    const combo = await this.prisma.combo.create({
      data: data as Prisma.ComboCreateInput,
      include: ComboRepository.COMBO_INCLUDE,
    });
    return ComboEntity.fromPrisma(combo);
  }

  async findById(id: string): Promise<ComboEntity | null> {
    const combo = await this.prisma.combo.findUnique({
      where: { id },
      include: ComboRepository.COMBO_INCLUDE,
    });
    return combo ? ComboEntity.fromPrisma(combo) : null;
  }

  async findAll(): Promise<ComboEntity[]> {
    const combos = await this.prisma.combo.findMany({
      include: ComboRepository.COMBO_INCLUDE,
    });
    return combos.map((combo) => ComboEntity.fromPrisma(combo));
  }

  async update(id: string, entity: Partial<ComboEntity>): Promise<ComboEntity> {
    const data: Record<string, unknown> = {};
    if (entity.nameEs !== undefined) data.nameEs = entity.nameEs;
    if (entity.nameEn !== undefined) data.nameEn = entity.nameEn;
    if (entity.descriptionEs !== undefined)
      data.descriptionEs = entity.descriptionEs;
    if (entity.descriptionEn !== undefined)
      data.descriptionEn = entity.descriptionEn;
    if (entity.price !== undefined)
      data.price = new Prisma.Decimal(entity.price);
    if (entity.image !== undefined) data.image = entity.image;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;

    const combo = await this.prisma.combo.update({
      where: { id },
      data: data as Prisma.ComboUpdateInput,
      include: ComboRepository.COMBO_INCLUDE,
    });
    return ComboEntity.fromPrisma(combo);
  }

  async addItem(
    comboId: string,
    productId: string,
    quantity: number,
    sortOrder: number = 0,
  ): Promise<ComboEntity> {
    await this.prisma.comboItem.create({
      data: { comboId, productId, quantity, sortOrder },
    });
    const combo = await this.findById(comboId);
    if (!combo) {
      throw new NotFoundException(
        `Combo with id ${comboId} not found after addItem`,
      );
    }
    return combo;
  }

  async removeItem(comboId: string, itemId: string): Promise<ComboEntity> {
    const result = await this.prisma.comboItem.deleteMany({
      where: { id: itemId, comboId },
    });
    if (result.count === 0) {
      throw new NotFoundException(
        `Item with id ${itemId} not found in combo ${comboId}`,
      );
    }
    const combo = await this.findById(comboId);
    if (!combo) {
      throw new NotFoundException(
        `Combo with id ${comboId} not found after removeItem`,
      );
    }
    return combo;
  }
}
