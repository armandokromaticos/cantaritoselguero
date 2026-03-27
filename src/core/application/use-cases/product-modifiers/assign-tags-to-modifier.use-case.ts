import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";

@Injectable()
export class AssignTagsToModifierUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly modifierRepository: IProductModifierRepository,
  ) {}

  async execute(modifierId: string, tagIds: string[]): Promise<void> {
    const existing = await this.modifierRepository.findById(modifierId);
    if (!existing) {
      throw new NotFoundException(
        `Modifier with id ${modifierId} not found`,
      );
    }
    try {
      await this.modifierRepository.assignTags(modifierId, tagIds);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new BadRequestException("One or more tag IDs are invalid");
      }
      throw error;
    }
  }
}
