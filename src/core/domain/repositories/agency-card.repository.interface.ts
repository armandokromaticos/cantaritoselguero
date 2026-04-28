import {
  AgencyCardEntity,
  UpdateAgencyCardParams,
} from "../entities/agency-card.entity";

export const AGENCY_CARD_REPOSITORY = Symbol("AGENCY_CARD_REPOSITORY");

export interface IAgencyCardRepository {
  create(entity: AgencyCardEntity): Promise<AgencyCardEntity>;
  findById(id: string): Promise<AgencyCardEntity | null>;
  findAll(): Promise<AgencyCardEntity[]>;
  findAllActive(): Promise<AgencyCardEntity[]>;
  update(id: string, data: UpdateAgencyCardParams): Promise<AgencyCardEntity>;
  delete(id: string): Promise<void>;
}
