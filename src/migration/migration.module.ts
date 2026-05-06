import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';

import configs from 'src/app/config';
import { UserModule } from 'src/modules/user/user.module';

import { UserSeed } from './seeds/user.seed';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
        }),
        UserModule,
        CommandModule,
    ],
    providers: [UserSeed],
})
export class MigrationModule {}
