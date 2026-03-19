import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUrl,
  Matches,
  Min,
} from "class-validator";

export class CreateMoodGalleryDto {
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

  @ApiProperty({ example: "Gente disfrutando en el cantarito" })
  @IsString()
  @Matches(/\S/, { message: "altEs cannot be blank" })
  altEs: string;

  @ApiProperty({ example: "People enjoying at cantarito" })
  @IsString()
  @Matches(/\S/, { message: "altEn cannot be blank" })
  altEn: string;

  @ApiPropertyOptional({ example: "mood-carousel", default: "mood-carousel" })
  @IsOptional()
  @IsString()
  section?: string = "mood-carousel";

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
