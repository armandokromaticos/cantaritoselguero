import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  ValidateIf,
} from "class-validator";

export class UpdateSectionDto {
  @ApiPropertyOptional({ example: "Bebidas Alcohólicas" })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  nameEs?: string;

  @ApiPropertyOptional({ example: "Alcoholic Drinks" })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ example: "bebidas-alcoholicas" })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "slug must be lowercase alphanumeric with hyphens",
  })
  slug?: string;

  @ApiPropertyOptional({ example: 1 })
  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: true })
  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  isActive?: boolean;
}
