import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IProductSizeRepository } from "../../../domain/repositories/product-size.repository.interface";
import { PRODUCT_SIZE_REPOSITORY } from "../../../domain/repositories/product-size.repository.interface";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import { UpdateProductSizeDto } from "../../dto/product-sizes/update-product-size.dto";
import { ProductSizeEntity } from "../../../domain/entities/product-size.entity";

@Injectable()
export class UpdateProductSizeUseCase {
  constructor(
    @Inject(PRODUCT_SIZE_REPOSITORY)
    private readonly productSizeRepository: IProductSizeRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateProductSizeDto,
  ): Promise<ProductSizeEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.productSizeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product size with id "${id}" not found`);
    }
    const updated = await this.productSizeRepository.update(
      id,
      dto as Partial<ProductSizeEntity>,
    );

    if (dto.stock !== undefined || dto.isActive !== undefined) {
      await this.recalculateProductStock(existing.productId);
    }

    return updated;
  }

  private async recalculateProductStock(productId: string): Promise<void> {
    const sizes = await this.productSizeRepository.findByProductId(productId);
    const activeSizesWithStock = sizes.filter(
      (size) => size.isActive && size.stock !== null,
    );
    if (activeSizesWithStock.length > 0) {
      const totalStock = activeSizesWithStock.reduce(
        (sum, size) => sum + size.stock!,
        0,
      );
      await this.productRepository.updateStock(productId, totalStock);
    }
  }
}
