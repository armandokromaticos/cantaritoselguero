import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ISectionRepository } from "../../../domain/repositories/section.repository.interface";
import { SECTION_REPOSITORY } from "../../../domain/repositories/section.repository.interface";
import { SectionEntity } from "../../../domain/entities/section.entity";

@Injectable()
export class GetSectionBySlugUseCase {
  constructor(
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(slug: string): Promise<SectionEntity> {
    const section = await this.sectionRepository.findBySlug(slug);
    if (!section) {
      throw new NotFoundException(`Section with slug "${slug}" not found`);
    }
    return section;
  }
}
