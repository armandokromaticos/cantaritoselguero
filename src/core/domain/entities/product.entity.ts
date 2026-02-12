import {
  Product as PrismaProduct,
  ProductSize as PrismaProductSize,
  ProductModifierGroup as PrismaProductModifierGroup,
  ProductModifier as PrismaProductModifier,
  Prisma,
} from "@prisma/client";
import { CreateProductDto } from "../../application/dto/products/create-product.dto";
import { ProductResponseDto } from "../../application/dto/products/product-response.dto";
import { ProductSizeEntity } from "./product-size.entity";
import { ProductModifierGroupEntity } from "./product-modifier-group.entity";
import { ProductModifierEntity } from "./product-modifier.entity";

type PrismaProductWithRelations = PrismaProduct & {
  sizes?: PrismaProductSize[];
  modifierGroups?: (PrismaProductModifierGroup & {
    modifiers: PrismaProductModifier[];
  })[];
};

interface ProductProps {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  image: string | null;
  stock: number | null;
  isActive: boolean;
  standId: string | null;
  createdAt: Date;
  updatedAt: Date;
  sizes?: ProductSizeEntity[];
  modifierGroups?: {
    group: ProductModifierGroupEntity;
    modifiers: ProductModifierEntity[];
  }[];
}

export class ProductEntity {
  private props: ProductProps;

  constructor(props: ProductProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string | null {
    return this.props.description;
  }
  get basePrice(): number {
    return this.props.basePrice;
  }
  get image(): string | null {
    return this.props.image;
  }
  get stock(): number | null {
    return this.props.stock;
  }
  get computedStock(): number | null {
    if (this.props.sizes) {
      const activeSizesWithStock = this.props.sizes.filter(
        (size) => size.isActive && size.stock !== null,
      );
      if (activeSizesWithStock.length > 0) {
        return activeSizesWithStock.reduce((sum, size) => sum + size.stock!, 0);
      }
    }
    return this.props.stock;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get standId(): string | null {
    return this.props.standId;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static fromPrisma(prisma: PrismaProductWithRelations): ProductEntity {
    const props: ProductProps = {
      id: prisma.id,
      name: prisma.name,
      description: prisma.description,
      basePrice: Number(prisma.basePrice),
      image: prisma.image,
      stock: prisma.stock,
      isActive: prisma.isActive,
      standId: prisma.standId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    if (prisma.sizes) {
      props.sizes = prisma.sizes.map((size) =>
        ProductSizeEntity.fromPrisma(size),
      );
    }

    if (prisma.modifierGroups) {
      props.modifierGroups = prisma.modifierGroups.map((modifierGroup) => ({
        group: ProductModifierGroupEntity.fromPrisma(modifierGroup),
        modifiers: modifierGroup.modifiers.map((modifier) =>
          ProductModifierEntity.fromPrisma(modifier),
        ),
      }));
    }

    return new ProductEntity(props);
  }

  static fromCreateDto(dto: CreateProductDto): ProductEntity {
    return new ProductEntity({
      id: "",
      name: dto.name,
      description: dto.description ?? null,
      basePrice: dto.basePrice,
      image: dto.image ?? null,
      stock: dto.stock ?? null,
      isActive: dto.isActive ?? true,
      standId: dto.standId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.name = this.props.name;
    data.description = this.props.description;
    data.basePrice = new Prisma.Decimal(this.props.basePrice);
    data.image = this.props.image;
    data.stock = this.props.stock;
    data.isActive = this.props.isActive;
    if (this.props.standId) {
      data.stand = { connect: { id: this.props.standId } };
    }
    return data;
  }

  toResponseDto(): ProductResponseDto {
    const dto = new ProductResponseDto();
    dto.id = this.props.id;
    dto.name = this.props.name;
    dto.description = this.props.description;
    dto.basePrice = this.props.basePrice;
    dto.image = this.props.image;
    dto.stock = this.computedStock;
    dto.isActive = this.props.isActive;
    dto.standId = this.props.standId;
    dto.createdAt = this.props.createdAt;
    dto.updatedAt = this.props.updatedAt;

    if (this.props.sizes) {
      dto.sizes = this.props.sizes.map((size) => size.toResponseDto());
    }

    if (this.props.modifierGroups) {
      dto.modifierGroups = this.props.modifierGroups.map(
        ({ group, modifiers }) => {
          const groupDto = group.toResponseDto();
          groupDto.modifiers = modifiers.map((modifier) =>
            modifier.toResponseDto(),
          );
          return groupDto;
        },
      );
    }

    return dto;
  }
}
