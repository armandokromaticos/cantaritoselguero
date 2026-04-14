import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Request } from "express";
import { SupabaseService } from "../../../core/infrastructure/supabase/supabase.service";
import type { IUserRepository } from "../../../core/domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../core/domain/repositories/user.repository.interface";

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return true;
    }

    const supabase = this.supabaseService.getAdmin();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return true;
    }

    const dbUser = await this.userRepository.findByAuthId(data.user.id);
    if (!dbUser || !dbUser.isActive) {
      return true;
    }

    request["user"] = {
      authId: data.user.id,
      email: data.user.email ?? "",
      id: dbUser.id,
      role: dbUser.role,
      isActive: dbUser.isActive,
    };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
