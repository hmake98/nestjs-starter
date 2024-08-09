import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { HelperModule } from '../helper/helper.module';

import { AuthService } from './services/auth.service';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [HelperModule, PassportModule],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
