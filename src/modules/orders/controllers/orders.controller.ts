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
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { CreateOrderDto } from "../../../core/application/dto/orders/create-order.dto";
import { UpdateOrderStatusDto } from "../../../core/application/dto/orders/update-order-status.dto";
import { OrderResponseDto } from "../../../core/application/dto/orders/order-response.dto";
import { CreateOrderUseCase } from "../../../core/application/use-cases/orders/create-order.use-case";
import { GetOrderUseCase } from "../../../core/application/use-cases/orders/get-order.use-case";
import { GetOrdersUseCase } from "../../../core/application/use-cases/orders/get-orders.use-case";
import { CancelOrderUseCase } from "../../../core/application/use-cases/orders/cancel-order.use-case";
import { GetOrderByQrUseCase } from "../../../core/application/use-cases/orders/get-order-by-qr.use-case";
import { GetOrderByCodeUseCase } from "../../../core/application/use-cases/orders/get-order-by-code.use-case";
import { UpdateOrderStatusUseCase } from "../../../core/application/use-cases/orders/update-order-status.use-case";
import { DeliverOrderItemUseCase } from "../../../core/application/use-cases/orders/deliver-order-item.use-case";

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
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly deliverOrderItemUseCase: DeliverOrderItemUseCase,
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
  @Roles(Role.ADMIN, Role.USER, Role.STAND_OPERATOR)
  @ApiOperation({
    summary: "Listar ordenes (propias, por stand, o todas para ADMIN)",
  })
  @ApiQuery({
    name: "standId",
    required: false,
    type: String,
    description: "Filtrar por stand",
  })
  async findAllOrders(
    @CurrentUser() user: { id: string; role: Role },
    @Query("standId", new ParseUUIDPipe({ optional: true })) standId?: string,
  ): Promise<OrderResponseDto[]> {
    const entities = await this.getOrdersUseCase.execute(
      user.id,
      user.role,
      standId,
    );
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

  @Patch(":id/status")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Cambiar estado de orden (ADMIN)" })
  async updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const entity = await this.updateOrderStatusUseCase.execute(id, dto.status);
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

  @Post(":id/items/:itemId/deliver/:standId")
  @Roles(Role.ADMIN, Role.STAND_OPERATOR)
  @ApiOperation({ summary: "Marcar item como entregado en un stand" })
  async deliverItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("itemId", ParseUUIDPipe) itemId: string,
    @Param("standId", ParseUUIDPipe) standId: string,
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<OrderResponseDto> {
    const entity = await this.deliverOrderItemUseCase.execute(
      id,
      itemId,
      standId,
      user.id,
      user.role,
    );
    return entity.toResponseDto();
  }
}
