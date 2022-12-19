import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from 'src/shared';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService],
})
export class UserModule {}
