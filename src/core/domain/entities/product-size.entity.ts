import { ProductSize as PrismaProductSize, Prisma } from "@prisma/client";
import { CreateProductSizeDto } from "../../application/dto/product-sizes/create-product-size.dto";
import { ProductSizeResponseDto } from "../../application/dto/product-sizes/product-size-response.dto";

interface ProductSizeProps {
  id: string;
  productId: string;
  nameEs: string;
  nameEn: string | null;
  descriptionEs: string | null;
  descriptionEn: string | null;
  price: number;
  stock: number | null;
  sortOrder: number;
  isDefault: boolean;
  isActive: boolean;
}

export class ProductSizeEntity {
  private props: ProductSizeProps;

  constructor(props: ProductSizeProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }
  get productId(): string {
    return this.props.productId;
  }
  get nameEs(): string {
    return this.props.nameEs;
  }
  get nameEn(): string | null {
    return this.props.nameEn;
  }
  get descriptionEs(): string | null {
    return this.props.descriptionEs;
  }
  get descriptionEn(): string | null {
    return this.props.descriptionEn;
  }
  get price(): number {
    return this.props.price;
  }
  get stock(): number | null {
    return this.props.stock;
  }
  get sortOrder(): number {
    return this.props.sortOrder;
  }
  get isDefault(): boolean {
    return this.props.isDefault;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }

  static fromPrisma(prisma: PrismaProductSize): ProductSizeEntity {
    return new ProductSizeEntity({
      id: prisma.id,
      productId: prisma.productId,
      nameEs: prisma.nameEs,
      nameEn: prisma.nameEn,
      descriptionEs: prisma.descriptionEs,
      descriptionEn: prisma.descriptionEn,
      price: Number(prisma.price),
      stock: prisma.stock,
      sortOrder: prisma.sortOrder,
      isDefault: prisma.isDefault,
      isActive: prisma.isActive,
    });
  }

  static fromCreateDto(
    productId: string,
    dto: CreateProductSizeDto,
  ): ProductSizeEntity {
    return new ProductSizeEntity({
      id: "",
      productId,
      nameEs: dto.nameEs.trim(),
      nameEn: dto.nameEn?.trim() || null,
      descriptionEs: dto.descriptionEs?.trim() || null,
      descriptionEn: dto.descriptionEn?.trim() || null,
      price: dto.price,
      stock: dto.stock ?? null,
      sortOrder: dto.sortOrder ?? 0,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    data.nameEs = this.props.nameEs;
    data.nameEn = this.props.nameEn;
    data.descriptionEs = this.props.descriptionEs;
    data.descriptionEn = this.props.descriptionEn;
    data.price = new Prisma.Decimal(this.props.price);
    data.stock = this.props.stock;
    data.sortOrder = this.props.sortOrder;
    data.isDefault = this.props.isDefault;
    data.isActive = this.props.isActive;
    data.product = { connect: { id: this.props.productId } };
    return data;
  }

  toResponseDto(lang: "es" | "en" = "es"): ProductSizeResponseDto {
    const dto = new ProductSizeResponseDto();
    dto.id = this.props.id;
    dto.productId = this.props.productId;
    dto.name =
      lang === "en"
        ? this.props.nameEn?.trim() || this.props.nameEs
        : this.props.nameEs;
    dto.description =
      lang === "en"
        ? this.props.descriptionEn?.trim() || this.props.descriptionEs
        : this.props.descriptionEs;
    dto.price = this.props.price;
    dto.stock = this.props.stock;
    dto.sortOrder = this.props.sortOrder;
    dto.isDefault = this.props.isDefault;
    dto.isActive = this.props.isActive;
    return dto;
  }
}
