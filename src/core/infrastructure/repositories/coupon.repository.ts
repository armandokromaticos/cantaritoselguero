import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import { ICouponRepository } from "../../domain/repositories/coupon.repository.interface";
import {
  CouponEntity,
  UpdateCouponParams,
} from "../../domain/entities/coupon.entity";
import { CouponType } from "../../domain/enums/coupon-type.enum";

@Injectable()
export class CouponRepository implements ICouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly COUPON_INCLUDE = {
    usages: true,
  };

  async create(entity: CouponEntity): Promise<CouponEntity> {
    const data = entity.toPrismaCreate();
    const coupon = await this.prisma.coupon.create({
      data,
      include: CouponRepository.COUPON_INCLUDE,
    });
    return CouponEntity.fromPrisma(coupon);
  }

  async findById(id: string): Promise<CouponEntity | null> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: CouponRepository.COUPON_INCLUDE,
    });
    return coupon ? CouponEntity.fromPrisma(coupon) : null;
  }

  async findByName(name: string): Promise<CouponEntity | null> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { name },
      include: CouponRepository.COUPON_INCLUDE,
    });
    return coupon ? CouponEntity.fromPrisma(coupon) : null;
  }

  async findAll(type?: CouponType): Promise<CouponEntity[]> {
    const where = type ? { type } : {};
    const coupons = await this.prisma.coupon.findMany({
      where,
      include: CouponRepository.COUPON_INCLUDE,
      orderBy: { createdAt: "desc" },
    });
    return coupons.map((coupon) => CouponEntity.fromPrisma(coupon));
  }

  async update(id: string, data: UpdateCouponParams): Promise<CouponEntity> {
    const coupon = await this.prisma.coupon.update({
      where: { id },
      data,
      include: CouponRepository.COUPON_INCLUDE,
    });
    return CouponEntity.fromPrisma(coupon);
  }

  async createUsage(
    couponId: string,
    userId: string,
    orderId: string,
  ): Promise<void> {
    await this.prisma.couponUsage.create({
      data: { couponId, userId, orderId },
    });
  }

  async incrementUsedQuantity(id: string): Promise<void> {
    await this.prisma.coupon.update({
      where: { id },
      data: { usedQuantity: { increment: 1 } },
    });
  }

  async consumeCoupon(
    couponId: string,
    userId: string,
    orderId: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      const coupon = await prisma.coupon.findUniqueOrThrow({
        where: { id: couponId },
      });
      if (coupon.usedQuantity >= coupon.totalQuantity) {
        throw new Error("Coupon has no remaining uses");
      }
      await prisma.couponUsage.create({
        data: { couponId, userId, orderId },
      });
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedQuantity: { increment: 1 } },
      });
    });
  }
}
