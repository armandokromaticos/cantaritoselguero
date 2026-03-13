import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
} from "class-validator";

export class CreateBannerDto {
  @ApiPropertyOptional({ example: "Banner principal" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: "https://cdn.cantaritos.com/banners/banner1.png" })
  @IsString()
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({
    example: "https://cdn.cantaritos.com/banners/banner1-mobile.png",
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageMobileUrl?: string;

  @ApiProperty({ example: "Descripcion del banner" })
  @IsString()
  altText: string;

  @ApiPropertyOptional({ example: "/promociones/verano" })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiPropertyOptional({ example: "home-carousel", default: "home-carousel" })
  @IsOptional()
  @IsString()
  section?: string = "home-carousel";

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number = 0;

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

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
