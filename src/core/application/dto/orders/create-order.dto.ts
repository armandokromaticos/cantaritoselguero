import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsUUID,
  IsOptional,
  IsString,
  IsEmail,
  IsArray,
  ArrayMinSize,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
  @ApiPropertyOptional({ example: "uuid-of-stand" })
  @IsOptional()
  @IsUUID()
  standId?: string;

  @ApiPropertyOptional({
    example: "VERANO2026",
    description: "Codigo del cupon a aplicar",
  })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({
    example: "juan@example.com",
    description: "Email del invitado (obligatorio para checkout sin sesión)",
  })
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional({ example: "Juan Pérez" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  guestName?: string;

  @ApiPropertyOptional({ example: "+525555555555" })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  guestPhone?: string;

  @ApiProperty({ type: () => [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
