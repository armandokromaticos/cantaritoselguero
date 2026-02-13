import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import type { IProductSizeRepository } from "../../../domain/repositories/product-size.repository.interface";
import { PRODUCT_SIZE_REPOSITORY } from "../../../domain/repositories/product-size.repository.interface";
import { UpdateProductDto } from "../../dto/products/update-product.dto";
import { ProductEntity } from "../../../domain/entities/product.entity";

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(PRODUCT_SIZE_REPOSITORY)
    private readonly productSizeRepository: IProductSizeRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const sizes = await this.productSizeRepository.findByProductId(id);
    const activeSizesWithStock = sizes.filter(
      (size) => size.isActive && size.stock !== null,
    );

    // If the product has active sizes with stock, ignore manual stock
    // and recalculate from sizes instead
    if (activeSizesWithStock.length > 0) {
      delete dto.stock;
    }

    await this.productRepository.update(id, dto as Partial<ProductEntity>);

    if (activeSizesWithStock.length > 0) {
      const totalStock = activeSizesWithStock.reduce(
        (sum, size) => sum + size.stock!,
        0,
      );
      await this.productRepository.updateStock(id, totalStock);
    }

    return (await this.productRepository.findById(id))!;
  }
}
