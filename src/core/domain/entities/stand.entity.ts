import {
  Stand as PrismaStand,
  StandOperator as PrismaStandOperator,
  User as PrismaUser,
} from "@prisma/client";
import { CreateStandDto } from "../../application/dto/stands/create-stand.dto";
import { StandResponseDto } from "../../application/dto/stands/stand-response.dto";

type PrismaStandWithRelations = PrismaStand & {
  operators?: (PrismaStandOperator & {
    user: PrismaUser;
  })[];
};

interface StandOperatorInfo {
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
}

interface StandProps {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  location: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  operators?: StandOperatorInfo[];
}

export class StandEntity {
  private props: StandProps;

  constructor(props: StandProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string | null {
    return this.props.description;
  }
  get image(): string | null {
    return this.props.image;
  }
  get location(): string | null {
    return this.props.location;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  hasOperator(userId: string): boolean {
    return (
      this.props.operators?.some((operator) => operator.userId === userId) ??
      false
    );
  }

  static fromPrisma(prisma: PrismaStandWithRelations): StandEntity {
    const props: StandProps = {
      id: prisma.id,
      name: prisma.name,
      description: prisma.description,
      image: prisma.image,
      location: prisma.location,
      isActive: prisma.isActive,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    if (prisma.operators) {
      props.operators = prisma.operators.map((operator) => ({
        userId: operator.userId,
        userName: operator.user.name,
        userEmail: operator.user.email,
        createdAt: operator.createdAt,
      }));
    }

    return new StandEntity(props);
  }

  static fromCreateDto(dto: CreateStandDto): StandEntity {
    return new StandEntity({
      id: "",
      name: dto.name,
      description: dto.description ?? null,
      image: dto.image ?? null,
      location: dto.location ?? null,
      isActive: dto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    return {
      name: this.props.name,
      description: this.props.description,
      image: this.props.image,
      location: this.props.location,
      isActive: this.props.isActive,
    };
  }

  toResponseDto(): StandResponseDto {
    const dto = new StandResponseDto();
    dto.id = this.props.id;
    dto.name = this.props.name;
    dto.description = this.props.description;
    dto.image = this.props.image;
    dto.location = this.props.location;
    dto.isActive = this.props.isActive;
    dto.createdAt = this.props.createdAt;
    dto.updatedAt = this.props.updatedAt;

    if (this.props.operators) {
      dto.operators = this.props.operators.map((operator) => ({
        userId: operator.userId,
        userName: operator.userName,
        userEmail: operator.userEmail,
        createdAt: operator.createdAt,
      }));
    }

    return dto;
  }
}
