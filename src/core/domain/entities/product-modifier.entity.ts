import {
  ProductModifier as PrismaProductModifier,
  ModifierSizePrice as PrismaModifierSizePrice,
  Tag as PrismaTag,
  Prisma,
} from "@prisma/client";
import { CreateProductModifierDto } from "../../application/dto/product-modifiers/create-product-modifier.dto";
import {
  ProductModifierResponseDto,
  ModifierSizePriceResponseDto,
} from "../../application/dto/product-modifiers/product-modifier-response.dto";
import { TagEntity } from "./tag.entity";

type PrismaModifierWithRelations = PrismaProductModifier & {
  tags?: { tag: PrismaTag }[];
  sizePrices?: PrismaModifierSizePrice[];
};

interface SizePriceInfo {
  productSizeId: string;
  priceAdjustment: number;
}

interface ProductModifierProps {
  id: string;
  groupId: string;
  nameEs: string;
  nameEn: string | null;
  priceAdjustment: number;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
  tags?: TagEntity[];
  sizePrices?: SizePriceInfo[];
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

  static fromPrisma(
    prisma: PrismaModifierWithRelations,
  ): ProductModifierEntity {
    return new ProductModifierEntity({
      id: prisma.id,
      groupId: prisma.groupId,
      nameEs: prisma.nameEs,
      nameEn: prisma.nameEn,
      priceAdjustment: Number(prisma.priceAdjustment),
      isDefault: prisma.isDefault,
      isActive: prisma.isActive,
      sortOrder: prisma.sortOrder,
      tags: prisma.tags?.map((modifierTag) =>
        TagEntity.fromPrisma(modifierTag.tag),
      ),
      sizePrices: prisma.sizePrices?.map((sizePrice) => ({
        productSizeId: sizePrice.productSizeId,
        priceAdjustment: Number(sizePrice.priceAdjustment),
      })),
    });
  }

  static fromCreateDto(
    groupId: string,
    dto: CreateProductModifierDto,
  ): ProductModifierEntity {
    return new ProductModifierEntity({
      id: "",
      groupId,
      nameEs: dto.nameEs.trim(),
      nameEn: dto.nameEn?.trim() || null,
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

  toResponseDto(lang: "es" | "en" = "es"): ProductModifierResponseDto {
    const dto = new ProductModifierResponseDto();
    dto.id = this.props.id;
    dto.groupId = this.props.groupId;
    dto.name =
      lang === "en"
        ? this.props.nameEn?.trim() || this.props.nameEs
        : this.props.nameEs;
    dto.priceAdjustment = this.props.priceAdjustment;
    dto.isDefault = this.props.isDefault;
    dto.isActive = this.props.isActive;
    dto.sortOrder = this.props.sortOrder;
    if (this.props.tags) {
      dto.tags = this.props.tags.map((tag) => tag.toResponseDto(lang));
    }
    if (this.props.sizePrices) {
      dto.sizePrices = this.props.sizePrices.map((sizePrice) => {
        const spDto = new ModifierSizePriceResponseDto();
        spDto.productSizeId = sizePrice.productSizeId;
        spDto.priceAdjustment = sizePrice.priceAdjustment;
        return spDto;
      });
    }
    return dto;
  }
}
