import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './providers/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { HelperModule } from '../helper/helper.module';
import { BullModule } from '@nestjs/bull';
import { BullQueues } from 'src/app/app.constant';

@Module({
  controllers: [AuthController],
  imports: [
    HelperModule,
    PassportModule,
    BullModule.registerQueue({
      name: BullQueues.EMAIL,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: { expiresIn: configService.get('auth.tokenExp') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
