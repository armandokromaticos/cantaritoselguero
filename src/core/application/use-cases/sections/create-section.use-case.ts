import { Inject, Injectable } from "@nestjs/common";
import type { ISectionRepository } from "../../../domain/repositories/section.repository.interface";
import { SECTION_REPOSITORY } from "../../../domain/repositories/section.repository.interface";
import { CreateSectionDto } from "../../dto/sections/create-section.dto";
import { SectionEntity } from "../../../domain/entities/section.entity";

@Injectable()
export class CreateSectionUseCase {
  constructor(
    @Inject(SECTION_REPOSITORY)
    private readonly sectionRepository: ISectionRepository,
  ) {}

  async execute(dto: CreateSectionDto): Promise<SectionEntity> {
    const entity = SectionEntity.fromCreateDto(dto);
    return this.sectionRepository.create(entity);
  }
}
