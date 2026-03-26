import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/infrastructure/database/prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { TAG_REPOSITORY } from "../../core/domain/repositories/tag.repository.interface";
import { TagRepository } from "../../core/infrastructure/repositories/tag.repository";
import { CreateTagUseCase } from "../../core/application/use-cases/tags/create-tag.use-case";
import { GetTagsUseCase } from "../../core/application/use-cases/tags/get-tags.use-case";
import { UpdateTagUseCase } from "../../core/application/use-cases/tags/update-tag.use-case";
import { DeleteTagUseCase } from "../../core/application/use-cases/tags/delete-tag.use-case";
import { TagsController } from "./controllers/tags.controller";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TagsController],
  providers: [
    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
    CreateTagUseCase,
    GetTagsUseCase,
    UpdateTagUseCase,
    DeleteTagUseCase,
  ],
  exports: [TAG_REPOSITORY],
})
export class TagsModule {}
