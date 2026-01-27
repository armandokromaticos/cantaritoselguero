import { User as PrismaUser } from "@prisma/client";
import { UserEntity } from "../entities/user.entity";
import { UserResponseDto } from "../../application/dto/users/user-response.dto";
import { Role } from "../enums/role.enum";

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    const entity = new UserEntity();
    entity.id = prismaUser.id;
    entity.authId = prismaUser.authId;
    entity.email = prismaUser.email;
    entity.name = prismaUser.name;
    entity.phone = prismaUser.phone;
    if (!Object.values(Role).includes(prismaUser.role as Role)) {
      throw new Error(`Invalid role value: ${prismaUser.role}`);
    }
    entity.role = prismaUser.role as Role;
    entity.standId = prismaUser.standId;
    entity.isActive = prismaUser.isActive;
    entity.createdAt = prismaUser.createdAt;
    entity.updatedAt = prismaUser.updatedAt;
    return entity;
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.authId = entity.authId;
    dto.email = entity.email;
    dto.name = entity.name;
    dto.phone = entity.phone;
    dto.role = entity.role;
    dto.standId = entity.standId;
    dto.isActive = entity.isActive;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
