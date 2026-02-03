import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { StandsController } from "./controllers/stands.controller";
import { STAND_REPOSITORY } from "../../core/domain/repositories/stand.repository.interface";
import { StandRepository } from "../../core/infrastructure/repositories/stand.repository";
import { USER_REPOSITORY } from "../../core/domain/repositories/user.repository.interface";
import { UserRepository } from "../../core/infrastructure/repositories/user.repository";
import { CreateStandUseCase } from "../../core/application/use-cases/stands/create-stand.use-case";
import { GetStandUseCase } from "../../core/application/use-cases/stands/get-stand.use-case";
import { GetStandsUseCase } from "../../core/application/use-cases/stands/get-stands.use-case";
import { UpdateStandUseCase } from "../../core/application/use-cases/stands/update-stand.use-case";
import { AddOperatorUseCase } from "../../core/application/use-cases/stands/add-operator.use-case";
import { RemoveOperatorUseCase } from "../../core/application/use-cases/stands/remove-operator.use-case";

@Module({
  imports: [AuthModule],
  controllers: [StandsController],
  providers: [
    { provide: STAND_REPOSITORY, useClass: StandRepository },
    { provide: USER_REPOSITORY, useClass: UserRepository },
    CreateStandUseCase,
    GetStandUseCase,
    GetStandsUseCase,
    UpdateStandUseCase,
    AddOperatorUseCase,
    RemoveOperatorUseCase,
  ],
})
export class StandsModule {}
