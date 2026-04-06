import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";

@Injectable()
export class DeleteStandUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.standRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Stand with id ${id} not found`);
    }

    const ordersCount = await this.standRepository.countOrders(id);
    if (ordersCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el stand porque tiene ${ordersCount} orden(es) asociada(s)`,
      );
    }

    await this.standRepository.delete(id);
  }
}
