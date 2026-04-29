import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

export class CreateAgencyCardDto {
  @ApiProperty({ example: "Agencia CDMX" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: "Tequila, Jalisco" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  location: string;

  @ApiProperty({ example: "Hotel" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lodgingType: string;

  @ApiPropertyOptional({ example: "7km - 10 min" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  distance?: string;

  @ApiPropertyOptional({ example: "correo@agencia.mx" })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: "331-0000-000" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: "@Agencia De Tours" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  socialHandle?: string;

  @ApiPropertyOptional({ example: "https://facebook.com/agenciaCDMX" })
  @IsOptional()
  @IsUrl()
  facebookUrl?: string;

  @ApiPropertyOptional({ example: "https://instagram.com/agenciaCDMX" })
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional({ example: "https://tiktok.com/@agenciaCDMX" })
  @IsOptional()
  @IsUrl()
  tiktokUrl?: string;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number = 0;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
