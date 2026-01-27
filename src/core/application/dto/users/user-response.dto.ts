import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../../../domain/enums/role.enum";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  authId: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  phone: string | null;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiPropertyOptional()
  standId: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
