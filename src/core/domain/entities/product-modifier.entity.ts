import {
  ProductModifier as PrismaProductModifier,
  Prisma,
} from "@prisma/client";
import { CreateProductModifierDto } from "../../application/dto/product-modifiers/create-product-modifier.dto";
import { ProductModifierResponseDto } from "../../application/dto/product-modifiers/product-modifier-response.dto";

interface ProductModifierProps {
  id: string;
  groupId: string;
  name: string;
  priceAdjustment: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export class ProductModifierEntity {
  private props: ProductModifierProps;

  constructor(props: ProductModifierProps, _fromDB = false) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get groupId(): string { return this.props.groupId; }
  get name(): string { return this.props.name; }
  get priceAdjustment(): number { return this.props.priceAdjustment; }
  get isDefault(): boolean { return this.props.isDefault; }
  get isActive(): boolean { return this.props.isActive; }
  get sortOrder(): number { return this.props.sortOrder; }

  static fromPrisma(prisma: PrismaProductModifier): ProductModifierEntity {
    return new ProductModifierEntity(
      {
        id: prisma.id,
        groupId: prisma.groupId,
        name: prisma.name,
        priceAdjustment: Number(prisma.priceAdjustment),
        isDefault: prisma.isDefault,
        isActive: prisma.isActive,
        sortOrder: prisma.sortOrder,
      },
      true,
    );
  }

  static fromCreateDto(groupId: string, dto: CreateProductModifierDto): ProductModifierEntity {
    return new ProductModifierEntity({
      id: "",
      groupId,
      name: dto.name,
      priceAdjustment: dto.priceAdjustment ?? 0,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.name = this.props.name;
    data.priceAdjustment = new Prisma.Decimal(this.props.priceAdjustment);
    data.isDefault = this.props.isDefault;
    data.isActive = this.props.isActive;
    data.sortOrder = this.props.sortOrder;
    data.group = { connect: { id: this.props.groupId } };
    return data;
  }

  toPrismaUpdate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (this.props.name !== undefined) data.name = this.props.name;
    if (this.props.priceAdjustment !== undefined)
      data.priceAdjustment = new Prisma.Decimal(this.props.priceAdjustment);
    if (this.props.isDefault !== undefined) data.isDefault = this.props.isDefault;
    if (this.props.isActive !== undefined) data.isActive = this.props.isActive;
    if (this.props.sortOrder !== undefined) data.sortOrder = this.props.sortOrder;
    if (this.props.groupId !== undefined) {
      data.group = { connect: { id: this.props.groupId } };
    }
    return data;
  }

  toResponseDto(): ProductModifierResponseDto {
    const dto = new ProductModifierResponseDto();
    dto.id = this.props.id;
    dto.groupId = this.props.groupId;
    dto.name = this.props.name;
    dto.priceAdjustment = this.props.priceAdjustment;
    dto.isDefault = this.props.isDefault;
    dto.isActive = this.props.isActive;
    dto.sortOrder = this.props.sortOrder;
    return dto;
  }
}
