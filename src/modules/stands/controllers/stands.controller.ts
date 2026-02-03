import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Role } from "../../../core/domain/enums/role.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateStandDto } from "../../../core/application/dto/stands/create-stand.dto";
import { UpdateStandDto } from "../../../core/application/dto/stands/update-stand.dto";
import { StandResponseDto } from "../../../core/application/dto/stands/stand-response.dto";
import { CreateStandUseCase } from "../../../core/application/use-cases/stands/create-stand.use-case";
import { GetStandUseCase } from "../../../core/application/use-cases/stands/get-stand.use-case";
import { GetStandsUseCase } from "../../../core/application/use-cases/stands/get-stands.use-case";
import { UpdateStandUseCase } from "../../../core/application/use-cases/stands/update-stand.use-case";
import { AddOperatorUseCase } from "../../../core/application/use-cases/stands/add-operator.use-case";
import { RemoveOperatorUseCase } from "../../../core/application/use-cases/stands/remove-operator.use-case";

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
}
