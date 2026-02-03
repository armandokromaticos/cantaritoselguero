import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IStandRepository } from "../../domain/repositories/stand.repository.interface";
import { StandEntity } from "../../domain/entities/stand.entity";

@Injectable()
export class StandRepository implements IStandRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly STAND_INCLUDE = {
    operators: {
      include: { user: true },
    },
  };

  async create(entity: StandEntity): Promise<StandEntity> {
    const data = entity.toPrismaCreate();
    const stand = await this.prisma.stand.create({ data: data as never });
    return StandEntity.fromPrisma(stand);
  }

  async findById(id: string): Promise<StandEntity | null> {
    const stand = await this.prisma.stand.findUnique({
      where: { id },
      include: StandRepository.STAND_INCLUDE,
    });
    return stand ? StandEntity.fromPrisma(stand) : null;
  }

  async findAll(): Promise<StandEntity[]> {
    const stands = await this.prisma.stand.findMany({
      include: StandRepository.STAND_INCLUDE,
    });
    return stands.map((stand) => StandEntity.fromPrisma(stand));
  }

  async update(id: string, entity: Partial<StandEntity>): Promise<StandEntity> {
    const data: Record<string, unknown> = {};
    if (entity.name !== undefined) data.name = entity.name;
    if (entity.description !== undefined) data.description = entity.description;
    if (entity.image !== undefined) data.image = entity.image;
    if (entity.location !== undefined) data.location = entity.location;
    if (entity.isActive !== undefined) data.isActive = entity.isActive;

    const stand = await this.prisma.stand.update({
      where: { id },
      data: data as never,
      include: StandRepository.STAND_INCLUDE,
    });
    return StandEntity.fromPrisma(stand);
  }

  async addOperator(standId: string, userId: string): Promise<StandEntity> {
    await this.prisma.standOperator.create({
      data: { standId, userId },
    });
    return this.findById(standId) as Promise<StandEntity>;
  }

  async removeOperator(standId: string, userId: string): Promise<StandEntity> {
    await this.prisma.standOperator.delete({
      where: { standId_userId: { standId, userId } },
    });
    return this.findById(standId) as Promise<StandEntity>;
  }
}
