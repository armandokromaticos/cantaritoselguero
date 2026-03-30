import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
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
import { Lang } from "../../../core/domain/enums/lang.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateStandDto } from "../../../core/application/dto/stands/create-stand.dto";
import { UpdateStandDto } from "../../../core/application/dto/stands/update-stand.dto";
import { StandResponseDto } from "../../../core/application/dto/stands/stand-response.dto";
import {
  AddStandProductDto,
  StandCatalogResponseDto,
} from "../../../core/application/dto/stands/stand-catalog.dto";
import { CreateStandUseCase } from "../../../core/application/use-cases/stands/create-stand.use-case";
import { GetStandUseCase } from "../../../core/application/use-cases/stands/get-stand.use-case";
import { GetStandsUseCase } from "../../../core/application/use-cases/stands/get-stands.use-case";
import { UpdateStandUseCase } from "../../../core/application/use-cases/stands/update-stand.use-case";
import { AddOperatorUseCase } from "../../../core/application/use-cases/stands/add-operator.use-case";
import { RemoveOperatorUseCase } from "../../../core/application/use-cases/stands/remove-operator.use-case";
import { AddProductToStandUseCase } from "../../../core/application/use-cases/stand-catalog/add-product-to-stand.use-case";
import { RemoveProductFromStandUseCase } from "../../../core/application/use-cases/stand-catalog/remove-product-from-stand.use-case";
import { GetStandCatalogUseCase } from "../../../core/application/use-cases/stand-catalog/get-stand-catalog.use-case";
import { GetStandPendingItemsUseCase } from "../../../core/application/use-cases/stand-catalog/get-stand-pending-items.use-case";
import { StandPendingItemsResponseDto } from "../../../core/application/dto/stands/stand-pending-items.dto";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

@ApiTags("Stands")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("stands")
export class StandsController {
  constructor(
    private readonly createStandUseCase: CreateStandUseCase,
    private readonly getStandUseCase: GetStandUseCase,
    private readonly getStandsUseCase: GetStandsUseCase,
    private readonly updateStandUseCase: UpdateStandUseCase,
    private readonly addOperatorUseCase: AddOperatorUseCase,
    private readonly removeOperatorUseCase: RemoveOperatorUseCase,
    private readonly addProductToStandUseCase: AddProductToStandUseCase,
    private readonly removeProductFromStandUseCase: RemoveProductFromStandUseCase,
    private readonly getStandCatalogUseCase: GetStandCatalogUseCase,
    private readonly getStandPendingItemsUseCase: GetStandPendingItemsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Crear stand" })
  async createStand(@Body() dto: CreateStandDto): Promise<StandResponseDto> {
    const entity = await this.createStandUseCase.execute(dto);
    return entity.toResponseDto();
  }

  @Get()
  @ApiOperation({ summary: "Listar stands" })
  async findAllStands(): Promise<StandResponseDto[]> {
    const entities = await this.getStandsUseCase.execute();
    return entities.map((stand) => stand.toResponseDto());
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener stand por ID" })
  async findOneStand(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<StandResponseDto> {
    const entity = await this.getStandUseCase.execute(id);
    return entity.toResponseDto();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar stand" })
  async updateStand(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateStandDto,
  ): Promise<StandResponseDto> {
    const entity = await this.updateStandUseCase.execute(id, dto);
    return entity.toResponseDto();
  }

  @Post(":id/operators/:userId")
  @ApiOperation({ summary: "Asignar operador a stand" })
  async addOperator(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<StandResponseDto> {
    const entity = await this.addOperatorUseCase.execute(id, userId);
    return entity.toResponseDto();
  }

  @Delete(":id/operators/:userId")
  @ApiOperation({ summary: "Desasignar operador de stand" })
  async removeOperator(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<StandResponseDto> {
    const entity = await this.removeOperatorUseCase.execute(id, userId);
    return entity.toResponseDto();
  }

  // ── Stand Catalog ──

  @Post(":id/catalog/:productId")
  @Roles(Role.ADMIN, Role.CATALOG_MANAGER)
  @ApiOperation({ summary: "Agregar producto al catálogo del stand" })
  async addProductToCatalog(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("productId", ParseUUIDPipe) productId: string,
    @Body() dto: AddStandProductDto,
  ): Promise<void> {
    await this.addProductToStandUseCase.execute(id, productId, dto.sortOrder);
  }

  @Delete(":id/catalog/:productId")
  @Roles(Role.ADMIN, Role.CATALOG_MANAGER)
  @ApiOperation({ summary: "Quitar producto del catálogo del stand" })
  async removeProductFromCatalog(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("productId", ParseUUIDPipe) productId: string,
  ): Promise<void> {
    await this.removeProductFromStandUseCase.execute(id, productId);
  }

  @Get(":id/catalog")
  @Roles(Role.ADMIN, Role.CATALOG_MANAGER, Role.STAND_OPERATOR)
  @ApiOperation({ summary: "Ver catálogo del stand" })
  @ApiQuery({ name: "active", required: false, type: Boolean })
  @ApiQuery({ name: "lang", required: false, enum: Lang })
  async getStandCatalog(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("active", new DefaultValuePipe(true), ParseBoolPipe)
    active: boolean,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<StandCatalogResponseDto> {
    return this.getStandCatalogUseCase.execute(id, active, lang);
  }

  // ── Pending Items ──

  @Get(":id/pending-items")
  @Roles(Role.ADMIN, Role.STAND_OPERATOR)
  @ApiOperation({ summary: "Items pendientes de entrega para un stand" })
  async getPendingItems(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string; role: Role },
  ): Promise<StandPendingItemsResponseDto> {
    return this.getStandPendingItemsUseCase.execute(id, user.id, user.role);
  }
}
