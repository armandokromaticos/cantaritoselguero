import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "../../../core/application/dto/auth/login.dto";
import { AuthResponseDto } from "../../../core/application/dto/auth/auth-response.dto";
import { LoginUseCase } from "../../../core/application/use-cases/auth/login.use-case";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }
}
