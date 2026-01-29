import { Inject, Injectable } from "@nestjs/common";
import type { IProductSizeRepository } from "../../../domain/repositories/product-size.repository.interface";
import { PRODUCT_SIZE_REPOSITORY } from "../../../domain/repositories/product-size.repository.interface";
import { CreateProductSizeDto } from "../../dto/product-sizes/create-product-size.dto";
import { ProductSizeEntity } from "../../../domain/entities/product-size.entity";

@Injectable()
export class CreateProductSizeUseCase {
  constructor(
    @Inject(PRODUCT_SIZE_REPOSITORY)
    private readonly productSizeRepository: IProductSizeRepository,
  ) {}

  async execute(
    productId: string,
    dto: CreateProductSizeDto,
  ): Promise<ProductSizeEntity> {
    const entity = ProductSizeEntity.fromCreateDto(productId, dto);
    return this.productSizeRepository.create(entity);
  }
}
