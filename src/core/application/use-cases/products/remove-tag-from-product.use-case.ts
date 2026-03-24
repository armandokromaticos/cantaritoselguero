import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import { ProductEntity } from "../../../domain/entities/product.entity";

@Injectable()
export class RemoveTagFromProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(productId: string, tagId: string): Promise<ProductEntity> {
    const existing = await this.productRepository.findById(productId);
    if (!existing) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }
    return this.productRepository.removeTag(productId, tagId);
  }
}
