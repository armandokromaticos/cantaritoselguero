import { ApiProperty } from "@nestjs/swagger";

export class MoodGalleryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  title: string | null;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty({ nullable: true })
  imageMobileUrl: string | null;

  @ApiProperty()
  altEs: string;

  @ApiProperty()
  altEn: string;

  @ApiProperty({ nullable: true })
  section: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
