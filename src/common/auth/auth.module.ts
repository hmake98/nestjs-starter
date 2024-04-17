import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { HelperModule } from '../helper/helper.module';
import { BullModule } from '@nestjs/bull';
import { BullQueues } from 'src/app/app.constant';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    BullModule.registerQueue({
      name: BullQueues.EMAIL,
    }),
    HelperModule,
    PassportModule,
  ],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
