import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { ITagRepository } from "../../domain/repositories/tag.repository.interface";
import { TagEntity } from "../../domain/entities/tag.entity";

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: TagEntity): Promise<TagEntity> {
    const data = entity.toPrismaCreate();
    const tag = await this.prisma.tag.create({ data: data as never });
    return TagEntity.fromPrisma(tag);
  }

  async findById(id: string): Promise<TagEntity | null> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    return tag ? TagEntity.fromPrisma(tag) : null;
  }

  async findAll(): Promise<TagEntity[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: { createdAt: "desc" },
    });
    return tags.map((tag) => TagEntity.fromPrisma(tag));
  }

  async update(id: string, entity: Partial<TagEntity>): Promise<TagEntity> {
    const data: Record<string, unknown> = {};
    if (entity.nameEs !== undefined) data.nameEs = entity.nameEs;
    if (entity.nameEn !== undefined) data.nameEn = entity.nameEn;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;
    const tag = await this.prisma.tag.update({
      where: { id },
      data: data as never,
    });
    return TagEntity.fromPrisma(tag);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({ where: { id } });
  }
}
