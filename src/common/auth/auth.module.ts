import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: { expiresIn: configService.get('auth.tokenExp') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, ConfigService],
})
export class AuthModule {}
