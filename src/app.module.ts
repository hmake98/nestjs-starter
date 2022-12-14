import { FileService } from "./shared/services/file.service";
import { EmailService } from "./shared/services/email.service";
import { AdminModule } from "./modules/admin/admin.module";
import { AdminController } from "./modules/admin/admin.controller";
import { TokenService } from "./shared/services/token.service";
import { UserModule } from "./modules/user/user.module";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { UserController } from "./modules/user/user.controller";
import { PostModule } from "./modules";
import { PostController } from "./modules/post/post.controller";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigService } from "./shared/services/config.service";
import { BullModule } from "@nestjs/bull";
import { I18nModule, QueryResolver, AcceptLanguageResolver } from "nestjs-i18n";
import { ErrorExceptionsFilter } from "./core/interceptors";
import { APP_FILTER } from "@nestjs/core";
import * as path from "path";

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === "development" ? "debug" : "info",
        transport: process.env.NODE_ENV === "development" ? { target: "pino-pretty", options: { singleLine: true } } : undefined,
        formatters: {
          level: label => {
            return { level: label };
          },
        },
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ["lang"] }, AcceptLanguageResolver],
    }),
    AdminModule,
    UserModule,
    PostModule,
    TerminusModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("redis").host,
          port: configService.get("redis").port,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminController, HealthController, UserController, PostController],
  providers: [
    FileService,
    EmailService,
    TokenService,
    {
      provide: APP_FILTER,
      useClass: ErrorExceptionsFilter,
    },
  ],
})
export class AppModule {}
