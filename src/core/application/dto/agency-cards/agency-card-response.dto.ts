import { ApiProperty } from "@nestjs/swagger";

export class AgencyCardResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  imageUrl: string | null;

  @ApiProperty()
  location: string;

  @ApiProperty()
  lodgingType: string;

  @ApiProperty({ nullable: true })
  distance: string | null;

  @ApiProperty({ nullable: true })
  email: string | null;

  @ApiProperty({ nullable: true })
  phone: string | null;

  @ApiProperty({ nullable: true })
  socialHandle: string | null;

  @ApiProperty({ nullable: true })
  facebookUrl: string | null;

  @ApiProperty({ nullable: true })
  instagramUrl: string | null;

  @ApiProperty({ nullable: true })
  tiktokUrl: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
