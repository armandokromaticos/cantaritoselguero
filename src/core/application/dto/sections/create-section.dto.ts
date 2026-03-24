import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from "class-validator";

export class CreateSectionDto {
  @ApiProperty({ example: "Bebidas Alcohólicas" })
  @IsString()
  @IsNotEmpty()
  nameEs: string;

  @ApiPropertyOptional({ example: "Alcoholic Drinks" })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiProperty({ example: "bebidas-alcoholicas" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "slug must be lowercase alphanumeric with hyphens (e.g. bebidas-alcoholicas)",
  })
  slug: string;

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
