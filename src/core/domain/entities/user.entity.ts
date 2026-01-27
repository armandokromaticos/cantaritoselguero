import { Role } from "../enums/role.enum";

export class UserEntity {
  id: string;
  authId: string | null;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  standId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
