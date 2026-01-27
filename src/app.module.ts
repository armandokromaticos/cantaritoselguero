import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./core/infrastructure/database/prisma/prisma.module";
import { SupabaseModule } from "./core/infrastructure/supabase/supabase.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [PrismaModule, SupabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
