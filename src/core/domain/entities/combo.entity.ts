import {
  Combo as PrismaCombo,
  ComboItem as PrismaComboItem,
  Product as PrismaProduct,
} from "@prisma/client";
import { CreateComboDto } from "../../application/dto/combos/create-combo.dto";
import { ComboResponseDto } from "../../application/dto/combos/combo-response.dto";
import { Money } from "../value-objects/money.vo";
import type { PricingStrategy, PricingContext } from "../interfaces";

type PrismaComboWithRelations = PrismaCombo & {
  items?: (PrismaComboItem & {
    product: PrismaProduct;
  })[];
};

interface ComboItemInfo {
  id: string;
  productId: string;
  productName: string;
  productBasePrice: number;
  quantity: number;
  sortOrder: number;
}

interface ComboProps {
  id: string | undefined;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: ComboItemInfo[];
}

export class ComboEntity {
  private props: ComboProps;

  constructor(props: ComboProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get description(): string | null {
    return this.props.description;
  }
  get price(): number {
    return this.props.price;
  }
  get image(): string | null {
    return this.props.image;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get items(): ComboItemInfo[] | undefined {
    return this.props.items;
  }

  static fromPrisma(prisma: PrismaComboWithRelations): ComboEntity {
    const props: ComboProps = {
      id: prisma.id,
      name: prisma.name,
      description: prisma.description,
      price: Number(prisma.price),
      image: prisma.image,
      isActive: prisma.isActive,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    if (prisma.items) {
      props.items = prisma.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productBasePrice: Number(item.product.basePrice),
        quantity: item.quantity,
        sortOrder: item.sortOrder,
      }));
    }

    return new ComboEntity(props);
  }

  static fromCreateDto(dto: CreateComboDto): ComboEntity {
    return new ComboEntity({
      id: undefined,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      image: dto.image ?? null,
      isActive: dto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  toPrismaCreate(): Record<string, unknown> {
    return {
      name: this.props.name,
      description: this.props.description,
      price: this.props.price,
      image: this.props.image,
      isActive: this.props.isActive,
    };
  }

  toResponseDto(): ComboResponseDto {
    if (!this.props.id) {
      throw new Error("Cannot convert unpersisted entity to response DTO");
    }
    const dto = new ComboResponseDto();
    dto.id = this.props.id;
    dto.name = this.props.name;
    dto.description = this.props.description;
    dto.price = this.props.price;
    dto.image = this.props.image;
    dto.isActive = this.props.isActive;
    dto.createdAt = this.props.createdAt;
    dto.updatedAt = this.props.updatedAt;

    if (this.props.items) {
      dto.items = this.props.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productBasePrice: item.productBasePrice,
        quantity: item.quantity,
        sortOrder: item.sortOrder,
      }));
    }

    return dto;
  }

  /**
   * Calculates the total base price of all items in the combo
   * using the provided pricing strategy.
   */
  async calculateBasePrice(
    pricingStrategy: PricingStrategy,
    context: PricingContext = {},
  ): Promise<Money> {
    if (!this.props.items || this.props.items.length === 0) {
      return Money.zero();
    }

    let total = Money.zero();
    for (const item of this.props.items) {
      const itemPrice = await pricingStrategy.getProductPrice(
        item.productId,
        context,
      );
      total = total.add(itemPrice.multiply(item.quantity));
    }

    return total;
  }
}
