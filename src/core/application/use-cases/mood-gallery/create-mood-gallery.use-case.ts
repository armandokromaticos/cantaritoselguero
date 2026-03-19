import { Inject, Injectable } from "@nestjs/common";
import type { IMoodGalleryRepository } from "../../../domain/repositories/mood-gallery.repository.interface";
import { MOOD_GALLERY_REPOSITORY } from "../../../domain/repositories/mood-gallery.repository.interface";
import { CreateMoodGalleryDto } from "../../dto/mood-gallery/create-mood-gallery.dto";
import { MoodGalleryEntity } from "../../../domain/entities/mood-gallery.entity";

@Injectable()
export class CreateMoodGalleryUseCase {
  constructor(
    @Inject(MOOD_GALLERY_REPOSITORY)
    private readonly moodGalleryRepository: IMoodGalleryRepository,
  ) {}

  async execute(dto: CreateMoodGalleryDto): Promise<MoodGalleryEntity> {
    const entity = MoodGalleryEntity.fromCreateDto({
      title: dto.title,
      imageUrl: dto.imageUrl,
      imageMobileUrl: dto.imageMobileUrl,
      altEs: dto.altEs,
      altEn: dto.altEn,
      section: dto.section,
      order: dto.order,
      isActive: dto.isActive,
    });

    return await this.moodGalleryRepository.create(entity);
  }
}
