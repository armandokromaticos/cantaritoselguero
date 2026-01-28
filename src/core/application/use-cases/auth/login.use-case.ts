import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { LoginDto } from "../../dto/auth/login.dto";
import { AuthResponseDto } from "../../dto/auth/auth-response.dto";
import { UserMapper } from "../../../domain/mappers/user.mapper";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Intento de login: ${dto.email}`);
    const supabase = this.supabaseService.getAdmin();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      this.logger.warn(`Login fallido para ${dto.email}: ${error.message}`);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const user = await this.userRepository.findByAuthId(data.user.id);
    if (!user) {
      this.logger.warn(
        `Usuario autenticado pero no encontrado en DB: ${data.user.id}`,
      );
      throw new UnauthorizedException("Usuario no encontrado");
    }

    const entity = UserMapper.toDomain(user);
    const response = new AuthResponseDto();
    response.accessToken = data.session.access_token;
    response.refreshToken = data.session.refresh_token;
    response.user = UserMapper.toResponse(entity);

    this.logger.log(`Login exitoso: ${dto.email}`);
    return response;
  }
}
