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
}

export class ProductModifierGroupEntity {
  private props: ProductModifierGroupProps;

  constructor(props: ProductModifierGroupProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }
  get productId(): string {
    return this.props.productId;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string | null {
    return this.props.description;
  }
  get minSelect(): number {
    return this.props.minSelect;
  }
  get maxSelect(): number {
    return this.props.maxSelect;
  }
  get sortOrder(): number {
    return this.props.sortOrder;
  }
  get isRequired(): boolean {
    return this.props.minSelect > 0;
  }

  static fromPrisma(
    prisma: PrismaProductModifierGroup,
  ): ProductModifierGroupEntity {
    return new ProductModifierGroupEntity({
      id: prisma.id,
      productId: prisma.productId,
      name: prisma.name,
      description: prisma.description,
      minSelect: prisma.minSelect,
      maxSelect: prisma.maxSelect,
      sortOrder: prisma.sortOrder,
    });
  }

  static fromCreateDto(
    productId: string,
    dto: CreateProductModifierGroupDto,
  ): ProductModifierGroupEntity {
    return new ProductModifierGroupEntity({
      id: "",
      productId,
      name: dto.name,
      description: dto.description ?? null,
      minSelect: dto.minSelect ?? 0,
      maxSelect: dto.maxSelect ?? 1,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.name = this.props.name;
    data.description = this.props.description;
    data.minSelect = this.props.minSelect;
    data.maxSelect = this.props.maxSelect;
    data.sortOrder = this.props.sortOrder;
    data.product = { connect: { id: this.props.productId } };
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
    dto.isRequired = this.isRequired;
    return dto;
  }
}
