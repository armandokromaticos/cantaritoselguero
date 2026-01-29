import { Inject, Injectable } from "@nestjs/common";
import type { IProductSizeRepository } from "../../../domain/repositories/product-size.repository.interface";
import { PRODUCT_SIZE_REPOSITORY } from "../../../domain/repositories/product-size.repository.interface";
import { UpdateProductSizeDto } from "../../dto/product-sizes/update-product-size.dto";
import { ProductSizeEntity } from "../../../domain/entities/product-size.entity";

@Injectable()
export class UpdateProductSizeUseCase {
  constructor(
    @Inject(PRODUCT_SIZE_REPOSITORY)
    private readonly productSizeRepository: IProductSizeRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateProductSizeDto,
  ): Promise<ProductSizeEntity> {
    return this.productSizeRepository.update(
      id,
      dto as Partial<ProductSizeEntity>,
    );
  }
}
