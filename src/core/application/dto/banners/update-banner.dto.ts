import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
} from "class-validator";

export class UpdateBannerDto {
  @ApiPropertyOptional({ example: "Banner principal" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: "https://cdn.cantaritos.com/banners/banner1.png",
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: "https://cdn.cantaritos.com/banners/banner1-mobile.png",
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageMobileUrl?: string;

  @ApiPropertyOptional({ example: "Descripcion del banner" })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ example: "/promociones/verano" })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiPropertyOptional({ example: "home-carousel" })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ example: "#E64927" })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({ example: "2026-03-01T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-03-31T23:59:59.000Z" })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
