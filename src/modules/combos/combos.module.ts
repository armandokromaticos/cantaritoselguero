import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CombosController } from "./controllers/combos.controller";
import { COMBO_REPOSITORY } from "../../core/domain/repositories/combo.repository.interface";
import { ComboRepository } from "../../core/infrastructure/repositories/combo.repository";
import { PRODUCT_REPOSITORY } from "../../core/domain/repositories/product.repository.interface";
import { ProductRepository } from "../../core/infrastructure/repositories/product.repository";
import { CreateComboUseCase } from "../../core/application/use-cases/combos/create-combo.use-case";
import { GetComboUseCase } from "../../core/application/use-cases/combos/get-combo.use-case";
import { GetCombosUseCase } from "../../core/application/use-cases/combos/get-combos.use-case";
import { UpdateComboUseCase } from "../../core/application/use-cases/combos/update-combo.use-case";
import { AddComboItemUseCase } from "../../core/application/use-cases/combos/add-combo-item.use-case";
import { RemoveComboItemUseCase } from "../../core/application/use-cases/combos/remove-combo-item.use-case";
import { UploadComboImageUseCase } from "../../core/application/use-cases/combos/upload-combo-image.use-case";

@Module({
  imports: [AuthModule],
  controllers: [CombosController],
  providers: [
    { provide: COMBO_REPOSITORY, useClass: ComboRepository },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    CreateComboUseCase,
    GetComboUseCase,
    GetCombosUseCase,
    UpdateComboUseCase,
    AddComboItemUseCase,
    RemoveComboItemUseCase,
    UploadComboImageUseCase,
  ],
})
export class CombosModule {}
