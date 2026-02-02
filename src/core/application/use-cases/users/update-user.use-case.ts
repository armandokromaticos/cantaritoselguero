import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { UpdateUserDto } from "../../dto/users/update-user.dto";
import { UserEntity } from "../../../domain/entities/user.entity";

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const user = await this.userRepository.update(id, dto);
    return UserEntity.fromPrisma(user);
  }
}
