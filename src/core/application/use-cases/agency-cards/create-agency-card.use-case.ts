import { Inject, Injectable } from "@nestjs/common";
import type { IAgencyCardRepository } from "../../../domain/repositories/agency-card.repository.interface";
import { AGENCY_CARD_REPOSITORY } from "../../../domain/repositories/agency-card.repository.interface";
import { CreateAgencyCardDto } from "../../dto/agency-cards/create-agency-card.dto";
import { AgencyCardEntity } from "../../../domain/entities/agency-card.entity";

@Injectable()
export class CreateAgencyCardUseCase {
  constructor(
    @Inject(AGENCY_CARD_REPOSITORY)
    private readonly repository: IAgencyCardRepository,
  ) {}

  async execute(dto: CreateAgencyCardDto): Promise<AgencyCardEntity> {
    const entity = AgencyCardEntity.fromCreateDto({
      title: dto.title,
      location: dto.location,
      lodgingType: dto.lodgingType,
      distance: dto.distance,
      email: dto.email,
      phone: dto.phone,
      socialHandle: dto.socialHandle,
      facebookUrl: dto.facebookUrl,
      instagramUrl: dto.instagramUrl,
      tiktokUrl: dto.tiktokUrl,
      order: dto.order ?? 0,
      isActive: dto.isActive ?? true,
    });

    return await this.repository.create(entity);
  }
}
