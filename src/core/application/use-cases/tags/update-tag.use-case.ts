import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { ITagRepository } from "../../../domain/repositories/tag.repository.interface";
import { TAG_REPOSITORY } from "../../../domain/repositories/tag.repository.interface";
import { UpdateTagDto } from "../../dto/tags/update-tag.dto";
import { TagEntity } from "../../../domain/entities/tag.entity";

@Injectable()
export class UpdateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(id: string, dto: UpdateTagDto): Promise<TagEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.tagRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }
    const updates: { nameEs?: string; nameEn?: string; isActive?: boolean } =
      {};
    if (dto.nameEs !== undefined) updates.nameEs = dto.nameEs;
    if (dto.nameEn !== undefined) updates.nameEn = dto.nameEn;
    if (dto.isActive !== undefined) updates.isActive = dto.isActive;
    return this.tagRepository.update(id, updates as Partial<TagEntity>);
  }
}
