import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { ICouponRepository } from "../../../domain/repositories/coupon.repository.interface";
import { COUPON_REPOSITORY } from "../../../domain/repositories/coupon.repository.interface";
import { UpdateCouponDto } from "../../dto/coupons/update-coupon.dto";
import {
  CouponEntity,
  UpdateCouponParams,
} from "../../../domain/entities/coupon.entity";

@Injectable()
export class UpdateCouponUseCase {
  constructor(
    @Inject(COUPON_REPOSITORY)
    private readonly couponRepository: ICouponRepository,
  ) {}

  async execute(id: string, dto: UpdateCouponDto): Promise<CouponEntity> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${id} not found`);
    }

    const data: UpdateCouponParams = {};

    if (dto.nameEs !== undefined) {
      const nameUpper = dto.nameEs.trim().toUpperCase();
      const existing = await this.couponRepository.findByName(nameUpper);
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `Coupon with name "${nameUpper}" already exists`,
        );
      }
      data.nameEs = nameUpper;
    }
    if (dto.nameEn !== undefined) {
      data.nameEn = dto.nameEn ? dto.nameEn.trim().toUpperCase() : null;
    }
    if (dto.discountPercent !== undefined)
      data.discountPercent = dto.discountPercent;
    if (dto.maxDiscount !== undefined) data.maxDiscount = dto.maxDiscount;
    if (dto.totalQuantity !== undefined) data.totalQuantity = dto.totalQuantity;
    if (dto.expiresAt !== undefined) data.expiresAt = new Date(dto.expiresAt);
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return await this.couponRepository.update(id, data);
  }
}
