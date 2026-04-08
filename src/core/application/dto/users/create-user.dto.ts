import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "123456", minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: "Juan Pérez" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: "+52 555 123 4567" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: "2000-03-15",
    format: "date",
    description: "Fecha de nacimiento en formato ISO 8601 (YYYY-MM-DD)",
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "birthDate debe tener el formato YYYY-MM-DD",
  })
  birthDate?: string;
}
