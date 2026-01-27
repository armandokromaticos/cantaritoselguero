import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "user@example.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "Juan Pérez" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: "+52 555 123 4567" })
  @IsOptional()
  @IsString()
  phone?: string;
}
