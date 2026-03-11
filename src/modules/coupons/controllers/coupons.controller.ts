import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "../../../core/domain/enums/role.enum";
import { CouponType } from "../../../core/domain/enums/coupon-type.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateCouponDto } from "../../../core/application/dto/coupons/create-coupon.dto";
import { UpdateCouponDto } from "../../../core/application/dto/coupons/update-coupon.dto";
import { CouponResponseDto } from "../../../core/application/dto/coupons/coupon-response.dto";
import { CreateCouponUseCase } from "../../../core/application/use-cases/coupons/create-coupon.use-case";
import { GetCouponsUseCase } from "../../../core/application/use-cases/coupons/get-coupons.use-case";
import { GetCouponUseCase } from "../../../core/application/use-cases/coupons/get-coupon.use-case";
import { UpdateCouponUseCase } from "../../../core/application/use-cases/coupons/update-coupon.use-case";
import { ToggleCouponUseCase } from "../../../core/application/use-cases/coupons/toggle-coupon.use-case";

@ApiTags("Coupons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("coupons")
export class CouponsController {
  constructor(
    private readonly createCouponUseCase: CreateCouponUseCase,
    private readonly getCouponsUseCase: GetCouponsUseCase,
    private readonly getCouponUseCase: GetCouponUseCase,
    private readonly updateCouponUseCase: UpdateCouponUseCase,
    private readonly toggleCouponUseCase: ToggleCouponUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Crear cupon (GLOBAL o UNIQUE)" })
  async createCoupon(@Body() dto: CreateCouponDto): Promise<CouponResponseDto> {
    const entity = await this.createCouponUseCase.execute(dto);
    return entity.toResponseDto();
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Listar cupones (filtrable por tipo)" })
  @ApiQuery({ name: "type", required: false, enum: ["GLOBAL", "UNIQUE"] })
  async findAllCoupons(
    @Query("type") type?: CouponType,
  ): Promise<CouponResponseDto[]> {
    const entities = await this.getCouponsUseCase.execute(type);
    return entities.map((coupon) => coupon.toResponseDto());
  }

  @Get(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Obtener cupon por ID" })
  async findOneCoupon(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CouponResponseDto> {
    const entity = await this.getCouponUseCase.execute(id);
    return entity.toResponseDto();
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Actualizar cupon" })
  async updateCoupon(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCouponDto,
  ): Promise<CouponResponseDto> {
    const entity = await this.updateCouponUseCase.execute(id, dto);
    return entity.toResponseDto();
  }

  @Patch(":id/toggle")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Activar/desactivar cupon" })
  async toggleCoupon(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CouponResponseDto> {
    const entity = await this.toggleCouponUseCase.execute(id);
    return entity.toResponseDto();
  }
}
