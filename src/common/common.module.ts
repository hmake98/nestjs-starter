import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configs from '../config';

import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    AuthModule,
    AwsModule,
    FilesModule,
    HelperModule,
    DatabaseModule,

    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
  ],
})
export class CommonModule {}
