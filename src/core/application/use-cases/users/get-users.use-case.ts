import { Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { UserMapper } from "../../../domain/mappers/user.mapper";
import { UserEntity } from "../../../domain/entities/user.entity";

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => UserMapper.toDomain(user));
  }
}
