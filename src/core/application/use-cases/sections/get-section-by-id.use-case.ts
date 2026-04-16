import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ISectionRepository } from "../../../domain/repositories/section.repository.interface";
import { SECTION_REPOSITORY } from "../../../domain/repositories/section.repository.interface";
import { SectionEntity } from "../../../domain/entities/section.entity";

@Injectable()
export class GetSectionByIdUseCase {
  constructor(
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(id: string): Promise<SectionEntity> {
    const section = await this.sectionRepository.findById(id);
    if (!section) {
      throw new NotFoundException(`Section with id "${id}" not found`);
    }
    return section;
  }
}
