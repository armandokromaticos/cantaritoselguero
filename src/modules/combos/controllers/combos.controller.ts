import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "../../../core/domain/enums/role.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateComboDto } from "../../../core/application/dto/combos/create-combo.dto";
import { UpdateComboDto } from "../../../core/application/dto/combos/update-combo.dto";
import { AddComboItemDto } from "../../../core/application/dto/combos/add-combo-item.dto";
import { ComboResponseDto } from "../../../core/application/dto/combos/combo-response.dto";
import { CreateComboUseCase } from "../../../core/application/use-cases/combos/create-combo.use-case";
import { GetComboUseCase } from "../../../core/application/use-cases/combos/get-combo.use-case";
import { GetCombosUseCase } from "../../../core/application/use-cases/combos/get-combos.use-case";
import { UpdateComboUseCase } from "../../../core/application/use-cases/combos/update-combo.use-case";
import { AddComboItemUseCase } from "../../../core/application/use-cases/combos/add-combo-item.use-case";
import { RemoveComboItemUseCase } from "../../../core/application/use-cases/combos/remove-combo-item.use-case";
import {
  UploadComboImageUseCase,
  UploadFileInput,
} from "../../../core/application/use-cases/combos/upload-combo-image.use-case";

@ApiTags("Combos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("combos")
export class CombosController {
  constructor(
    private readonly createComboUseCase: CreateComboUseCase,
    private readonly getComboUseCase: GetComboUseCase,
    private readonly getCombosUseCase: GetCombosUseCase,
    private readonly updateComboUseCase: UpdateComboUseCase,
    private readonly addComboItemUseCase: AddComboItemUseCase,
    private readonly removeComboItemUseCase: RemoveComboItemUseCase,
    private readonly uploadComboImageUseCase: UploadComboImageUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Crear combo" })
  async createCombo(@Body() dto: CreateComboDto): Promise<ComboResponseDto> {
    const entity = await this.createComboUseCase.execute(dto);
    return entity.toResponseDto();
  }

  @Get()
  @ApiOperation({ summary: "Listar combos" })
  async findAllCombos(): Promise<ComboResponseDto[]> {
    const entities = await this.getCombosUseCase.execute();
    return entities.map((combo) => combo.toResponseDto());
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener combo por ID" })
  async findOneCombo(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ComboResponseDto> {
    const entity = await this.getComboUseCase.execute(id);
    return entity.toResponseDto();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar combo" })
  async updateCombo(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateComboDto,
  ): Promise<ComboResponseDto> {
    const entity = await this.updateComboUseCase.execute(id, dto);
    return entity.toResponseDto();
  }

  @Post(":id/image")
  @ApiOperation({ summary: "Subir imagen de combo" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
      required: ["file"],
    },
  })
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 5 * 1024 * 1024 } }),
  )
  async uploadImage(
    @Param("id", ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ComboResponseDto> {
    const uploadInput: UploadFileInput = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    };
    const entity = await this.uploadComboImageUseCase.execute(id, uploadInput);
    return entity.toResponseDto();
  }

  @Post(":id/items")
  @ApiOperation({ summary: "Agregar item al combo" })
  async addItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AddComboItemDto,
  ): Promise<ComboResponseDto> {
    const entity = await this.addComboItemUseCase.execute(id, dto);
    return entity.toResponseDto();
  }

  @Delete(":id/items/:itemId")
  @ApiOperation({ summary: "Quitar item del combo" })
  async removeItem(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("itemId", ParseUUIDPipe) itemId: string,
  ): Promise<ComboResponseDto> {
    const entity = await this.removeComboItemUseCase.execute(id, itemId);
    return entity.toResponseDto();
  }
}
