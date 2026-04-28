import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateAgencyCardDto {
  @ApiPropertyOptional({ example: "Agencia CDMX" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: "Tequila, Jalisco" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ example: "Hotel" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lodgingType?: string;

  @ApiPropertyOptional({ example: "7km - 10 min", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  distance?: string | null;

  @ApiPropertyOptional({ example: "correo@agencia.mx", nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string | null;

  @ApiPropertyOptional({ example: "331-0000-000", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string | null;

  @ApiPropertyOptional({ example: "@Agencia De Tours", nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  socialHandle?: string | null;

  @ApiPropertyOptional({
    example: "https://facebook.com/agenciaCDMX",
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  facebookUrl?: string | null;

  @ApiPropertyOptional({
    example: "https://instagram.com/agenciaCDMX",
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  instagramUrl?: string | null;

  @ApiPropertyOptional({
    example: "https://tiktok.com/@agenciaCDMX",
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  tiktokUrl?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
