import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class UpdateProductModifierDto {
  @ApiPropertyOptional({ example: "Chile habanero" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nameEs?: string;

  @ApiPropertyOptional({ example: "Habanero chili" })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ example: 10.0 })
  @IsOptional()
  @IsNumber()
  priceAdjustment?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
