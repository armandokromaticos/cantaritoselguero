import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class RemoveOperatorUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(standId: string, userId: string): Promise<StandEntity> {
    const stand = await this.standRepository.findById(standId);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${standId} not found`);
    }

    return this.standRepository.removeOperator(standId, userId);
  }
}
