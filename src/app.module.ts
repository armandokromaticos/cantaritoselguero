import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./core/infrastructure/database/prisma/prisma.module";
import { SupabaseModule } from "./core/infrastructure/supabase/supabase.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProductsModule } from "./modules/products/products.module";
import { StandsModule } from "./modules/stands/stands.module";
import { CombosModule } from "./modules/combos/combos.module";
import { OrdersModule } from "./modules/orders/orders.module";

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    StandsModule,
    CombosModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger("HTTP");

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((request: Request, response: Response, next: NextFunction) => {
        const start = Date.now();
        response.on("finish", () => {
          this.logger.log(
            `${request.method} ${request.originalUrl} ${response.statusCode} - ${Date.now() - start}ms`,
          );
        });
        next();
      })
      .forRoutes("*");
  }
}
