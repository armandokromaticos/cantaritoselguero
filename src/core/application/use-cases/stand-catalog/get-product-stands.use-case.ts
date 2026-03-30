import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import type { IStandProductRepository } from "../../../domain/repositories/stand-product.repository.interface";
import { STAND_PRODUCT_REPOSITORY } from "../../../domain/repositories/stand-product.repository.interface";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class GetProductStandsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(STAND_PRODUCT_REPOSITORY)
    private readonly standProductRepository: IStandProductRepository,
  ) {}

  async execute(productId: string): Promise<StandEntity[]> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    return this.standProductRepository.findByProduct(productId);
  }
}
