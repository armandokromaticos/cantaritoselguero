import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Role } from "../../../core/domain/enums/role.enum";

export interface OptionalUserCtx {
  id: string;
  role: Role;
}

export const OptionalUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): OptionalUserCtx | null => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request["user"] as { id?: string; role?: Role } | undefined;
    if (!user?.id || !user?.role) return null;
    return { id: user.id, role: user.role };
  },
);
