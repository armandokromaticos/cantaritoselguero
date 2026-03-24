import { ProductEntity } from "../entities/product.entity";

export const PRODUCT_REPOSITORY = Symbol("PRODUCT_REPOSITORY");

export interface IProductRepository {
  create(entity: ProductEntity): Promise<ProductEntity>;
  findById(id: string): Promise<ProductEntity | null>;
  findAll(tagId?: string): Promise<ProductEntity[]>;
  update(id: string, entity: Partial<ProductEntity>): Promise<ProductEntity>;
  updateStock(id: string, stock: number | null): Promise<void>;
  delete(id: string): Promise<void>;
  assignTags(productId: string, tagIds: string[]): Promise<ProductEntity>;
  removeTag(productId: string, tagId: string): Promise<ProductEntity>;
}
