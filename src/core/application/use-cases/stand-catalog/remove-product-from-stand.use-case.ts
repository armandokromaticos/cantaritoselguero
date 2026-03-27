import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IStandProductRepository } from "../../../domain/repositories/stand-product.repository.interface";
import { STAND_PRODUCT_REPOSITORY } from "../../../domain/repositories/stand-product.repository.interface";

@Injectable()
export class RemoveProductFromStandUseCase {
  constructor(
    @Inject(STAND_PRODUCT_REPOSITORY)
    private readonly standProductRepository: IStandProductRepository,
  ) {}

  async execute(standId: string, productId: string): Promise<void> {
    const exists = await this.standProductRepository.exists(standId, productId);
    if (!exists) {
      throw new NotFoundException(
        `Product ${productId} is not in the catalog of stand ${standId}`,
      );
    }

    await this.standProductRepository.remove(standId, productId);
  }
}
