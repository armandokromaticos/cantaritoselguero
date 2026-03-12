import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { IBannerRepository } from "../../../domain/repositories/banner.repository.interface";
import { BANNER_REPOSITORY } from "../../../domain/repositories/banner.repository.interface";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";
import { BannerEntity } from "../../../domain/entities/banner.entity";

const BUCKET = "banner-images";

@Injectable()
export class DeleteBannerImageUseCase {
  private readonly logger = new Logger(DeleteBannerImageUseCase.name);

  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(
    bannerId: string,
    field: "imageUrl" | "imageMobileUrl",
  ): Promise<BannerEntity> {
    const existing = await this.bannerRepository.findById(bannerId);
    if (!existing) {
      throw new NotFoundException(`Banner with id ${bannerId} not found`);
    }

    const currentUrl =
      field === "imageUrl" ? existing.imageUrl : existing.imageMobileUrl;

    if (!currentUrl) {
      throw new BadRequestException(
        `Banner does not have a ${field} to delete`,
      );
    }

    try {
      const pathFromUrl = currentUrl.split("/").slice(-2).join("/");
      await this.supabaseService.deleteFile(BUCKET, pathFromUrl);
    } catch (error) {
      this.logger.warn(
        `Failed to delete ${field} from storage for banner ${bannerId}: ${error}`,
      );
    }

    return this.bannerRepository.update(bannerId, { [field]: null });
  }
}
