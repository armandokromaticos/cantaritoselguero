import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "../../core/domain/repositories/user.repository.interface";
import { UserRepository } from "../../core/infrastructure/repositories/user.repository";
import { LoginUseCase } from "../../core/application/use-cases/auth/login.use-case";
import { AuthController } from "./controllers/auth.controller";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    LoginUseCase,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard, USER_REPOSITORY],
})
export class AuthModule {}
