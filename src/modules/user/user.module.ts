import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Module } from "@nestjs/common";
import { TokenService } from "src/shared/services/token.service";
import { FileService } from "src/shared/services/file.service";
import { NotificationConsumer } from "src/shared";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "notification",
    }),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService, FileService, NotificationConsumer],
  exports: [UserService],
})
export class UserModule {}
