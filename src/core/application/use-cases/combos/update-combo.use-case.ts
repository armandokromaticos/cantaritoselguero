import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IComboRepository } from "../../../domain/repositories/combo.repository.interface";
import { COMBO_REPOSITORY } from "../../../domain/repositories/combo.repository.interface";
import { UpdateComboDto } from "../../dto/combos/update-combo.dto";
import { ComboEntity } from "../../../domain/entities/combo.entity";

@Injectable()
export class UpdateComboUseCase {
  constructor(
    @Inject(COMBO_REPOSITORY)
    private readonly comboRepository: IComboRepository,
  ) {}

  async execute(id: string, dto: UpdateComboDto): Promise<ComboEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.comboRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Combo with id ${id} not found`);
    }
    return this.comboRepository.update(id, dto as Partial<ComboEntity>);
  }
}
