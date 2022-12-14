import { Module } from "@nestjs/common";
import { EmailService } from "src/shared/services/email.service";
import { TokenService } from "src/shared/services/token.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  controllers: [AdminController],
  providers: [AdminService, TokenService, EmailService],
  exports: [AdminService],
})
export class AdminModule {}
