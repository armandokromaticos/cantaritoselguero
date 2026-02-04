import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";

export class UpdateComboDto {
  @ApiPropertyOptional({ example: "Combo Familiar" })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: "Incluye 4 cantaritos y 2 micheladas" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 150.0 })
  @ValidateIf((_, value) => value !== undefined)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: "https://img.example.com/combo.jpg" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  isActive?: boolean;
}
