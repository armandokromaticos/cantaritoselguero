import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import type { IStandProductRepository } from "../../../domain/repositories/stand-product.repository.interface";
import {
  STAND_PRODUCT_REPOSITORY,
  StandProductEntry,
} from "../../../domain/repositories/stand-product.repository.interface";
import {
  StandCatalogResponseDto,
  StandCatalogItemDto,
} from "../../dto/stands/stand-catalog.dto";

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

    const entries = await this.standProductRepository.findByStand(
      standId,
      activeOnly,
    );

    const dto = new StandCatalogResponseDto();
    dto.standId = stand.id;
    dto.standName = stand.name;
    dto.items = entries.map((entry) => this.toItemDto(entry, lang));

    return dto;
  }

  private toItemDto(
    entry: StandProductEntry,
    lang: "es" | "en",
  ): StandCatalogItemDto {
    const { product } = entry;
    const item = new StandCatalogItemDto();
    item.productId = product.id;
    item.nameEs = product.nameEs;
    item.nameEn = product.nameEn;
    item.name =
      lang === "en"
        ? product.nameEn?.trim() || product.nameEs
        : product.nameEs?.trim() || product.nameEn || product.nameEs;
    item.description =
      lang === "en"
        ? product.descriptionEn?.trim() || product.descriptionEs
        : product.descriptionEs?.trim() || product.descriptionEn;
    item.basePrice = product.basePrice;
    item.image = product.image;
    item.isActive = entry.isActive;
    item.sortOrder = entry.sortOrder;
    return item;
  }
}
