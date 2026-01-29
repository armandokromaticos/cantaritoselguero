import { Inject, Injectable } from "@nestjs/common";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import { CreateProductDto } from "../../dto/products/create-product.dto";
import { ProductEntity } from "../../../domain/entities/product.entity";

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<ProductEntity> {
    const entity = ProductEntity.fromCreateDto(dto);
    return this.productRepository.create(entity);
  }
}
