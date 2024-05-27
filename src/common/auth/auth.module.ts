import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';

import { HelperModule } from '../helper/helper.module';
import { BullQueues } from '../notification/constants/notification.constants';

import { AuthService } from './services/auth.service';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    BullModule.registerQueue({
      name: BullQueues.EMAIL_QUEUE,
    }),
    HelperModule,
    PassportModule,
  ],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
