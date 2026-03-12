import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IBannerRepository } from "../../../domain/repositories/banner.repository.interface";
import { BANNER_REPOSITORY } from "../../../domain/repositories/banner.repository.interface";
import { UpdateBannerDto } from "../../dto/banners/update-banner.dto";
import {
  BannerEntity,
  UpdateBannerParams,
} from "../../../domain/entities/banner.entity";

@Injectable()
export class UpdateBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async execute(id: string, dto: UpdateBannerDto): Promise<BannerEntity> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    const data: UpdateBannerParams = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.imageMobileUrl !== undefined)
      data.imageMobileUrl = dto.imageMobileUrl;
    if (dto.altText !== undefined) data.altText = dto.altText;
    if (dto.linkUrl !== undefined) data.linkUrl = dto.linkUrl;
    if (dto.section !== undefined) data.section = dto.section;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.backgroundColor !== undefined)
      data.backgroundColor = dto.backgroundColor;
    if (dto.startDate !== undefined)
      data.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const effectiveStartDate =
      data.startDate !== undefined ? data.startDate : banner.startDate;
    const effectiveEndDate =
      data.endDate !== undefined ? data.endDate : banner.endDate;

    if (
      effectiveStartDate &&
      effectiveEndDate &&
      effectiveStartDate >= effectiveEndDate
    ) {
      throw new BadRequestException("startDate must be before endDate");
    }

    return await this.bannerRepository.update(id, data);
  }
}
