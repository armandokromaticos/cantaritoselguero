import { BannerEntity, UpdateBannerParams } from "../entities/banner.entity";

export const BANNER_REPOSITORY = Symbol("BANNER_REPOSITORY");

export interface IBannerRepository {
  create(entity: BannerEntity): Promise<BannerEntity>;
  findById(id: string): Promise<BannerEntity | null>;
  findAll(section?: string): Promise<BannerEntity[]>;
  findAllActive(section?: string): Promise<BannerEntity[]>;
  update(id: string, data: UpdateBannerParams): Promise<BannerEntity>;
  delete(id: string): Promise<void>;
}
