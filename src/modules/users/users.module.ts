import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "../../core/domain/repositories/user.repository.interface";
import { UserRepository } from "../../core/infrastructure/repositories/user.repository";
import { CreateUserUseCase } from "../../core/application/use-cases/users/create-user.use-case";
import { GetUserUseCase } from "../../core/application/use-cases/users/get-user.use-case";
import { GetUsersUseCase } from "../../core/application/use-cases/users/get-users.use-case";
import { UpdateUserUseCase } from "../../core/application/use-cases/users/update-user.use-case";
import { UsersController } from "./controllers/users.controller";

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    CreateUserUseCase,
    GetUserUseCase,
    GetUsersUseCase,
    UpdateUserUseCase,
  ],
})
export class UsersModule {}
