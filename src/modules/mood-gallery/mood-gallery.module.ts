import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MoodGalleryController } from "./controllers/mood-gallery.controller";
import { MOOD_GALLERY_REPOSITORY } from "../../core/domain/repositories/mood-gallery.repository.interface";
import { MoodGalleryRepository } from "../../core/infrastructure/repositories/mood-gallery.repository";
import { CreateMoodGalleryUseCase } from "../../core/application/use-cases/mood-gallery/create-mood-gallery.use-case";
import { GetMoodGalleriesUseCase } from "../../core/application/use-cases/mood-gallery/get-mood-galleries.use-case";
import { GetMoodGalleryUseCase } from "../../core/application/use-cases/mood-gallery/get-mood-gallery.use-case";
import { UpdateMoodGalleryUseCase } from "../../core/application/use-cases/mood-gallery/update-mood-gallery.use-case";
import { DeleteMoodGalleryUseCase } from "../../core/application/use-cases/mood-gallery/delete-mood-gallery.use-case";
import { UploadMoodGalleryImageUseCase } from "../../core/application/use-cases/mood-gallery/upload-mood-gallery-image.use-case";
import { DeleteMoodGalleryImageUseCase } from "../../core/application/use-cases/mood-gallery/delete-mood-gallery-image.use-case";

@Module({
  imports: [AuthModule],
  controllers: [MoodGalleryController],
  providers: [
    { provide: MOOD_GALLERY_REPOSITORY, useClass: MoodGalleryRepository },
    CreateMoodGalleryUseCase,
    GetMoodGalleriesUseCase,
    GetMoodGalleryUseCase,
    UpdateMoodGalleryUseCase,
    DeleteMoodGalleryUseCase,
    UploadMoodGalleryImageUseCase,
    DeleteMoodGalleryImageUseCase,
  ],
})
export class MoodGalleryModule {}
