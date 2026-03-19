import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IMoodGalleryRepository } from "../../../domain/repositories/mood-gallery.repository.interface";
import { MOOD_GALLERY_REPOSITORY } from "../../../domain/repositories/mood-gallery.repository.interface";
import { DeleteMoodGalleryImageUseCase } from "./delete-mood-gallery-image.use-case";

@Injectable()
export class DeleteMoodGalleryUseCase {
  constructor(
    @Inject(MOOD_GALLERY_REPOSITORY)
    private readonly moodGalleryRepository: IMoodGalleryRepository,
    private readonly deleteMoodGalleryImageUseCase: DeleteMoodGalleryImageUseCase,
  ) {}

  async execute(id: string): Promise<void> {
    const item = await this.moodGalleryRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`MoodGallery with id ${id} not found`);
    }

    // Storage-only cleanup before deleting the DB row
    if (item.imageUrl) {
      await this.deleteMoodGalleryImageUseCase.deleteFromStorage(
        item.imageUrl,
        id,
      );
    }
    if (item.imageMobileUrl) {
      await this.deleteMoodGalleryImageUseCase.deleteFromStorage(
        item.imageMobileUrl,
        id,
      );
    }

    await this.moodGalleryRepository.delete(id);
  }
}
