import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../../../domain/enums/role.enum";

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  authId: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  phone: string | null;

  @ApiPropertyOptional({ nullable: true, type: Date })
  birthDate: Date | null;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
