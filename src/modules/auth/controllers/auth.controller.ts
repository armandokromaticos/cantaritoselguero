import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "../../../core/application/dto/auth/login.dto";
import { RefreshTokenDto } from "../../../core/application/dto/auth/refresh-token.dto";
import { AuthResponseDto } from "../../../core/application/dto/auth/auth-response.dto";
import { LoginUseCase } from "../../../core/application/use-cases/auth/login.use-case";
import { RefreshTokenUseCase } from "../../../core/application/use-cases/auth/refresh-token.use-case";
import { LogoutUseCase } from "../../../core/application/use-cases/auth/logout.use-case";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post("refresh")
  @ApiOperation({ summary: "Refrescar tokens" })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Cerrar sesión" })
  async logout(@Headers("authorization") auth: string): Promise<void> {
    const token = auth?.replace("Bearer ", "");
    await this.logoutUseCase.execute(token);
  }
}
