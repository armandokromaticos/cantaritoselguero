import { Inject, Injectable } from "@nestjs/common";
import type { IAgencyCardRepository } from "../../../domain/repositories/agency-card.repository.interface";
import { AGENCY_CARD_REPOSITORY } from "../../../domain/repositories/agency-card.repository.interface";
import { AgencyCardEntity } from "../../../domain/entities/agency-card.entity";

@Injectable()
export class GetAgencyCardsUseCase {
  constructor(
    @Inject(AGENCY_CARD_REPOSITORY)
    private readonly repository: IAgencyCardRepository,
  ) {}

  async execute(activeOnly?: boolean): Promise<AgencyCardEntity[]> {
    if (activeOnly) {
      return await this.repository.findAllActive();
    }
    return await this.repository.findAll();
  }
}
