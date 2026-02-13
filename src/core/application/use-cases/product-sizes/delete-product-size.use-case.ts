import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IProductSizeRepository } from "../../../domain/repositories/product-size.repository.interface";
import { PRODUCT_SIZE_REPOSITORY } from "../../../domain/repositories/product-size.repository.interface";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";

@Injectable()
export class DeleteProductSizeUseCase {
  constructor(
    @Inject(PRODUCT_SIZE_REPOSITORY)
    private readonly productSizeRepository: IProductSizeRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.productSizeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product size with id "${id}" not found`);
    }

    await this.productSizeRepository.delete(id);
    await this.recalculateProductStock(existing.productId);
  }

  private async recalculateProductStock(productId: string): Promise<void> {
    const sizes = await this.productSizeRepository.findByProductId(productId);
    const activeSizesWithStock = sizes.filter(
      (size) => size.isActive && size.stock !== null,
    );
    if (activeSizesWithStock.length === 0) {
      await this.productRepository.updateStock(productId, null);
      return;
    }
    const totalStock = activeSizesWithStock.reduce(
      (sum, size) => sum + size.stock!,
      0,
    );
    await this.productRepository.updateStock(productId, totalStock);
  }
}
