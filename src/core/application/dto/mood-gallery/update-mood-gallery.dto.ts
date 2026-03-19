import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  Min,
} from "class-validator";

export class UpdateMoodGalleryDto {
  @ApiPropertyOptional({ example: "Ambiente festivo" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: "https://cdn.cantaritos.com/mood/foto1.png",
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: "https://cdn.cantaritos.com/mood/foto1-mobile.png",
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageMobileUrl?: string;

  @ApiPropertyOptional({ example: "Gente disfrutando en el cantarito" })
  @IsOptional()
  @IsString()
  altEs?: string;

  @ApiPropertyOptional({ example: "People enjoying at cantarito" })
  @IsOptional()
  @IsString()
  altEn?: string;

  @ApiPropertyOptional({ example: "mood-carousel" })
  @IsOptional()
  @IsString()
  section?: string;

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
