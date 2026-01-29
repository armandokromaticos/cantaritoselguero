import {
  ProductSize as PrismaProductSize,
  Prisma,
} from "@prisma/client";
import { CreateProductSizeDto } from "../../application/dto/product-sizes/create-product-size.dto";
import { ProductSizeResponseDto } from "../../application/dto/product-sizes/product-size-response.dto";

interface ProductSizeProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

export class ProductSizeEntity {
  private props: ProductSizeProps;

  constructor(props: ProductSizeProps, _fromDB = false) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get productId(): string { return this.props.productId; }
  get name(): string { return this.props.name; }
  get price(): number { return this.props.price; }
  get sortOrder(): number { return this.props.sortOrder; }
  get isDefault(): boolean { return this.props.isDefault; }
  get isActive(): boolean { return this.props.isActive; }

  static fromPrisma(prisma: PrismaProductSize): ProductSizeEntity {
    return new ProductSizeEntity(
      {
        id: prisma.id,
        productId: prisma.productId,
        name: prisma.name,
        price: Number(prisma.price),
        sortOrder: prisma.sortOrder,
        isDefault: prisma.isDefault,
        isActive: prisma.isActive,
      },
      true,
    );
  }

  static fromCreateDto(productId: string, dto: CreateProductSizeDto): ProductSizeEntity {
    return new ProductSizeEntity({
      id: "",
      productId,
      name: dto.name,
      price: dto.price,
      sortOrder: dto.sortOrder ?? 0,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.name = this.props.name;
    data.price = new Prisma.Decimal(this.props.price);
    data.sortOrder = this.props.sortOrder;
    data.isDefault = this.props.isDefault;
    data.isActive = this.props.isActive;
    data.product = { connect: { id: this.props.productId } };
    return data;
  }

  toPrismaUpdate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    if (this.props.name !== undefined) data.name = this.props.name;
    if (this.props.price !== undefined)
      data.price = new Prisma.Decimal(this.props.price);
    if (this.props.sortOrder !== undefined) data.sortOrder = this.props.sortOrder;
    if (this.props.isDefault !== undefined) data.isDefault = this.props.isDefault;
    if (this.props.isActive !== undefined) data.isActive = this.props.isActive;
    if (this.props.productId !== undefined) {
      data.product = { connect: { id: this.props.productId } };
    }
    return data;
  }

  toResponseDto(): ProductSizeResponseDto {
    const dto = new ProductSizeResponseDto();
    dto.id = this.props.id;
    dto.productId = this.props.productId;
    dto.name = this.props.name;
    dto.price = this.props.price;
    dto.sortOrder = this.props.sortOrder;
    dto.isDefault = this.props.isDefault;
    dto.isActive = this.props.isActive;
    return dto;
  }
}
