import {
  ProductModifier as PrismaProductModifier,
  Prisma,
} from "@prisma/client";
import { CreateProductModifierDto } from "../../application/dto/product-modifiers/create-product-modifier.dto";
import { ProductModifierResponseDto } from "../../application/dto/product-modifiers/product-modifier-response.dto";

interface ProductModifierProps {
  id: string;
  groupId: string;
  nameEs: string;
  nameEn: string | null;
  priceAdjustment: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

export class ProductModifierEntity {
  private props: ProductModifierProps;

  constructor(props: ProductModifierProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }
  get groupId(): string {
    return this.props.groupId;
  }
  get nameEs(): string {
    return this.props.nameEs;
  }
  get nameEn(): string | null {
    return this.props.nameEn;
  }
  get priceAdjustment(): number {
    return this.props.priceAdjustment;
  }
  get isDefault(): boolean {
    return this.props.isDefault;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get sortOrder(): number {
    return this.props.sortOrder;
  }

  static fromPrisma(prisma: PrismaProductModifier): ProductModifierEntity {
    return new ProductModifierEntity({
      id: prisma.id,
      groupId: prisma.groupId,
      nameEs: prisma.nameEs,
      nameEn: prisma.nameEn,
      priceAdjustment: Number(prisma.priceAdjustment),
      isDefault: prisma.isDefault,
      isActive: prisma.isActive,
      sortOrder: prisma.sortOrder,
    });
  }

  static fromCreateDto(
    groupId: string,
    dto: CreateProductModifierDto,
  ): ProductModifierEntity {
    return new ProductModifierEntity({
      id: "",
      groupId,
      nameEs: dto.nameEs,
      nameEn: dto.nameEn ?? null,
      priceAdjustment: dto.priceAdjustment ?? 0,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.nameEs = this.props.nameEs;
    data.nameEn = this.props.nameEn;
    data.priceAdjustment = new Prisma.Decimal(this.props.priceAdjustment);
    data.isDefault = this.props.isDefault;
    data.isActive = this.props.isActive;
    data.sortOrder = this.props.sortOrder;
    data.group = { connect: { id: this.props.groupId } };
    return data;
  }

  toResponseDto(lang: string = "es"): ProductModifierResponseDto {
    const dto = new ProductModifierResponseDto();
    dto.id = this.props.id;
    dto.groupId = this.props.groupId;
    dto.name =
      lang === "en"
        ? (this.props.nameEn ?? this.props.nameEs)
        : this.props.nameEs;
    dto.priceAdjustment = this.props.priceAdjustment;
    dto.isDefault = this.props.isDefault;
    dto.isActive = this.props.isActive;
    dto.sortOrder = this.props.sortOrder;
    return dto;
  }
}
