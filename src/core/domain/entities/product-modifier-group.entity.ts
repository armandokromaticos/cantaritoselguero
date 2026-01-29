import { ProductModifierGroup as PrismaProductModifierGroup } from "@prisma/client";
import { CreateProductModifierGroupDto } from "../../application/dto/product-modifier-groups/create-product-modifier-group.dto";
import { ProductModifierGroupResponseDto } from "../../application/dto/product-modifier-groups/product-modifier-group-response.dto";

interface ProductModifierGroupProps {
  id: string;
  productId: string;
  name: string;
  description: string | null;
  minSelect: number;
  maxSelect: number;
  sortOrder: number;
  isRequired: boolean;
}

export class ProductModifierGroupEntity {
  private props: ProductModifierGroupProps;

  constructor(props: ProductModifierGroupProps, _fromDB = false) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get productId(): string { return this.props.productId; }
  get name(): string { return this.props.name; }
  get description(): string | null { return this.props.description; }
  get minSelect(): number { return this.props.minSelect; }
  get maxSelect(): number { return this.props.maxSelect; }
  get sortOrder(): number { return this.props.sortOrder; }
  get isRequired(): boolean { return this.props.isRequired; }

  static fromPrisma(prisma: PrismaProductModifierGroup): ProductModifierGroupEntity {
    return new ProductModifierGroupEntity(
      {
        id: prisma.id,
        productId: prisma.productId,
        name: prisma.name,
        description: prisma.description,
        minSelect: prisma.minSelect,
        maxSelect: prisma.maxSelect,
        sortOrder: prisma.sortOrder,
        isRequired: prisma.isRequired,
      },
      true,
    );
  }

  static fromCreateDto(productId: string, dto: CreateProductModifierGroupDto): ProductModifierGroupEntity {
    return new ProductModifierGroupEntity({
      id: "",
      productId,
      name: dto.name,
      description: dto.description ?? null,
      minSelect: dto.minSelect ?? 0,
      maxSelect: dto.maxSelect ?? 1,
      sortOrder: dto.sortOrder ?? 0,
      isRequired: dto.isRequired ?? false,
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.name = this.props.name;
    data.description = this.props.description;
    data.minSelect = this.props.minSelect;
    data.maxSelect = this.props.maxSelect;
    data.sortOrder = this.props.sortOrder;
    data.isRequired = this.props.isRequired;
    data.product = { connect: { id: this.props.productId } };
    return data;
  }

  toPrismaUpdate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (this.props.name !== undefined) data.name = this.props.name;
    if (this.props.description !== undefined) data.description = this.props.description;
    if (this.props.minSelect !== undefined) data.minSelect = this.props.minSelect;
    if (this.props.maxSelect !== undefined) data.maxSelect = this.props.maxSelect;
    if (this.props.sortOrder !== undefined) data.sortOrder = this.props.sortOrder;
    if (this.props.isRequired !== undefined) data.isRequired = this.props.isRequired;
    if (this.props.productId !== undefined) {
      data.product = { connect: { id: this.props.productId } };
    }
    return data;
  }

  toResponseDto(): ProductModifierGroupResponseDto {
    const dto = new ProductModifierGroupResponseDto();
    dto.id = this.props.id;
    dto.productId = this.props.productId;
    dto.name = this.props.name;
    dto.description = this.props.description;
    dto.minSelect = this.props.minSelect;
    dto.maxSelect = this.props.maxSelect;
    dto.sortOrder = this.props.sortOrder;
    dto.isRequired = this.props.isRequired;
    return dto;
  }
}
