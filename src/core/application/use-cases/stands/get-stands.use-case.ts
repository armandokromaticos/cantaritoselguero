import { Inject, Injectable } from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class GetStandsUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(): Promise<StandEntity[]> {
    return this.standRepository.findAll();
  }
}
