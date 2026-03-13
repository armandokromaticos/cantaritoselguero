import { CouponEntity, UpdateCouponParams } from "../entities/coupon.entity";
import { CouponType } from "../enums/coupon-type.enum";

export const COUPON_REPOSITORY = Symbol("COUPON_REPOSITORY");

export interface ICouponRepository {
  create(entity: CouponEntity): Promise<CouponEntity>;
  findById(id: string): Promise<CouponEntity | null>;
  findByName(name: string): Promise<CouponEntity | null>;
  findAll(type?: CouponType): Promise<CouponEntity[]>;
  update(id: string, data: UpdateCouponParams): Promise<CouponEntity>;
  createUsage(couponId: string, userId: string, orderId: string): Promise<void>;
  incrementUsedQuantity(id: string): Promise<void>;
  consumeCoupon(
    couponId: string,
    userId: string,
    orderId: string,
  ): Promise<void>;
}
