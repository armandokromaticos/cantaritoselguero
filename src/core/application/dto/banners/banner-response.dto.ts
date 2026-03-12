import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BannerResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  title: string | null;

  @ApiProperty()
  imageUrl: string;

  @ApiPropertyOptional()
  imageMobileUrl: string | null;

  @ApiProperty()
  altText: string;

  @ApiPropertyOptional()
  linkUrl: string | null;

  @ApiProperty()
  section: string;

  @ApiProperty()
  order: number;

  @ApiPropertyOptional()
  backgroundColor: string | null;

  @ApiPropertyOptional()
  startDate: Date | null;

  @ApiPropertyOptional()
  endDate: Date | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
