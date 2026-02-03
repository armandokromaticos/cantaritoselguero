import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateStandDto {
  @ApiProperty({ example: "Stand Central" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: "Stand principal del evento" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "https://img.example.com/stand.jpg" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: "Zona A, Pasillo 3" })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
