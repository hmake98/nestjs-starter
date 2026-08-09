import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    url: configService.getOrThrow<string>('redis.url'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [BullModule],
})
export class BullMqModule {}
