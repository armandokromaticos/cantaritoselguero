import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "minLessOrEqualMax", async: false })
class MinLessOrEqualMaxConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const obj = args.object as CreateProductModifierGroupDto;
    const min = obj.minSelect ?? 0;
    const max = obj.maxSelect ?? 1;
    return min <= max;
  }

  defaultMessage() {
    return "minSelect must be less than or equal to maxSelect";
  }
}

export class CreateProductModifierGroupDto {
  @ApiProperty({ example: "Tipo de chile" })
  @IsString()
  @IsNotEmpty()
  nameEs: string;

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
