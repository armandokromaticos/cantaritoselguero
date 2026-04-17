import { Module } from "@nestjs/common";
import { PrismaModule } from "../../core/infrastructure/database/prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { SECTION_REPOSITORY } from "../../core/domain/repositories/section.repository.interface";
import { SectionRepository } from "../../core/infrastructure/repositories/section.repository";
import { CreateSectionUseCase } from "../../core/application/use-cases/sections/create-section.use-case";
import { GetSectionsUseCase } from "../../core/application/use-cases/sections/get-sections.use-case";
import { GetSectionBySlugUseCase } from "../../core/application/use-cases/sections/get-section-by-slug.use-case";
import { GetSectionByIdUseCase } from "../../core/application/use-cases/sections/get-section-by-id.use-case";
import { UpdateSectionUseCase } from "../../core/application/use-cases/sections/update-section.use-case";
import { DeleteSectionUseCase } from "../../core/application/use-cases/sections/delete-section.use-case";
import { AddItemToSectionUseCase } from "../../core/application/use-cases/sections/add-item-to-section.use-case";
import { RemoveItemFromSectionUseCase } from "../../core/application/use-cases/sections/remove-item-from-section.use-case";
import { ReorderSectionItemsUseCase } from "../../core/application/use-cases/sections/reorder-section-items.use-case";
import { SectionsController } from "./controllers/sections.controller";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SectionsController],
  providers: [
    {
      provide: SECTION_REPOSITORY,
      useClass: SectionRepository,
    },
    CreateSectionUseCase,
    GetSectionsUseCase,
    GetSectionBySlugUseCase,
    GetSectionByIdUseCase,
    UpdateSectionUseCase,
    DeleteSectionUseCase,
    AddItemToSectionUseCase,
    RemoveItemFromSectionUseCase,
    ReorderSectionItemsUseCase,
  ],
  exports: [SECTION_REPOSITORY],
})
export class SectionsModule {}
