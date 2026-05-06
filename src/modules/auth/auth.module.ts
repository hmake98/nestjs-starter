import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/modules/user/user.module';

import { AuthPublicController } from './controllers/auth.public.controller';
import { JwtAccessStrategy } from './providers/jwt-access.strategy';
import { JwtRefreshStrategy } from './providers/jwt-refresh.strategy';
import { AuthService } from './services/auth.service';

@Module({
    imports: [UserModule, PassportModule, JwtModule.register({})],
    controllers: [AuthPublicController],
    providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
    exports: [AuthService],
})
export class AuthModule {}
