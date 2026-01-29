import { ProductSizeEntity } from "../entities/product-size.entity";

export const PRODUCT_SIZE_REPOSITORY = Symbol("PRODUCT_SIZE_REPOSITORY");

export interface IProductSizeRepository {
  create(entity: ProductSizeEntity): Promise<ProductSizeEntity>;
  findByProductId(productId: string): Promise<ProductSizeEntity[]>;
  update(id: string, entity: Partial<ProductSizeEntity>): Promise<ProductSizeEntity>;
}
