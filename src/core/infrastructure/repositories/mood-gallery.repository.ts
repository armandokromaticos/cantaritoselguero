import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IMoodGalleryRepository } from "../../domain/repositories/mood-gallery.repository.interface";
import {
  MoodGalleryEntity,
  UpdateMoodGalleryParams,
} from "../../domain/entities/mood-gallery.entity";

@Injectable()
export class MoodGalleryRepository implements IMoodGalleryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: MoodGalleryEntity): Promise<MoodGalleryEntity> {
    const data = entity.toPrismaCreate();
    const record = await this.prisma.moodGallery.create({ data });
    return MoodGalleryEntity.fromPrisma(record);
  }

  async findById(id: string): Promise<MoodGalleryEntity | null> {
    const record = await this.prisma.moodGallery.findUnique({ where: { id } });
    return record ? MoodGalleryEntity.fromPrisma(record) : null;
  }

  async findAll(section?: string): Promise<MoodGalleryEntity[]> {
    const where = section ? { section } : {};
    const records = await this.prisma.moodGallery.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return records.map((r) => MoodGalleryEntity.fromPrisma(r));
  }

  async findAllActive(section?: string): Promise<MoodGalleryEntity[]> {
    const records = await this.prisma.moodGallery.findMany({
      where: {
        isActive: true,
        ...(section ? { section } : {}),
      },
      orderBy: { order: "asc" },
    });
    return records.map((r) => MoodGalleryEntity.fromPrisma(r));
  }

  async update(
    id: string,
    data: UpdateMoodGalleryParams,
  ): Promise<MoodGalleryEntity> {
    const record = await this.prisma.moodGallery.update({
      where: { id },
      data,
    });
    return MoodGalleryEntity.fromPrisma(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.moodGallery.delete({ where: { id } });
  }
}
