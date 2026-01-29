import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.productSizeRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Product size with id "${id}" not found`);
    }
    return this.productSizeRepository.update(
      id,
      dto as Partial<ProductSizeEntity>,
    );
  }
}
