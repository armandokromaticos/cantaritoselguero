import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { IBannerRepository } from "../../../domain/repositories/banner.repository.interface";
import { BANNER_REPOSITORY } from "../../../domain/repositories/banner.repository.interface";
import { DeleteBannerImageUseCase } from "./delete-banner-image.use-case";

@Injectable()
export class DeleteBannerUseCase {
  private readonly logger = new Logger(DeleteBannerUseCase.name);

  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
    private readonly deleteBannerImageUseCase: DeleteBannerImageUseCase,
  ) {}

  async execute(id: string): Promise<void> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }

    if (banner.imageUrl) {
      try {
        await this.deleteBannerImageUseCase.execute(id, "imageUrl");
      } catch (error) {
        this.logger.warn(
          `Failed to delete imageUrl from storage for banner ${id}: ${error}`,
        );
      }
    }

    if (banner.imageMobileUrl) {
      try {
        await this.deleteBannerImageUseCase.execute(id, "imageMobileUrl");
      } catch (error) {
        this.logger.warn(
          `Failed to delete imageMobileUrl from storage for banner ${id}: ${error}`,
        );
      }
    }

    await this.bannerRepository.delete(id);
  }
}
