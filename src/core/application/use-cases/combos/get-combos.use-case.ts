import { Inject, Injectable } from "@nestjs/common";
import type { IComboRepository } from "../../../domain/repositories/combo.repository.interface";
import { COMBO_REPOSITORY } from "../../../domain/repositories/combo.repository.interface";
import { ComboEntity } from "../../../domain/entities/combo.entity";

@Injectable()
export class GetCombosUseCase {
  constructor(
    @Inject(COMBO_REPOSITORY)
    private readonly comboRepository: IComboRepository,
  ) {}

  async execute(): Promise<ComboEntity[]> {
    return this.comboRepository.findAll();
  }
}
