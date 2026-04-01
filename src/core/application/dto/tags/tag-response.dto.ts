import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TagResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  nameEs: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  nameEn: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
