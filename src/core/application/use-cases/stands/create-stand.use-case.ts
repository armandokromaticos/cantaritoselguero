import { Inject, Injectable } from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { CreateStandDto } from "../../dto/stands/create-stand.dto";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class CreateStandUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(dto: CreateStandDto): Promise<StandEntity> {
    const entity = StandEntity.fromCreateDto(dto);
    return this.standRepository.create(entity);
  }
}
