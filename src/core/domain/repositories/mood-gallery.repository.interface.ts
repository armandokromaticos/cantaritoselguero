import {
  MoodGalleryEntity,
  UpdateMoodGalleryParams,
} from "../entities/mood-gallery.entity";

export const MOOD_GALLERY_REPOSITORY = Symbol("MOOD_GALLERY_REPOSITORY");

export interface IMoodGalleryRepository {
  create(entity: MoodGalleryEntity): Promise<MoodGalleryEntity>;
  findById(id: string): Promise<MoodGalleryEntity | null>;
  findAll(section?: string): Promise<MoodGalleryEntity[]>;
  findAllActive(section?: string): Promise<MoodGalleryEntity[]>;
  update(id: string, data: UpdateMoodGalleryParams): Promise<MoodGalleryEntity>;
  delete(id: string): Promise<void>;
}
