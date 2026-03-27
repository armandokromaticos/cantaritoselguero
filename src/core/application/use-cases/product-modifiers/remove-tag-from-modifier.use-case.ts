import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { IProductModifierRepository } from "../../../domain/repositories/product-modifier.repository.interface";
import { PRODUCT_MODIFIER_REPOSITORY } from "../../../domain/repositories/product-modifier.repository.interface";

@Injectable()
export class RemoveTagFromModifierUseCase {
  constructor(
    @Inject(PRODUCT_MODIFIER_REPOSITORY)
    private readonly modifierRepository: IProductModifierRepository,
  ) {}

  async execute(modifierId: string, tagId: string): Promise<void> {
    const existing = await this.modifierRepository.findById(modifierId);
    if (!existing) {
      throw new NotFoundException(
        `Modifier with id ${modifierId} not found`,
      );
    }
    try {
      await this.modifierRepository.removeTag(modifierId, tagId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException(
          `Tag ${tagId} is not assigned to modifier ${modifierId}`,
        );
      }
      throw error;
    }
  }
}
