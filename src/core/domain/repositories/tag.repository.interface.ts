import { TagEntity } from "../entities/tag.entity";

export const TAG_REPOSITORY = Symbol("TAG_REPOSITORY");

export interface ITagRepository {
  create(entity: TagEntity): Promise<TagEntity>;
  findById(id: string): Promise<TagEntity | null>;
  findAll(): Promise<TagEntity[]>;
  update(id: string, entity: Partial<TagEntity>): Promise<TagEntity>;
  delete(id: string): Promise<void>;
}
