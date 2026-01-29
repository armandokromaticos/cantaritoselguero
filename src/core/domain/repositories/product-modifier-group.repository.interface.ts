import { ProductModifierGroupEntity } from "../entities/product-modifier-group.entity";

export const PRODUCT_MODIFIER_GROUP_REPOSITORY = Symbol(
  "PRODUCT_MODIFIER_GROUP_REPOSITORY",
);

export interface IProductModifierGroupRepository {
  create(
    entity: ProductModifierGroupEntity,
  ): Promise<ProductModifierGroupEntity>;
  findById(id: string): Promise<ProductModifierGroupEntity | null>;
  findByProductId(productId: string): Promise<ProductModifierGroupEntity[]>;
  update(
    id: string,
    entity: Partial<ProductModifierGroupEntity>,
  ): Promise<ProductModifierGroupEntity>;
}
