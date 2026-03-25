import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { ISectionRepository } from "../../../domain/repositories/section.repository.interface";
import { SECTION_REPOSITORY } from "../../../domain/repositories/section.repository.interface";
import { UpdateSectionDto } from "../../dto/sections/update-section.dto";
import { SectionEntity } from "../../../domain/entities/section.entity";

@Injectable()
export class UpdateSectionUseCase {
  constructor(
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(id: string, dto: UpdateSectionDto): Promise<SectionEntity> {
    const hasUpdates = Object.values(dto).some((value) => value !== undefined);
    if (!hasUpdates) {
      throw new BadRequestException("No fields provided for update");
    }
    const existing = await this.sectionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Section with id ${id} not found`);
    }
    const updates: {
      nameEs?: string;
      nameEn?: string;
      slug?: string;
      order?: number;
      isActive?: boolean;
    } = {};
    if (dto.nameEs !== undefined) updates.nameEs = dto.nameEs;
    if (dto.nameEn !== undefined) updates.nameEn = dto.nameEn;
    if (dto.slug !== undefined) updates.slug = dto.slug.trim().toLowerCase();
    if (dto.order !== undefined) updates.order = dto.order;
    if (dto.isActive !== undefined) updates.isActive = dto.isActive;
    return this.sectionRepository.update(id, updates as Partial<SectionEntity>);
  }
}
