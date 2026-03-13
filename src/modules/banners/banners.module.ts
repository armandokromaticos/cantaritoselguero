import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { BannersController } from "./controllers/banners.controller";
import { BANNER_REPOSITORY } from "../../core/domain/repositories/banner.repository.interface";
import { BannerRepository } from "../../core/infrastructure/repositories/banner.repository";
import { CreateBannerUseCase } from "../../core/application/use-cases/banners/create-banner.use-case";
import { GetBannersUseCase } from "../../core/application/use-cases/banners/get-banners.use-case";
import { GetBannerUseCase } from "../../core/application/use-cases/banners/get-banner.use-case";
import { UpdateBannerUseCase } from "../../core/application/use-cases/banners/update-banner.use-case";
import { DeleteBannerUseCase } from "../../core/application/use-cases/banners/delete-banner.use-case";
import { UploadBannerImageUseCase } from "../../core/application/use-cases/banners/upload-banner-image.use-case";
import { DeleteBannerImageUseCase } from "../../core/application/use-cases/banners/delete-banner-image.use-case";

@Module({
  imports: [AuthModule],
  controllers: [BannersController],
  providers: [
    { provide: BANNER_REPOSITORY, useClass: BannerRepository },
    CreateBannerUseCase,
    GetBannersUseCase,
    GetBannerUseCase,
    UpdateBannerUseCase,
    DeleteBannerUseCase,
    UploadBannerImageUseCase,
    DeleteBannerImageUseCase,
  ],
})
export class BannersModule {}
