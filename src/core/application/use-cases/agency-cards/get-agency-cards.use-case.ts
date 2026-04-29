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

  async execute(activeFilter?: boolean): Promise<AgencyCardEntity[]> {
    if (activeFilter === true) {
      return await this.repository.findAllActive();
    }
    if (activeFilter === false) {
      return await this.repository.findAllInactive();
    }
    return await this.repository.findAll();
  }
}
