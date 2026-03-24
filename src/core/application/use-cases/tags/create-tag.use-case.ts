import { Inject, Injectable } from "@nestjs/common";
import type { ITagRepository } from "../../../domain/repositories/tag.repository.interface";
import { TAG_REPOSITORY } from "../../../domain/repositories/tag.repository.interface";
import { CreateTagDto } from "../../dto/tags/create-tag.dto";
import { TagEntity } from "../../../domain/entities/tag.entity";

@Injectable()
export class CreateTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async execute(dto: CreateTagDto): Promise<TagEntity> {
    const entity = TagEntity.fromCreateDto(dto);
    return this.tagRepository.create(entity);
  }
}
