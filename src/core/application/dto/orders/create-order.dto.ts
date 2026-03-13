import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
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

  @ApiProperty({ type: () => [CreateOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
