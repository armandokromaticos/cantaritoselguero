import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ISectionRepository } from "../../../domain/repositories/section.repository.interface";
import { SECTION_REPOSITORY } from "../../../domain/repositories/section.repository.interface";
import { ReorderSectionItemsDto } from "../../dto/sections/reorder-section-items.dto";
import { SectionEntity } from "../../../domain/entities/section.entity";

@Injectable()
export class ReorderSectionItemsUseCase {
  constructor(
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(
    sectionId: string,
    dto: ReorderSectionItemsDto,
  ): Promise<SectionEntity> {
    const existing = await this.sectionRepository.findById(sectionId);
    if (!existing) {
      throw new NotFoundException(`Section with id ${sectionId} not found`);
    }
    return this.sectionRepository.reorderItems(sectionId, dto.items);
  }
}
