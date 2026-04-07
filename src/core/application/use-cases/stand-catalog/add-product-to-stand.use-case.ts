import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import type { IProductRepository } from "../../../domain/repositories/product.repository.interface";
import { PRODUCT_REPOSITORY } from "../../../domain/repositories/product.repository.interface";
import type { IStandProductRepository } from "../../../domain/repositories/stand-product.repository.interface";
import { STAND_PRODUCT_REPOSITORY } from "../../../domain/repositories/stand-product.repository.interface";

@Injectable()
export class AddProductToStandUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(STAND_PRODUCT_REPOSITORY)
    private readonly standProductRepository: IStandProductRepository,
  ) {}

  async execute(
    standId: string,
    productId: string,
    sortOrder?: number,
  ): Promise<void> {
    const stand = await this.standRepository.findById(standId);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${standId} not found`);
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const exists = await this.standProductRepository.exists(standId, productId);
    if (exists) {
      throw new BadRequestException(
        `Product ${productId} is already in the catalog of stand ${standId}`,
      );
    }

    await this.standProductRepository.add(standId, productId, sortOrder);
  }
}
