import { Module } from "@nestjs/common";
import { ConfigModule } from "src/config/config.module";
import { PrismaService } from "src/shared";
import { EmailService } from "src/shared/services/email.service";
import { TokenService } from "src/shared/services/token.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [ConfigModule],
  controllers: [AdminController],
  providers: [AdminService, TokenService, EmailService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
