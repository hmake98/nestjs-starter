import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ENUM_BULL_QUEUES } from 'src/app/app.constant';

import { DatabaseModule } from '../database/database.module';
import { HelperModule } from '../helper/helper.module';

import { AuthController } from './controllers/auth.controller';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  imports: [
    HelperModule,
    PassportModule,
    DatabaseModule,
    BullModule.registerQueue({
      name: ENUM_BULL_QUEUES.EMAIL,
    }),
  ],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
