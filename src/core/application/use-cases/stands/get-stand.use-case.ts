import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class GetStandUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(id: string): Promise<StandEntity> {
    const stand = await this.standRepository.findById(id);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${id} not found`);
    }
    return stand;
  }
}
