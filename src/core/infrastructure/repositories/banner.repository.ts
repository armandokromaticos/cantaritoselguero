import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IBannerRepository } from "../../domain/repositories/banner.repository.interface";
import {
  BannerEntity,
  UpdateBannerParams,
} from "../../domain/entities/banner.entity";

@Injectable()
export class BannerRepository implements IBannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: BannerEntity): Promise<BannerEntity> {
    const data = entity.toPrismaCreate();
    const banner = await this.prisma.banner.create({ data });
    return BannerEntity.fromPrisma(banner);
  }

  async findById(id: string): Promise<BannerEntity | null> {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    return banner ? BannerEntity.fromPrisma(banner) : null;
  }

  async findAll(section?: string): Promise<BannerEntity[]> {
    const where = section ? { section } : {};
    const banners = await this.prisma.banner.findMany({
      where,
      orderBy: { order: "asc" },
    });
    return banners.map((banner) => BannerEntity.fromPrisma(banner));
  }

  async findAllActive(section?: string): Promise<BannerEntity[]> {
    const now = new Date();
    const banners = await this.prisma.banner.findMany({
      where: {
        isActive: true,
        ...(section ? { section } : {}),
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [
          {
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        ],
      },
      orderBy: { order: "asc" },
    });
    return banners.map((banner) => BannerEntity.fromPrisma(banner));
  }

  async update(id: string, data: UpdateBannerParams): Promise<BannerEntity> {
    const banner = await this.prisma.banner.update({
      where: { id },
      data,
    });
    return BannerEntity.fromPrisma(banner);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.banner.delete({ where: { id } });
  }
}
