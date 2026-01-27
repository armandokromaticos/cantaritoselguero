import { User, Prisma } from "@prisma/client";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByAuthId(authId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}
