import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

export class UpdateProductDto {
  @ApiPropertyOptional({ example: "Cantarito" })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  nameEs?: string;

  @ApiPropertyOptional({ example: "Cantarito Drink" })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ example: "Bebida tradicional" })
  @IsOptional()
  @IsString()
  descriptionEs?: string;

  @ApiPropertyOptional({ example: "Traditional drink" })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({ example: 45.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  @ApiPropertyOptional({ example: "https://img.example.com/cantarito.jpg" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 100, nullable: true, type: Number })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(0)
  stock?: number | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  standId?: string;
}
