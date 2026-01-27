import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { CreateUserDto } from "../../dto/users/create-user.dto";
import { UserMapper } from "../../../domain/mappers/user.mapper";
import { UserEntity } from "../../../domain/entities/user.entity";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    const supabase = this.supabaseService.getAdmin();

    const { data, error } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        name: dto.name,
        phone: dto.phone,
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const authId = data.user.id;

    try {
      const user = await this.userRepository.create({
        authId,
        email: dto.email,
        name: dto.name,
        phone: dto.phone ?? null,
      });

      return UserMapper.toDomain(user);
    } catch (dbError) {
      await supabase.auth.admin.deleteUser(authId);
      throw new InternalServerErrorException(
        "Error al crear el usuario en la base de datos. Se revirtió el registro en Auth.",
      );
    }
  }
}
