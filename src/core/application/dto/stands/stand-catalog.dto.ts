import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, Min } from "class-validator";

export class AddStandProductDto {
  @ApiPropertyOptional({
    description: "Orden de aparición en el catálogo",
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class StandCatalogItemDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  nameEs: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  nameEn: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  basePrice: number;

  @ApiPropertyOptional({ nullable: true, type: String })
  image: string | null;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;
}

export class StandCatalogResponseDto {
  @ApiProperty()
  standId: string;

  @ApiProperty()
  standName: string;

  @ApiProperty({ type: () => [StandCatalogItemDto] })
  items: StandCatalogItemDto[];
}
