import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configs from '../config';

import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { HelperModule } from './helper/helper.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    AuthModule,
    FilesModule,
    HelperModule,
    DatabaseModule,
  ],
})
export class CommonModule {}
