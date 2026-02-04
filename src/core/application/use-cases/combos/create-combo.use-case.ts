import { Inject, Injectable } from "@nestjs/common";
import type { IComboRepository } from "../../../domain/repositories/combo.repository.interface";
import { COMBO_REPOSITORY } from "../../../domain/repositories/combo.repository.interface";
import { CreateComboDto } from "../../dto/combos/create-combo.dto";
import { ComboEntity } from "../../../domain/entities/combo.entity";

@Injectable()
export class CreateComboUseCase {
  constructor(
    @Inject(COMBO_REPOSITORY)
    private readonly comboRepository: IComboRepository,
  ) {}

  async execute(dto: CreateComboDto): Promise<ComboEntity> {
    const entity = ComboEntity.fromCreateDto(dto);
    return this.comboRepository.create(entity);
  }
}
