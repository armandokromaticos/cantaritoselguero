import { ProductEntity } from "../entities/product.entity";

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");

export interface IProductRepository {
  create(entity: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findAll(): Promise<ProductEntity[]>;
  update(id: string, entity: Partial<ProductEntity>): Promise<ProductEntity>;
}
