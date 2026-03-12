import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IBannerRepository } from "../../../domain/repositories/banner.repository.interface";
import { BANNER_REPOSITORY } from "../../../domain/repositories/banner.repository.interface";

@Injectable()
export class DeleteBannerUseCase {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException(`Banner with id ${id} not found`);
    }
    await this.bannerRepository.delete(id);
  }
}
