import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(DeleteUserUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    const authId = existing.authId;

    await this.userRepository.delete(id);
    this.logger.log(`Usuario eliminado de DB: ${id}`);

    if (authId) {
      try {
        const supabase = this.supabaseService.getAdmin();
        const { error } = await supabase.auth.admin.deleteUser(authId);
        if (error) {
          this.logger.warn(
            `No se pudo eliminar de Supabase Auth (authId=${authId}): ${error.message}`,
          );
        } else {
          this.logger.log(`Usuario eliminado de Supabase Auth: ${authId}`);
        }
      } catch (err) {
        this.logger.warn(
          `Error inesperado al eliminar de Supabase Auth (authId=${authId}): ${err}`,
        );
      }
    }
  }
}
