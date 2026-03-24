import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
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
import { CreateTagDto } from "../../../core/application/dto/tags/create-tag.dto";
import { UpdateTagDto } from "../../../core/application/dto/tags/update-tag.dto";
import { TagResponseDto } from "../../../core/application/dto/tags/tag-response.dto";
import { CreateTagUseCase } from "../../../core/application/use-cases/tags/create-tag.use-case";
import { GetTagsUseCase } from "../../../core/application/use-cases/tags/get-tags.use-case";
import { UpdateTagUseCase } from "../../../core/application/use-cases/tags/update-tag.use-case";
import { DeleteTagUseCase } from "../../../core/application/use-cases/tags/delete-tag.use-case";

@ApiTags("Tags")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("tags")
export class TagsController {
  constructor(
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly getTagsUseCase: GetTagsUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Crear tag" })
  @ApiQuery({ name: "lang", required: false, enum: Lang })
  async createTag(
    @Body() dto: CreateTagDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<TagResponseDto> {
    const entity = await this.createTagUseCase.execute(dto);
    return entity.toResponseDto(lang);
  }

  @Get()
  @ApiOperation({ summary: "Listar tags" })
  @ApiQuery({ name: "lang", required: false, enum: Lang })
  async findAllTags(
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<TagResponseDto[]> {
    const entities = await this.getTagsUseCase.execute();
    return entities.map((tag) => tag.toResponseDto(lang));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar tag" })
  @ApiQuery({ name: "lang", required: false, enum: Lang })
  async updateTag(
    @Param("id") id: string,
    @Body() dto: UpdateTagDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<TagResponseDto> {
    const entity = await this.updateTagUseCase.execute(id, dto);
    return entity.toResponseDto(lang);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Eliminar tag" })
  async deleteTag(@Param("id") id: string): Promise<void> {
    await this.deleteTagUseCase.execute(id);
  }
}
