import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { IStandRepository } from "../../../domain/repositories/stand.repository.interface";
import { STAND_REPOSITORY } from "../../../domain/repositories/stand.repository.interface";
import type { IUserRepository } from "../../../domain/repositories/user.repository.interface";
import { USER_REPOSITORY } from "../../../domain/repositories/user.repository.interface";
import { Role } from "../../../domain/enums/role.enum";
import { StandEntity } from "../../../domain/entities/stand.entity";

@Injectable()
export class AddOperatorUseCase {
  constructor(
    @Inject(STAND_REPOSITORY)
    private readonly standRepository: IStandRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(standId: string, userId: string): Promise<StandEntity> {
    const stand = await this.standRepository.findById(standId);
    if (!stand) {
      throw new NotFoundException(`Stand with id ${standId} not found`);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (String(user.role) !== String(Role.STAND_OPERATOR)) {
      throw new BadRequestException(
        `User must have role STAND_OPERATOR to be assigned as operator`,
      );
    }

    return this.standRepository.addOperator(standId, userId);
  }
}
