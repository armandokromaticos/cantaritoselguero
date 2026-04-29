import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { AgencyCardsController } from "./controllers/agency-cards.controller";
import { AGENCY_CARD_REPOSITORY } from "../../core/domain/repositories/agency-card.repository.interface";
import { AgencyCardRepository } from "../../core/infrastructure/repositories/agency-card.repository";
import { CreateAgencyCardUseCase } from "../../core/application/use-cases/agency-cards/create-agency-card.use-case";
import { GetAgencyCardsUseCase } from "../../core/application/use-cases/agency-cards/get-agency-cards.use-case";
import { GetAgencyCardUseCase } from "../../core/application/use-cases/agency-cards/get-agency-card.use-case";
import { UpdateAgencyCardUseCase } from "../../core/application/use-cases/agency-cards/update-agency-card.use-case";
import { DeleteAgencyCardUseCase } from "../../core/application/use-cases/agency-cards/delete-agency-card.use-case";
import { UploadAgencyCardImageUseCase } from "../../core/application/use-cases/agency-cards/upload-agency-card-image.use-case";
import { DeleteAgencyCardImageUseCase } from "../../core/application/use-cases/agency-cards/delete-agency-card-image.use-case";

@Module({
  imports: [AuthModule],
  controllers: [AgencyCardsController],
  providers: [
    { provide: AGENCY_CARD_REPOSITORY, useClass: AgencyCardRepository },
    CreateAgencyCardUseCase,
    GetAgencyCardsUseCase,
    GetAgencyCardUseCase,
    UpdateAgencyCardUseCase,
    DeleteAgencyCardUseCase,
    UploadAgencyCardImageUseCase,
    DeleteAgencyCardImageUseCase,
  ],
})
export class AgencyCardsModule {}
