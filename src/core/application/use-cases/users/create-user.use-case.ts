import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { CreateUserDto } from "../../dto/users/create-user.dto";
import { UserEntity } from "../../../domain/entities/user.entity";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    this.logger.log(`Registrando usuario en Supabase Auth: ${dto.email}`);
    const supabase = this.supabaseService.getAdmin();

    const { data, error } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      email_confirm: true,
      user_metadata: {
        name: dto.name,
      },
    });

    if (error) {
      this.logger.warn(
        `Error en Supabase Auth para ${dto.email}: ${error.message}`,
      );
      throw new BadRequestException(error.message);
    }

    const authId = data.user.id;
    this.logger.log(`Usuario creado en Auth: ${authId}`);

    try {
      const user = await this.userRepository.create({
        authId,
        email: dto.email,
        name: dto.name,
        phone: dto.phone ?? null,
      });

      this.logger.log(
        `Usuario sincronizado en DB con rol ${user.role}: ${authId}`,
      );
      return UserEntity.fromPrisma(user);
    } catch {
      this.logger.error(
        `Error al sincronizar en DB, revirtiendo Auth: ${authId}`,
      );
      await supabase.auth.admin.deleteUser(authId);
      throw new InternalServerErrorException(
        "Error al crear el usuario en la base de datos. Se revirtió el registro en Auth.",
      );
    }
  }
}
