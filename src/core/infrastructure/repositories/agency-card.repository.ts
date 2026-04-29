import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { IAgencyCardRepository } from "../../domain/repositories/agency-card.repository.interface";
import {
  AgencyCardEntity,
  UpdateAgencyCardParams,
} from "../../domain/entities/agency-card.entity";

@Injectable()
export class AgencyCardRepository implements IAgencyCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: AgencyCardEntity): Promise<AgencyCardEntity> {
    const data = entity.toPrismaCreate();
    const card = await this.prisma.agencyCard.create({ data });
    return AgencyCardEntity.fromPrisma(card);
  }

  async findById(id: string): Promise<AgencyCardEntity | null> {
    const card = await this.prisma.agencyCard.findUnique({ where: { id } });
    return card ? AgencyCardEntity.fromPrisma(card) : null;
  }

  async findAll(): Promise<AgencyCardEntity[]> {
    const cards = await this.prisma.agencyCard.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return cards.map((card) => AgencyCardEntity.fromPrisma(card));
  }

  async findAllActive(): Promise<AgencyCardEntity[]> {
    const cards = await this.prisma.agencyCard.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return cards.map((card) => AgencyCardEntity.fromPrisma(card));
  }

  async findAllInactive(): Promise<AgencyCardEntity[]> {
    const cards = await this.prisma.agencyCard.findMany({
      where: { isActive: false },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return cards.map((card) => AgencyCardEntity.fromPrisma(card));
  }

  async update(
    id: string,
    data: UpdateAgencyCardParams,
  ): Promise<AgencyCardEntity> {
    const card = await this.prisma.agencyCard.update({
      where: { id },
      data,
    });
    return AgencyCardEntity.fromPrisma(card);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agencyCard.delete({ where: { id } });
  }
}
