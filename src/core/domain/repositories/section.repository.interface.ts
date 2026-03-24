import { SectionEntity } from "../entities/section.entity";

export const SECTION_REPOSITORY = Symbol("SECTION_REPOSITORY");

export interface ISectionRepository {
  create(entity: SectionEntity): Promise<SectionEntity>;
  findById(id: string): Promise<SectionEntity | null>;
  findBySlug(slug: string): Promise<SectionEntity | null>;
  findAll(): Promise<SectionEntity[]>;
  update(id: string, entity: Partial<SectionEntity>): Promise<SectionEntity>;
  delete(id: string): Promise<void>;
  addItem(
    sectionId: string,
    productId: string | null,
    comboId: string | null,
    order: number,
  ): Promise<SectionEntity>;
  removeItem(sectionId: string, itemId: string): Promise<void>;
  reorderItems(
    sectionId: string,
    items: { itemId: string; order: number }[],
  ): Promise<SectionEntity>;
}
