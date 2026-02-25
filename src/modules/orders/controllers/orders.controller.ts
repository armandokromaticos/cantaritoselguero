import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role } from "../../../core/domain/enums/role.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { CreateOrderDto } from "../../../core/application/dto/orders/create-order.dto";
import { OrderResponseDto } from "../../../core/application/dto/orders/order-response.dto";
import { CreateOrderUseCase } from "../../../core/application/use-cases/orders/create-order.use-case";
import { GetOrderUseCase } from "../../../core/application/use-cases/orders/get-order.use-case";
import { GetOrdersUseCase } from "../../../core/application/use-cases/orders/get-orders.use-case";
import { CancelOrderUseCase } from "../../../core/application/use-cases/orders/cancel-order.use-case";
import { GetOrderByQrUseCase } from "../../../core/application/use-cases/orders/get-order-by-qr.use-case";
import { GetOrderByCodeUseCase } from "../../../core/application/use-cases/orders/get-order-by-code.use-case";

@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("orders")
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderByQrUseCase: GetOrderByQrUseCase,
    private readonly getOrderByCodeUseCase: GetOrderByCodeUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Crear orden con items" })
  async createOrder(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<OrderResponseDto> {
    const entity = await this.createOrderUseCase.execute(user.id, dto);
    return entity.toResponseDto();
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Listar ordenes (propias o todas para ADMIN)" })
  async findAllOrders(
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<OrderResponseDto[]> {
    const entities = await this.getOrdersUseCase.execute(user.id, user.role);
    return entities.map((order) => order.toResponseDto());
  }

  @Get("qr/:qrCode")
  @Roles(Role.ADMIN, Role.STAND_OPERATOR)
  @ApiOperation({ summary: "Buscar orden por QR code" })
  async findByQrCode(
    @Param("qrCode", ParseUUIDPipe) qrCode: string,
  ): Promise<OrderResponseDto> {
    const entity = await this.getOrderByQrUseCase.execute(qrCode);
    return entity.toResponseDto();
  }

  @Get("code/:shortCode")
  @Roles(Role.ADMIN, Role.STAND_OPERATOR)
  @ApiOperation({ summary: "Buscar orden por codigo corto" })
  async findByShortCode(
    @Param("shortCode") shortCode: string,
  ): Promise<OrderResponseDto> {
    const entity = await this.getOrderByCodeUseCase.execute(shortCode);
    return entity.toResponseDto();
  }

  @Get(":id")
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Obtener orden por ID" })
  async findOneOrder(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<OrderResponseDto> {
    const entity = await this.getOrderUseCase.execute(id, user.id, user.role);
    return entity.toResponseDto();
  }

  @Post(":id/cancel")
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: "Cancelar orden PENDING" })
  async cancelOrder(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<OrderResponseDto> {
    const entity = await this.cancelOrderUseCase.execute(
      id,
      user.id,
      user.role,
    );
    return entity.toResponseDto();
  }
}
