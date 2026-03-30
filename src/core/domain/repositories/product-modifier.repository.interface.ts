import { ProductModifierEntity } from "../entities/product-modifier.entity";

export const PRODUCT_MODIFIER_REPOSITORY = Symbol(
  "PRODUCT_MODIFIER_REPOSITORY",
);

export interface ModifierSizePriceEntry {
  productSizeId: string;
  priceAdjustment: number;
}

export interface IProductModifierRepository {
  create(entity: ProductModifierEntity): Promise<ProductModifierEntity>;
  findById(id: string): Promise<ProductModifierEntity | null>;
  findByGroupId(groupId: string): Promise<ProductModifierEntity[]>;
  update(
    id: string,
    entity: Partial<ProductModifierEntity>,
  ): Promise<ProductModifierEntity>;
  assignTags(modifierId: string, tagIds: string[]): Promise<void>;
  removeTag(modifierId: string, tagId: string): Promise<void>;
  setSizePrices(
    modifierId: string,
    entries: ModifierSizePriceEntry[],
  ): Promise<void>;
  findSizePrices(modifierId: string): Promise<ModifierSizePriceEntry[]>;
  findSizePrice(
    modifierId: string,
    productSizeId: string,
  ): Promise<number | null>;
}
