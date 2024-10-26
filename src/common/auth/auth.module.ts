import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { APP_BULL_QUEUES } from 'src/app/enums/app.enum';

import { DatabaseModule } from '../database/database.module';
import { HelperModule } from '../helper/helper.module';

import { AuthPublicController } from './controllers/auth.public.controller';
import { JwtAccessStrategy } from './providers/access-jwt.strategy';
import { JwtRefreshStrategy } from './providers/refresh-jwt.strategy';
import { AuthService } from './services/auth.service';

@Module({
    controllers: [AuthPublicController],
    imports: [
        HelperModule,
        PassportModule,
        DatabaseModule,
        BullModule.registerQueue({
            name: APP_BULL_QUEUES.EMAIL,
        }),
    ],
    providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
    exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
