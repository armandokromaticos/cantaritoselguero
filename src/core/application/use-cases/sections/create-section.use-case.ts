import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
    try {
      return await this.sectionRepository.create(entity);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          `A section with slug "${dto.slug}" already exists`,
        );
      }
      throw error;
    }
  }
}
