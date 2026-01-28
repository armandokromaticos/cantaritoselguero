import { Injectable, Logger } from "@nestjs/common";
import { SupabaseService } from "../../../infrastructure/supabase/supabase.service";

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async execute(accessToken: string): Promise<void> {
    this.logger.log("Intento de logout");
    const supabase = this.supabaseService.getAdmin();

    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      this.logger.warn(`Logout fallido: ${error.message}`);
    }

    this.logger.log("Logout completado");
  }
}
