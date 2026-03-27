import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import type { IStandProductRepository } from "../../../domain/repositories/stand-product.repository.interface";
import { STAND_PRODUCT_REPOSITORY } from "../../../domain/repositories/stand-product.repository.interface";
import {
  StandCatalogResponseDto,
  StandCatalogItemDto,
} from "../../dto/stands/stand-catalog.dto";
import { ProductEntity } from "../../../domain/entities/product.entity";

@Injectable()
export class GetStandCatalogUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
    @Inject(STAND_PRODUCT_REPOSITORY)
    private readonly standProductRepository: IStandProductRepository,
  ) {}

  async execute(
    standId: string,
    activeOnly = true,
    lang: "es" | "en" = "es",
  ): Promise<StandCatalogResponseDto> {
    const stand = await this.standRepository.findById(standId);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${standId} not found`);
    }

    const products = await this.standProductRepository.findByStand(
      standId,
      activeOnly,
    );

    const dto = new StandCatalogResponseDto();
    dto.standId = stand.id;
    dto.standName = stand.name;
    dto.items = products.map((product) => this.toItemDto(product, lang));

    return dto;
  }

  private toItemDto(
    product: ProductEntity,
    lang: "es" | "en",
  ): StandCatalogItemDto {
    const item = new StandCatalogItemDto();
    item.productId = product.id;
    item.nameEs = product.nameEs;
    item.nameEn = product.nameEn;
    item.name =
      lang === "en" ? product.nameEn?.trim() || product.nameEs : product.nameEs;
    item.description =
      lang === "en"
        ? product.descriptionEn?.trim() || product.descriptionEs
        : product.descriptionEs;
    item.basePrice = product.basePrice;
    item.image = product.image;
    item.isActive = product.isActive;
    return item;
  }
}
