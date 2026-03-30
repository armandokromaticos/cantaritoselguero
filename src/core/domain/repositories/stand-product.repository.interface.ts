import { ProductEntity } from "../entities/product.entity";
import { StandEntity } from "../entities/stand.entity";

export const STAND_PRODUCT_REPOSITORY = Symbol("STAND_PRODUCT_REPOSITORY");

export interface StandProductEntry {
  product: ProductEntity;
  sortOrder: number;
  isActive: boolean;
}

export interface IStandProductRepository {
  add(standId: string, productId: string, sortOrder?: number): Promise<void>;
  remove(standId: string, productId: string): Promise<void>;
  findByStand(
    standId: string,
    activeOnly?: boolean,
  ): Promise<StandProductEntry[]>;
  findByProduct(
    productId: string,
    activeOnly?: boolean,
  ): Promise<StandEntity[]>;
  exists(standId: string, productId: string): Promise<boolean>;
  existsActive(standId: string, productId: string): Promise<boolean>;
  updateSortOrder(
    standId: string,
    productId: string,
    sortOrder: number,
  ): Promise<void>;
  findStandIdsForProduct(productId: string): Promise<string[]>;
}
