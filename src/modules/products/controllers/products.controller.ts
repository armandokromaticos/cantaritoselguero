import {
  BadRequestException,
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
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { Role } from "../../../core/domain/enums/role.enum";
import { Lang } from "../../../core/domain/enums/lang.enum";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

// Product DTOs
import { CreateProductDto } from "../../../core/application/dto/products/create-product.dto";
import { UpdateProductDto } from "../../../core/application/dto/products/update-product.dto";
import { ProductResponseDto } from "../../../core/application/dto/products/product-response.dto";

// Product Size DTOs
import { CreateProductSizeDto } from "../../../core/application/dto/product-sizes/create-product-size.dto";
import { UpdateProductSizeDto } from "../../../core/application/dto/product-sizes/update-product-size.dto";
import { ProductSizeResponseDto } from "../../../core/application/dto/product-sizes/product-size-response.dto";

// Product Modifier Group DTOs
import { CreateProductModifierGroupDto } from "../../../core/application/dto/product-modifier-groups/create-product-modifier-group.dto";
import { UpdateProductModifierGroupDto } from "../../../core/application/dto/product-modifier-groups/update-product-modifier-group.dto";
import { ProductModifierGroupResponseDto } from "../../../core/application/dto/product-modifier-groups/product-modifier-group-response.dto";

// Product Modifier DTOs
import { CreateProductModifierDto } from "../../../core/application/dto/product-modifiers/create-product-modifier.dto";
import { UpdateProductModifierDto } from "../../../core/application/dto/product-modifiers/update-product-modifier.dto";
import { ProductModifierResponseDto } from "../../../core/application/dto/product-modifiers/product-modifier-response.dto";

// Product Tags DTOs
import { AssignTagsDto } from "../../../core/application/dto/products/assign-tags.dto";

// Use Cases - Products
import { CreateProductUseCase } from "../../../core/application/use-cases/products/create-product.use-case";
import { GetProductUseCase } from "../../../core/application/use-cases/products/get-product.use-case";
import { GetProductsUseCase } from "../../../core/application/use-cases/products/get-products.use-case";
import { UpdateProductUseCase } from "../../../core/application/use-cases/products/update-product.use-case";
import { DeleteProductUseCase } from "../../../core/application/use-cases/products/delete-product.use-case";
import {
  UploadProductImageUseCase,
  UploadFileInput,
} from "../../../core/application/use-cases/products/upload-product-image.use-case";
import { AssignTagsToProductUseCase } from "../../../core/application/use-cases/products/assign-tags-to-product.use-case";
import { RemoveTagFromProductUseCase } from "../../../core/application/use-cases/products/remove-tag-from-product.use-case";

// Use Cases - Sizes
import { CreateProductSizeUseCase } from "../../../core/application/use-cases/product-sizes/create-product-size.use-case";
import { GetProductSizesUseCase } from "../../../core/application/use-cases/product-sizes/get-product-sizes.use-case";
import { UpdateProductSizeUseCase } from "../../../core/application/use-cases/product-sizes/update-product-size.use-case";
import { DeleteProductSizeUseCase } from "../../../core/application/use-cases/product-sizes/delete-product-size.use-case";

// Use Cases - Modifier Groups
import { CreateProductModifierGroupUseCase } from "../../../core/application/use-cases/product-modifier-groups/create-product-modifier-group.use-case";
import { GetProductModifierGroupsUseCase } from "../../../core/application/use-cases/product-modifier-groups/get-product-modifier-groups.use-case";
import { UpdateProductModifierGroupUseCase } from "../../../core/application/use-cases/product-modifier-groups/update-product-modifier-group.use-case";

// Use Cases - Modifiers
import { CreateProductModifierUseCase } from "../../../core/application/use-cases/product-modifiers/create-product-modifier.use-case";
import { GetProductModifiersUseCase } from "../../../core/application/use-cases/product-modifiers/get-product-modifiers.use-case";
import { UpdateProductModifierUseCase } from "../../../core/application/use-cases/product-modifiers/update-product-modifier.use-case";

@ApiTags("Products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("products")
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly uploadProductImageUseCase: UploadProductImageUseCase,
    private readonly createProductSizeUseCase: CreateProductSizeUseCase,
    private readonly getProductSizesUseCase: GetProductSizesUseCase,
    private readonly updateProductSizeUseCase: UpdateProductSizeUseCase,
    private readonly deleteProductSizeUseCase: DeleteProductSizeUseCase,
    private readonly createProductModifierGroupUseCase: CreateProductModifierGroupUseCase,
    private readonly getProductModifierGroupsUseCase: GetProductModifierGroupsUseCase,
    private readonly updateProductModifierGroupUseCase: UpdateProductModifierGroupUseCase,
    private readonly createProductModifierUseCase: CreateProductModifierUseCase,
    private readonly getProductModifiersUseCase: GetProductModifiersUseCase,
    private readonly updateProductModifierUseCase: UpdateProductModifierUseCase,
    private readonly assignTagsToProductUseCase: AssignTagsToProductUseCase,
    private readonly removeTagFromProductUseCase: RemoveTagFromProductUseCase,
  ) {}

  // ── Products ──

  @Post()
  @ApiOperation({ summary: "Crear producto" })
  async createProduct(
    @Body() dto: CreateProductDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductResponseDto> {
    const entity = await this.createProductUseCase.execute(dto);
    return entity.toResponseDto(lang);
  }

  @Get()
  @ApiOperation({ summary: "Listar productos" })
  @ApiQuery({ name: "lang", required: false, enum: Lang })
  @ApiQuery({
    name: "tag",
    required: false,
    type: String,
    description: "Filter by tag ID",
  })
  async findAllProducts(
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
    @Query("tag") tagId?: string,
  ): Promise<ProductResponseDto[]> {
    if (tagId && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tagId)) {
      throw new BadRequestException("tag must be a valid UUID");
    }
    const entities = await this.getProductsUseCase.execute(tagId);
    return entities.map((product) => product.toResponseDto(lang));
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener producto por ID" })
  async findOneProduct(
    @Param("id") id: string,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductResponseDto> {
    const entity = await this.getProductUseCase.execute(id);
    return entity.toResponseDto(lang);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Actualizar producto" })
  async updateProduct(
    @Param("id") id: string,
    @Body() dto: UpdateProductDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductResponseDto> {
    const entity = await this.updateProductUseCase.execute(id, dto);
    return entity.toResponseDto(lang);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Eliminar producto" })
  async deleteProduct(@Param("id") id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }

  @Post(":id/image")
  @ApiOperation({ summary: "Subir imagen de producto" })
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
    @Param("id") id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductResponseDto> {
    const uploadInput: UploadFileInput = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    };
    const entity = await this.uploadProductImageUseCase.execute(
      id,
      uploadInput,
    );
    return entity.toResponseDto(lang);
  }

  // ── Product Sizes ──

  @Post(":productId/sizes")
  @ApiOperation({ summary: "Crear tamaño de producto" })
  async createSize(
    @Param("productId") productId: string,
    @Body() dto: CreateProductSizeDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductSizeResponseDto> {
    const entity = await this.createProductSizeUseCase.execute(productId, dto);
    return entity.toResponseDto(lang);
  }

  @Get(":productId/sizes")
  @ApiOperation({ summary: "Listar tamaños de producto" })
  async findSizes(
    @Param("productId") productId: string,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductSizeResponseDto[]> {
    const entities = await this.getProductSizesUseCase.execute(productId);
    return entities.map((size) => size.toResponseDto(lang));
  }

  @Patch(":productId/sizes/:id")
  @ApiOperation({ summary: "Actualizar tamaño de producto" })
  async updateSize(
    @Param("id") id: string,
    @Body() dto: UpdateProductSizeDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductSizeResponseDto> {
    const entity = await this.updateProductSizeUseCase.execute(id, dto);
    return entity.toResponseDto(lang);
  }

  @Delete(":productId/sizes/:id")
  @HttpCode(204)
  @ApiOperation({ summary: "Eliminar tamaño de producto" })
  async deleteSize(@Param("id") id: string): Promise<void> {
    await this.deleteProductSizeUseCase.execute(id);
  }

  // ── Product Modifier Groups ──

  @Post(":productId/modifier-groups")
  @ApiOperation({ summary: "Crear grupo de modificadores" })
  async createModifierGroup(
    @Param("productId") productId: string,
    @Body() dto: CreateProductModifierGroupDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductModifierGroupResponseDto> {
    const entity = await this.createProductModifierGroupUseCase.execute(
      productId,
      dto,
    );
    return entity.toResponseDto(lang);
  }

  @Get(":productId/modifier-groups")
  @ApiOperation({ summary: "Listar grupos de modificadores" })
  async findModifierGroups(
    @Param("productId") productId: string,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductModifierGroupResponseDto[]> {
    const entities =
      await this.getProductModifierGroupsUseCase.execute(productId);
    return entities.map((group) => group.toResponseDto(lang));
  }

  @Patch(":productId/modifier-groups/:id")
  @ApiOperation({ summary: "Actualizar grupo de modificadores" })
  async updateModifierGroup(
    @Param("id") id: string,
    @Body() dto: UpdateProductModifierGroupDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductModifierGroupResponseDto> {
    const entity = await this.updateProductModifierGroupUseCase.execute(
      id,
      dto,
    );
    return entity.toResponseDto(lang);
  }

  // ── Product Modifiers ──

  @Post(":productId/modifier-groups/:groupId/modifiers")
  @ApiOperation({ summary: "Crear modificador" })
  async createModifier(
    @Param("groupId") groupId: string,
    @Body() dto: CreateProductModifierDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductModifierResponseDto> {
    const entity = await this.createProductModifierUseCase.execute(
      groupId,
      dto,
    );
    return entity.toResponseDto(lang);
  }

  @Get(":productId/modifier-groups/:groupId/modifiers")
  @ApiOperation({ summary: "Listar modificadores" })
  async findModifiers(
    @Param("groupId") groupId: string,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductModifierResponseDto[]> {
    const entities = await this.getProductModifiersUseCase.execute(groupId);
    return entities.map((modifier) => modifier.toResponseDto(lang));
  }

  @Patch(":productId/modifier-groups/:groupId/modifiers/:id")
  @ApiOperation({ summary: "Actualizar modificador" })
  async updateModifier(
    @Param("id") id: string,
    @Body() dto: UpdateProductModifierDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductModifierResponseDto> {
    const entity = await this.updateProductModifierUseCase.execute(id, dto);
    return entity.toResponseDto(lang);
  }

  // ── Product Tags ──

  @Post(":id/tags")
  @ApiOperation({ summary: "Asignar tags a producto" })
  @ApiQuery({ name: "lang", required: false, enum: Lang })
  async assignTags(
    @Param("id") id: string,
    @Body() dto: AssignTagsDto,
    @Query("lang", new DefaultValuePipe(Lang.ES), new ParseEnumPipe(Lang))
    lang: Lang,
  ): Promise<ProductResponseDto> {
    const entity = await this.assignTagsToProductUseCase.execute(
      id,
      dto.tagIds,
    );
    return entity.toResponseDto(lang);
  }

  @Delete(":id/tags/:tagId")
  @HttpCode(204)
  @ApiOperation({ summary: "Quitar tag de producto" })
  async removeTag(
    @Param("id") id: string,
    @Param("tagId") tagId: string,
  ): Promise<void> {
    await this.removeTagFromProductUseCase.execute(id, tagId);
  }
}
