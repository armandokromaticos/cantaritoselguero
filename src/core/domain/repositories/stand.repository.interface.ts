import { StandEntity } from "../entities/stand.entity";

export const STAND_REPOSITORY = Symbol("STAND_REPOSITORY");

export interface IStandRepository {
  create(entity: StandEntity): Promise<StandEntity>;
  findById(id: string): Promise<StandEntity | null>;
  findAll(): Promise<StandEntity[]>;
  update(id: string, entity: Partial<StandEntity>): Promise<StandEntity>;
  addOperator(standId: string, userId: string): Promise<StandEntity>;
  removeOperator(standId: string, userId: string): Promise<StandEntity>;
  findStandIdsByOperator(userId: string): Promise<string[]>;
}
