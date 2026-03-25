import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { ISectionRepository } from "../../domain/repositories/section.repository.interface";
import { SectionEntity } from "../../domain/entities/section.entity";

@Injectable()
export class SectionRepository implements ISectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly SECTION_INCLUDE = {
    items: {
      include: {
        product: {
          include: {
            sizes: true,
            modifierGroups: { include: { modifiers: true } },
            tags: { include: { tag: true } },
          },
        },
        combo: {
          include: {
            items: {
              include: { product: true },
              orderBy: { sortOrder: "asc" as const },
            },
          },
        },
      },
      orderBy: { order: "asc" as const },
    },
  };

  async create(entity: SectionEntity): Promise<SectionEntity> {
    const data = entity.toPrismaCreate();
    const section = await this.prisma.section.create({
      data: data as never,
      include: SectionRepository.SECTION_INCLUDE,
    });
    return SectionEntity.fromPrisma(section);
  }

  async findById(id: string): Promise<SectionEntity | null> {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: SectionRepository.SECTION_INCLUDE,
    });
    return section ? SectionEntity.fromPrisma(section) : null;
  }

  async findBySlug(slug: string): Promise<SectionEntity | null> {
    const section = await this.prisma.section.findUnique({
      where: { slug },
      include: SectionRepository.SECTION_INCLUDE,
    });
    return section ? SectionEntity.fromPrisma(section) : null;
  }

  async findAll(activeOnly?: boolean): Promise<SectionEntity[]> {
    const where = activeOnly ? { isActive: true } : undefined;
    const include = activeOnly
      ? {
          items: {
            ...SectionRepository.SECTION_INCLUDE.items,
            where: {
              OR: [
                { product: { isActive: true } },
                { combo: { isActive: true } },
              ],
            },
          },
        }
      : SectionRepository.SECTION_INCLUDE;
    const sections = await this.prisma.section.findMany({
      where,
      include,
      orderBy: { order: "asc" },
    });
    return sections.map((section) => SectionEntity.fromPrisma(section));
  }

  async update(
    id: string,
    entity: Partial<SectionEntity>,
  ): Promise<SectionEntity> {
    const data: Record<string, unknown> = {};
    if (entity.nameEs !== undefined) data.nameEs = entity.nameEs;
    if (entity.nameEn !== undefined) data.nameEn = entity.nameEn;
    if (entity.slug !== undefined) data.slug = entity.slug;
    if (entity.order !== undefined) data.order = entity.order;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;
    const section = await this.prisma.section.update({
      where: { id },
      data: data as never,
      include: SectionRepository.SECTION_INCLUDE,
    });
    return SectionEntity.fromPrisma(section);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.section.delete({ where: { id } });
  }

  async addItem(
    sectionId: string,
    productId: string | null,
    comboId: string | null,
    order: number,
  ): Promise<SectionEntity> {
    await this.prisma.sectionItem.create({
      data: {
        sectionId,
        productId,
        comboId,
        order,
      },
    });
    return (await this.findById(sectionId))!;
  }

  async removeItem(sectionId: string, itemId: string): Promise<number> {
    const result = await this.prisma.sectionItem.deleteMany({
      where: { id: itemId, sectionId },
    });
    return result.count;
  }

  async reorderItems(
    sectionId: string,
    items: { itemId: string; order: number }[],
  ): Promise<SectionEntity> {
    const itemIds = items.map((entry) => entry.itemId);
    const foundItems = await this.prisma.sectionItem.findMany({
      where: { id: { in: itemIds }, sectionId },
      select: { id: true },
    });
    const foundIds = new Set(foundItems.map((found) => found.id));
    const invalid = itemIds.filter((id) => !foundIds.has(id));
    if (invalid.length > 0) {
      throw new Error(
        `Items [${invalid.join(", ")}] do not belong to section ${sectionId}`,
      );
    }
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.sectionItem.updateMany({
          where: { id: item.itemId, sectionId },
          data: { order: item.order },
        }),
      ),
    );
    return (await this.findById(sectionId))!;
  }
}
