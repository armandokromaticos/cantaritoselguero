import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import { UpdateStandDto } from "../../dto/stands/update-stand.dto";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class UpdateStandUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(id: string, dto: UpdateStandDto): Promise<StandEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.standRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Stand with id ${id} not found`);
    }
    return this.standRepository.update(id, dto as Partial<StandEntity>);
  }
}
