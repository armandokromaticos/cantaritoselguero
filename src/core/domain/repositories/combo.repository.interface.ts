import { ComboEntity } from "../entities/combo.entity";

export const COMBO_REPOSITORY = Symbol("COMBO_REPOSITORY");

export interface IComboRepository {
  create(entity: ComboEntity): Promise<ComboEntity>;
  findById(id: string): Promise<ComboEntity | null>;
  findAll(): Promise<ComboEntity[]>;
  update(id: string, entity: Partial<ComboEntity>): Promise<ComboEntity>;
  addItem(
    comboId: string,
    productId: string,
    quantity: number,
    sortOrder?: number,
  ): Promise<ComboEntity>;
  removeItem(comboId: string, itemId: string): Promise<ComboEntity>;
}
