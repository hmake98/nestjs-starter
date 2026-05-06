import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        // Queue Management - Bull/Redis
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get<string>('redis.url'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [],
    exports: [],
})
export class BullMqModule {}
