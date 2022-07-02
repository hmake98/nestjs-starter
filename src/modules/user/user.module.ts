import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TokenService } from 'src/shared/services/token.service';
import { ConfigModule } from 'src/config/config.module';
import { FileService } from 'src/shared/services/file.service';
import { NotificationConsumer, PrismaService } from 'src/shared';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService, FileService, PrismaService, NotificationConsumer],
  exports: [UserService],
})
export class UserModule {}
