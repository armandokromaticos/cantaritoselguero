import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";

const STAND_HAS_REFERENCES_MESSAGE =
  "No se puede eliminar el stand porque tiene órdenes, items o entregas asociadas";

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

    const referencesCount =
      await this.standRepository.countRelatedReferences(id);
    if (referencesCount > 0) {
      throw new ConflictException(
        `${STAND_HAS_REFERENCES_MESSAGE} (${referencesCount} referencia(s))`,
      );
    }

    try {
      await this.standRepository.delete(id);
    } catch (error) {
      // Defensa contra TOCTOU: si entre el chequeo y el delete se creó
      // una orden/item/entrega, Prisma lanza P2003 (FK constraint).
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new ConflictException(STAND_HAS_REFERENCES_MESSAGE);
      }
      throw error;
    }
  }
}
