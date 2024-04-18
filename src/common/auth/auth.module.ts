import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { HelperModule } from '../helper/helper.module';
import { BullModule } from '@nestjs/bull';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';
import { BullQueues } from '../notification/constants/notification.constants';

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
