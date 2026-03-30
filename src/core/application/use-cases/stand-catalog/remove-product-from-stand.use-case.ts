import { Inject, Injectable } from "@nestjs/common";
import type { IStandProductRepository } from "../../../domain/repositories/stand-product.repository.interface";
import { STAND_PRODUCT_REPOSITORY } from "../../../domain/repositories/stand-product.repository.interface";

@Injectable()
export class RemoveProductFromStandUseCase {
  constructor(
    @Inject(STAND_PRODUCT_REPOSITORY)
    private readonly standProductRepository: IStandProductRepository,
  ) {}

  async execute(standId: string, productId: string): Promise<void> {
    await this.standProductRepository.remove(standId, productId);
  }
}
