import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "productOrCombo", async: false })
class ProductOrComboConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as AddSectionItemDto;
    const hasProduct = obj.productId !== undefined && obj.productId !== null;
    const hasCombo = obj.comboId !== undefined && obj.comboId !== null;
    return (hasProduct && !hasCombo) || (!hasProduct && hasCombo);
  }

  defaultMessage() {
    return "Exactly one of productId or comboId must be provided";
  }
}

export class AddSectionItemDto {
  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440000" })
  @IsOptional()
  @IsUUID()
  @Validate(ProductOrComboConstraint)
  productId?: string;

  @ApiPropertyOptional({ example: "550e8400-e29b-41d4-a716-446655440001" })
  @IsOptional()
  @IsUUID()
  comboId?: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order: number;
}
