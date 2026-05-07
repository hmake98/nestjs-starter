import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    url: configService.getOrThrow<string>('REDIS_URL'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [BullModule],
})
export class BullMqModule {}
