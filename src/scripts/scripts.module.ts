import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from 'nestjs-command';

import configs from 'src/common/config';
import { DatabaseModule } from 'src/common/database/database.module';

import { UserSeed } from './seeds/user.seed';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
        }),
        DatabaseModule,
        CommandModule,
    ],
    providers: [UserSeed],
})
export class ScriptsModule {}
