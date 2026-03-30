import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { StandsController } from "./controllers/stands.controller";
import { STAND_REPOSITORY } from "../../core/domain/repositories/stand.repository.interface";
import { StandRepository } from "../../core/infrastructure/repositories/stand.repository";
import { PRODUCT_REPOSITORY } from "../../core/domain/repositories/product.repository.interface";
import { ProductRepository } from "../../core/infrastructure/repositories/product.repository";
import { STAND_PRODUCT_REPOSITORY } from "../../core/domain/repositories/stand-product.repository.interface";
import { StandProductRepository } from "../../core/infrastructure/repositories/stand-product.repository";
import { ORDER_REPOSITORY } from "../../core/domain/repositories/order.repository.interface";
import { OrderRepository } from "../../core/infrastructure/repositories/order.repository";
import { CreateStandUseCase } from "../../core/application/use-cases/stands/create-stand.use-case";
import { GetStandUseCase } from "../../core/application/use-cases/stands/get-stand.use-case";
import { GetStandsUseCase } from "../../core/application/use-cases/stands/get-stands.use-case";
import { UpdateStandUseCase } from "../../core/application/use-cases/stands/update-stand.use-case";
import { AddOperatorUseCase } from "../../core/application/use-cases/stands/add-operator.use-case";
import { RemoveOperatorUseCase } from "../../core/application/use-cases/stands/remove-operator.use-case";
import { AddProductToStandUseCase } from "../../core/application/use-cases/stand-catalog/add-product-to-stand.use-case";
import { RemoveProductFromStandUseCase } from "../../core/application/use-cases/stand-catalog/remove-product-from-stand.use-case";
import { GetStandCatalogUseCase } from "../../core/application/use-cases/stand-catalog/get-stand-catalog.use-case";
import { GetProductStandsUseCase } from "../../core/application/use-cases/stand-catalog/get-product-stands.use-case";
import { GetStandPendingItemsUseCase } from "../../core/application/use-cases/stand-catalog/get-stand-pending-items.use-case";

@Module({
  imports: [AuthModule],
  controllers: [StandsController],
  providers: [
    { provide: STAND_REPOSITORY, useClass: StandRepository },
    { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
    { provide: STAND_PRODUCT_REPOSITORY, useClass: StandProductRepository },
    { provide: ORDER_REPOSITORY, useClass: OrderRepository },
    CreateStandUseCase,
    GetStandUseCase,
    GetStandsUseCase,
    UpdateStandUseCase,
    AddOperatorUseCase,
    RemoveOperatorUseCase,
    AddProductToStandUseCase,
    RemoveProductFromStandUseCase,
    GetStandCatalogUseCase,
    GetProductStandsUseCase,
    GetStandPendingItemsUseCase,
  ],
  exports: [STAND_PRODUCT_REPOSITORY, STAND_REPOSITORY],
})
export class StandsModule {}
