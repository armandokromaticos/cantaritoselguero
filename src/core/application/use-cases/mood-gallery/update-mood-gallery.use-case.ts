import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IMoodGalleryRepository } from "../../../domain/repositories/mood-gallery.repository.interface";
import { MOOD_GALLERY_REPOSITORY } from "../../../domain/repositories/mood-gallery.repository.interface";
import { UpdateMoodGalleryDto } from "../../dto/mood-gallery/update-mood-gallery.dto";
import {
  MoodGalleryEntity,
  UpdateMoodGalleryParams,
} from "../../../domain/entities/mood-gallery.entity";

@Injectable()
export class UpdateMoodGalleryUseCase {
  constructor(
    @Inject(MOOD_GALLERY_REPOSITORY)
    private readonly moodGalleryRepository: IMoodGalleryRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateMoodGalleryDto,
  ): Promise<MoodGalleryEntity> {
    const existing = await this.moodGalleryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`MoodGallery with id ${id} not found`);
    }

    const data: UpdateMoodGalleryParams = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.imageMobileUrl !== undefined)
      data.imageMobileUrl = dto.imageMobileUrl;
    if (dto.altEs !== undefined) data.altEs = dto.altEs;
    if (dto.altEn !== undefined) data.altEn = dto.altEn;
    if (dto.section !== undefined) data.section = dto.section;
    if (dto.order !== undefined) data.order = dto.order;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return await this.moodGalleryRepository.update(id, data);
  }
}
