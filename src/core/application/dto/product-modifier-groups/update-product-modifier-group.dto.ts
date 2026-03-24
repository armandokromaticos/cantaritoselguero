import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidateIf,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "minLessOrEqualMax", async: false })
class MinLessOrEqualMaxConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as UpdateProductModifierGroupDto;
    if (obj.minSelect === undefined || obj.maxSelect === undefined) return true;
    return obj.minSelect <= obj.maxSelect;
  }

  defaultMessage() {
    return "minSelect must be less than or equal to maxSelect";
  }
}

export class UpdateProductModifierGroupDto {
  @ApiPropertyOptional({ example: "Tipo de chile" })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  nameEs?: string;

  @ApiPropertyOptional({ example: "Type of chili" })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @ApiPropertyOptional({ example: "Selecciona el tipo de chile" })
  @IsOptional()
  @IsString()
  descriptionEs?: string;

  @ApiPropertyOptional({ example: "Select the type of chili" })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Validate(MinLessOrEqualMaxConstraint)
  minSelect?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxSelect?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
