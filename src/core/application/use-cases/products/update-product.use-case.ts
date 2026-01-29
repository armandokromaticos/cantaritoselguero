import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import { UpdateProductDto } from "../../dto/products/update-product.dto";
import { ProductEntity } from "../../../domain/entities/product.entity";

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<ProductEntity> {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return this.productRepository.update(id, dto);
  }
}
